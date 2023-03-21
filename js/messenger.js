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
import * as Queue from "./queue.js";
/* Determines how publications from the same publisher execute in relation to one another. */
export var Publication_Execution;
(function (Publication_Execution) {
    /* Immediately executes, even if queued publications are executing. */
    Publication_Execution[Publication_Execution["IMMEDIATE"] = 0] = "IMMEDIATE";
    /* Waits to execute until previously queued publications finish. */
    Publication_Execution[Publication_Execution["QUEUED"] = 1] = "QUEUED";
    /*
        Waits to execute when no other publications are executing,
        makes subsequent immediate and queued publications wait,
        and discards other exclusive publications while its executing.
    */
    Publication_Execution[Publication_Execution["EXCLUSIVE"] = 2] = "EXCLUSIVE";
})(Publication_Execution || (Publication_Execution = {}));
/* Contains a register of subscribers which can be published to. */
class Publisher {
    constructor() {
        this.subscribers = {};
        this.next_subscriber_id = 0;
        this.immediate_publication_count = 0;
        this.queued_publications = new Queue.Instance();
        this.has_exclusive_publication = false;
    }
    Subscribe(subscriber_info) {
        Utils.Assert(this.next_subscriber_id !== Infinity, `Ran out of unique subscriber_ids!`);
        const subscriber_id = this.next_subscriber_id;
        this.next_subscriber_id += 1;
        this.subscribers[subscriber_id] = new Subscriber(subscriber_info);
        return subscriber_id;
    }
    Unsubscribe(subscriber_id) {
        Utils.Assert(this.subscribers[subscriber_id] != null, `Subscriber with id "${subscriber_id}" does not exist.`);
        delete this.subscribers[subscriber_id];
    }
    Publish({ execution, data, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (execution === Publication_Execution.IMMEDIATE) {
                while (this.has_exclusive_publication === true) {
                    yield Utils.Wait_Milliseconds(1);
                }
                this.immediate_publication_count += 1;
                yield this.Execute(data);
                this.immediate_publication_count -= 1;
            }
            else if (execution === Publication_Execution.QUEUED) {
                while (this.has_exclusive_publication === true) {
                    yield Utils.Wait_Milliseconds(1);
                }
                yield this.queued_publications.Enqueue(function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.Execute(data);
                    });
                }.bind(this));
            }
            else if (execution === Publication_Execution.EXCLUSIVE) {
                if (this.has_exclusive_publication === false) {
                    this.has_exclusive_publication = true;
                    yield Promise.all([
                        (function () {
                            return __awaiter(this, void 0, void 0, function* () {
                                while (this.immediate_publication_count > 0) {
                                    yield Utils.Wait_Milliseconds(1);
                                }
                            });
                        }.bind(this))(),
                        this.queued_publications.Pause(),
                    ]);
                    yield this.Execute(data);
                    this.queued_publications.Unpause();
                    this.has_exclusive_publication = false;
                }
            }
            else {
                Utils.Assert(false, `Unknown publication execution.`);
            }
        });
    }
    Execute(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(Object.values(this.subscribers).map(function (subscriber) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield subscriber.Handler()(data);
                });
            }));
        });
    }
}
/* Contains relevant info and options that are used when publishing an event to a subscriber. */
class Subscriber {
    constructor({ handler, }) {
        this.handler = handler;
        Object.freeze(this);
    }
    Handler() {
        return this.handler;
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
