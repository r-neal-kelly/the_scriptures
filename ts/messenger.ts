import { Integer } from "./types.js";
import { Count } from "./types.js";
import { Index } from "./types.js";
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

    /*
        Waits to execute when no other publications are executing,
        makes subsequent immediate and queued publications wait,
        and discards other exclusive publications while its executing.
    */
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

/*
    Allows for subscriber handlers to be called in orderly batches during a publication.
    Negative Integers are called before positive. If multiple subscribers have the same
    priority, they are called in batch through Promise.all().
*/
export type Subscriber_Priority =
    Integer;

/* Used when subscribing to a publisher. */
export type Subscriber_Info = {
    handler: Subscriber_Handler;
    priority: Subscriber_Priority;
}

/* Contains a register of subscribers which can be published to. */
class Publisher
{
    private subscribers: { [index: Subscriber_ID]: Subscriber };
    private priorities: { [index: Subscriber_Priority]: Array<Subscriber> };
    private next_subscriber_id: Subscriber_ID;
    private immediate_publication_count: Count;
    private queued_publications: Queue.Instance;
    private has_exclusive_publication: boolean;

    constructor()
    {
        this.subscribers = {};
        this.priorities = {};
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

        const subscriber: Subscriber = new Subscriber(subscriber_info);
        const subscriber_id: Subscriber_ID = this.next_subscriber_id++;
        const subscriber_priority: Subscriber_Priority = subscriber.Priority();

        this.subscribers[subscriber_id] = subscriber;

        if (this.priorities[subscriber_priority] == null) {
            this.priorities[subscriber_priority] = [];
        }
        this.priorities[subscriber_priority].push(subscriber);

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

        const subscriber: Subscriber = this.subscribers[subscriber_id];
        const subscriber_priority: Subscriber_Priority = subscriber.Priority();

        const priority: Array<Subscriber> = this.priorities[subscriber_priority];
        priority[priority.indexOf(subscriber)] = priority[priority.length - 1];
        priority.pop();
        if (priority.length === 0) {
            delete this.priorities[subscriber_priority];
        }

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
            if (this.has_exclusive_publication === false) {
                this.has_exclusive_publication = true;

                await Promise.all([
                    (
                        async function (
                            this: Publisher,
                        ):
                            Promise<void>
                        {
                            while (this.immediate_publication_count > 0) {
                                await Utils.Wait_Milliseconds(1);
                            }
                        }.bind(this)
                    )(),
                    this.queued_publications.Pause(),
                ]);
                await this.Execute(data);
                this.queued_publications.Unpause();

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
        // we could cache this also, but probably not necessary
        const priorities: Array<Subscriber_Priority> = Object.keys(this.priorities).map(
            function (
                priority: string,
            ):
                Subscriber_Priority
            {
                if (priority === `Infinity`) {
                    return Infinity;
                } else if (priority === `-Infinity`) {
                    return -Infinity;
                } else {
                    return parseInt(priority);
                }
            },
        ).sort(
            function (
                priority_a: Subscriber_Priority,
                priority_b: Subscriber_Priority,
            ):
                Integer
            {
                return priority_a - priority_b;
            },
        );

        for (const priority of priorities) {
            await Promise.all(
                this.priorities[priority].map(
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
}

/* Contains relevant info and options that are used when publishing an event to a subscriber. */
class Subscriber
{
    private handler: Subscriber_Handler;
    private priority: Subscriber_Priority;

    constructor(
        {
            handler,
            priority,
        }: Subscriber_Info,
    )
    {
        this.handler = handler;
        this.priority = priority;

        Object.freeze(this);
    }

    Handler():
        Subscriber_Handler
    {
        return this.handler;
    }

    Priority():
        Subscriber_Priority
    {
        return this.priority;
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
