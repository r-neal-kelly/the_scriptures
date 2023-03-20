import { Count } from "./types.js";
import { ID } from "./types.js";
import { Name } from "./types.js";

import * as Utils from "./utils.js";
import * as Queue from "./queue.js";

/* Used both to subscribe and publish events. */
export type Publisher_Name =
    Name;

/* Determines how publications from the same publisher execute in relation to one another. */
export enum Publication_Execution
{
    /* Immediately executes, even if queued publications are executing. */
    IMMEDIATE,

    /* Waits to execute until previously queued publications finish. */
    QUEUED,

    /* Executes only if no other publications are executing, and makes subsequent publications wait. */
    EXCLUSIVE,
}

/* Sent to a publisher's subscriber's handlers when a publication occurs. */
export type Publication_Data =
    any;

/* Used when publishing an event. */
export type Publication_Info = {
    execution: Publication_Execution;
    data: Publication_Data;
}

/* Uniquely identifies a subscriber when paired with a publisher name. */
export type Subscriber_ID =
    ID;

/* Used as a callback for each subscriber when an publication occurs. */
export type Subscriber_Handler =
    (publication_data: Publication_Data) => void | Promise<void>;

/* Used when subscribing to a publisher. */
export type Subscriber_Info = {
    handler: Subscriber_Handler;
}

/* Contains a register of subscribers which can be published to. */
class Publisher
{
    private subscribers: { [index: Subscriber_ID]: Subscriber };
    private next_subscriber_id: Subscriber_ID;
    private immediate_publication_count: Count;
    private queued_publications: Queue.Instance;
    private has_exclusive_publication: boolean;

    constructor()
    {
        this.subscribers = {};
        this.next_subscriber_id = 0;
        this.immediate_publication_count = 0;
        this.queued_publications = new Queue.Instance();
        this.has_exclusive_publication = false;
    }

    Subscribe(
        subscriber_info: Subscriber_Info,
    ):
        Subscriber_ID
    {
        Utils.Assert(
            this.next_subscriber_id !== Infinity,
            `Ran out of unique subscriber_ids!`,
        );

        const subscriber_id = this.next_subscriber_id;
        this.next_subscriber_id += 1;

        this.subscribers[subscriber_id] = new Subscriber(subscriber_info);

        return subscriber_id;
    }

    Unsubscribe(
        subscriber_id: Subscriber_ID,
    ):
        void
    {
        Utils.Assert(
            this.subscribers[subscriber_id] != null,
            `Subscriber with id "${subscriber_id}" does not exist.`,
        );

        delete this.subscribers[subscriber_id];
    }

    async Publish(
        {
            execution,
            data,
        }: Publication_Info,
    ):
        Promise<void>
    {
        if (execution === Publication_Execution.IMMEDIATE) {
            while (this.has_exclusive_publication === true) {
                await Utils.Wait_Milliseconds(1);
            }

            this.immediate_publication_count += 1;
            await this.Execute(data);
            this.immediate_publication_count -= 1;
        } else if (execution === Publication_Execution.QUEUED) {
            while (this.has_exclusive_publication === true) {
                await Utils.Wait_Milliseconds(1);
            }

            await this.queued_publications.Enqueue(
                async function (
                    this: Publisher,
                ):
                    Promise<void>
                {
                    await this.Execute(data);
                }.bind(this),
            );
        } else if (execution === Publication_Execution.EXCLUSIVE) {
            if (
                this.immediate_publication_count === 0 &&
                this.queued_publications.Count() === 0 &&
                this.has_exclusive_publication === false
            ) {
                this.has_exclusive_publication = true;
                await this.Execute(data);
                this.has_exclusive_publication = false;
            }
        } else {
            Utils.Assert(
                false,
                `Unknown publication execution.`,
            );
        }
    }

    private async Execute(
        data: Publication_Data,
    ):
        Promise<void>
    {
        await Promise.all(
            Object.values(this.subscribers).map(
                async function (
                    subscriber: Subscriber
                ):
                    Promise<void>
                {
                    await subscriber.Handler()(data);
                },
            ),
        );
    }
}

/* Contains relevant info and options that are used when publishing an event to a subscriber. */
class Subscriber
{
    private handler: Subscriber_Handler;

    constructor(
        {
            handler,
        }: Subscriber_Info,
    )
    {
        this.handler = handler;

        Object.freeze(this);
    }

    Handler():
        Subscriber_Handler
    {
        return this.handler;
    }
}

/* A handle to a subscriber and their publisher, for the sake of unsubscribing. */
export class Subscription
{
    private publisher_name: Publisher_Name;
    private subscriber_id: Subscriber_ID;

    constructor(
        publisher_name: Publisher_Name,
        subscriber_id: Subscriber_ID,
    )
    {
        this.publisher_name = publisher_name;
        this.subscriber_id = subscriber_id;

        Object.freeze(this);
    }

    Publisher_Name():
        Publisher_Name
    {
        return this.publisher_name;
    }

    Subscriber_ID():
        Subscriber_ID
    {
        return this.subscriber_id;
    }
}

/* Used to decouple events, event creators, and event handlers, using the pub-sub pattern. */
export class Instance
{
    private publishers: { [index: Publisher_Name]: Publisher };

    constructor()
    {
        this.publishers = {};
    }

    private Has_Publisher(
        publisher_name: Publisher_Name,
    ):
        boolean
    {
        return this.publishers[publisher_name] != null;
    }

    private Publisher(
        publisher_name: Publisher_Name,
    ):
        Publisher
    {
        Utils.Assert(
            this.Has_Publisher(publisher_name),
            `Publisher "${publisher_name}" does not exist.`,
        );

        return this.publishers[publisher_name] as Publisher;
    }

    private Maybe_Publisher(
        publisher_name: Publisher_Name,
    ):
        Publisher | null
    {
        return this.publishers[publisher_name];
    }

    private Some_Publisher(
        publisher_name: Publisher_Name,
    ):
        Publisher
    {
        if (!this.Has_Publisher(publisher_name)) {
            this.publishers[publisher_name] = new Publisher();
        }

        return this.publishers[publisher_name];
    }

    Subscribe(
        publisher_name: Publisher_Name,
        subscriber_info: Subscriber_Info,
    ):
        Subscription
    {
        return new Subscription(
            publisher_name,
            this.Some_Publisher(publisher_name).Subscribe(subscriber_info),
        );
    }

    Unsubscribe(
        subscription: Subscription,
    ):
        void
    {
        this.Publisher(subscription.Publisher_Name()).Unsubscribe(subscription.Subscriber_ID());
    }

    async Publish(
        publisher_name: Publisher_Name,
        publication_info: Publication_Info,
    ):
        Promise<void>
    {
        const publisher: Publisher | null =
            this.Maybe_Publisher(publisher_name);
        if (publisher != null) {
            await publisher.Publish(publication_info);
        }
    }
}
