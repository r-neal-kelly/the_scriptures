var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "./utils.js";
import * as Execution from "./execution.js";
export { Type as Publication_Type } from "./execution.js";
/* Used when publishing an event. */
export class Publication_Info {
    constructor({ type, data, }) {
        this.type = type;
        this.data = data;
        Object.freeze(this);
    }
    Type() {
        return this.type;
    }
    Data() {
        return this.data;
    }
}
/* Used when subscribing to a publisher. */
export class Subscriber_Info {
    constructor({ handler, priority, }) {
        this.handler = handler;
        this.priority = priority;
        Object.freeze(this);
    }
    Handler() {
        return this.handler;
    }
    Priority() {
        return this.priority;
    }
}
/* Contains a register of subscribers which can be published to. */
class Publisher {
    constructor() {
        this.subscribers = {};
        this.priorities = {};
        this.next_subscriber_id = 0;
        this.execution_frame = new Execution.Frame();
    }
    Subscribe(subscriber_info) {
        Utils.Assert(this.next_subscriber_id !== Infinity, `Ran out of unique subscriber_ids!`);
        const subscriber = new Subscriber(subscriber_info);
        const subscriber_id = this.next_subscriber_id++;
        const subscriber_priority = subscriber.Priority();
        this.subscribers[subscriber_id] = subscriber;
        if (this.priorities[subscriber_priority] == null) {
            this.priorities[subscriber_priority] = [];
        }
        this.priorities[subscriber_priority].push(subscriber);
        return subscriber_id;
    }
    Unsubscribe(subscriber_id) {
        Utils.Assert(this.subscribers[subscriber_id] != null, `Subscriber with id "${subscriber_id}" does not exist.`);
        const subscriber = this.subscribers[subscriber_id];
        const subscriber_priority = subscriber.Priority();
        const priority = this.priorities[subscriber_priority];
        priority[priority.indexOf(subscriber)] = priority[priority.length - 1];
        priority.pop();
        if (priority.length === 0) {
            delete this.priorities[subscriber_priority];
        }
        delete this.subscribers[subscriber_id];
    }
    Publish(publication_info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execution_frame.Execute(publication_info.Type(), function () {
                return __awaiter(this, void 0, void 0, function* () {
                    // we could cache this also, but probably not necessary
                    const priorities = Object.keys(this.priorities).map(function (priority) {
                        if (priority === `Infinity`) {
                            return Infinity;
                        }
                        else if (priority === `-Infinity`) {
                            return -Infinity;
                        }
                        else {
                            return parseInt(priority);
                        }
                    }).sort(function (priority_a, priority_b) {
                        return priority_a - priority_b;
                    });
                    for (const priority of priorities) {
                        yield Promise.all(this.priorities[priority].map(function (subscriber) {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield subscriber.Handler()(publication_info.Data());
                            });
                        }));
                    }
                });
            }.bind(this));
        });
    }
}
/* Contains relevant info and options that are used when publishing an event to a subscriber. */
class Subscriber {
    constructor(info) {
        this.info = info;
        Object.freeze(this);
    }
    Handler() {
        return this.info.Handler();
    }
    Priority() {
        return this.info.Priority();
    }
}
/* A handle to a subscriber and their publisher, for the sake of unsubscribing. */
export class Subscription {
    constructor(publisher_name, subscriber_id) {
        this.publisher_name = publisher_name;
        this.subscriber_id = subscriber_id;
        Object.freeze(this);
    }
    Publisher_Name() {
        return this.publisher_name;
    }
    Subscriber_ID() {
        return this.subscriber_id;
    }
}
/* Used to decouple events, event creators, and event handlers, using the pub-sub pattern. */
export class Instance {
    constructor() {
        this.publishers = {};
    }
    Has_Publisher(publisher_name) {
        return this.publishers[publisher_name] != null;
    }
    Publisher(publisher_name) {
        Utils.Assert(this.Has_Publisher(publisher_name), `Publisher "${publisher_name}" does not exist.`);
        return this.publishers[publisher_name];
    }
    Maybe_Publisher(publisher_name) {
        return this.publishers[publisher_name];
    }
    Some_Publisher(publisher_name) {
        if (!this.Has_Publisher(publisher_name)) {
            this.publishers[publisher_name] = new Publisher();
        }
        return this.publishers[publisher_name];
    }
    Subscribe(publisher_name, subscriber_info) {
        return new Subscription(publisher_name, this.Some_Publisher(publisher_name).Subscribe(subscriber_info));
    }
    Unsubscribe(subscription) {
        this.Publisher(subscription.Publisher_Name()).Unsubscribe(subscription.Subscriber_ID());
    }
    Publish(publisher_name, publication_info) {
        return __awaiter(this, void 0, void 0, function* () {
            const publisher = this.Maybe_Publisher(publisher_name);
            if (publisher != null) {
                yield publisher.Publish(publication_info);
            }
        });
    }
}
