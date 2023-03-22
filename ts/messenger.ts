import { Integer } from "./types.js";
import { ID } from "./types.js";
import { Name } from "./types.js";

import * as Utils from "./utils.js";
import * as Execution from "./execution.js";

/* Used both to subscribe and publish events. */
export type Publisher_Name = Name;

/* Determines how publications execute in relation to previous publications from the same publisher. */
import { Type as Publication_Type } from "./execution.js";
export { Type as Publication_Type } from "./execution.js";

/* Sent to a publisher's subscriber's handlers when a publication occurs. */
export type Publication_Data = any;

/* Used when publishing an event. */
export class Publication_Info
{
    private type: Publication_Type;
    private data: Publication_Data;

    constructor(
        {
            type,
            data,
        }: {
            type: Publication_Type,
            data: Publication_Data,
        },
    )
    {
        this.type = type;
        this.data = data;

        Object.freeze(this);
    }

    Type():
        Publication_Type
    {
        return this.type;
    }

    Data():
        Publication_Data
    {
        return this.data;
    }
}

/* Uniquely identifies a subscriber when paired with a publisher name. */
export type Subscriber_ID = ID;

/* Used as a callback for each subscriber when an publication occurs. */
export type Subscriber_Handler = (publication_data: Publication_Data) => void | Promise<void>;

/*
    Allows for subscriber handlers to be called in orderly batches during a publication.
    Negative Integers are called before positive. If multiple subscribers have the same
    priority, they are called in batch through Promise.all().
*/
export type Subscriber_Priority = Integer;

/* Used when subscribing to a publisher. */
export class Subscriber_Info
{
    private handler: Subscriber_Handler;
    private priority: Subscriber_Priority;

    constructor(
        {
            handler,
            priority,
        }: {
            handler: Subscriber_Handler,
            priority: Subscriber_Priority,
        },
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

/* Contains a register of subscribers which can be published to. */
class Publisher
{
    private subscribers: { [index: Subscriber_ID]: Subscriber };
    private priorities: { [index: Subscriber_Priority]: Array<Subscriber> };
    private next_subscriber_id: Subscriber_ID;
    private execution_frame: Execution.Frame;

    constructor()
    {
        this.subscribers = {};
        this.priorities = {};
        this.next_subscriber_id = 0;
        this.execution_frame = new Execution.Frame();
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
        publication_info: Publication_Info,
    ):
        Promise<void>
    {
        await this.execution_frame.Execute(
            publication_info.Type(),
            async function (
                this: Publisher,
            ):
                Promise<void>
            {
                // we could cache this also, but probably not necessary
                const priorities: Array<Subscriber_Priority> = Object.keys(
                    this.priorities,
                ).map(
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
                                await subscriber.Handler()(publication_info.Data());
                            },
                        ),
                    );
                }
            }.bind(this),
        );
    }
}

/* Contains relevant info and options that are used when publishing an event to a subscriber. */
class Subscriber
{
    private info: Subscriber_Info;

    constructor(
        info: Subscriber_Info,
    )
    {
        this.info = info;

        Object.freeze(this);
    }

    Handler():
        Subscriber_Handler
    {
        return this.info.Handler();
    }

    Priority():
        Subscriber_Priority
    {
        return this.info.Priority();
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
