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
import * as Messenger from "./messenger.js";
import * as Queue from "./queue.js";
export class Grid {
    constructor() {
        this.messenger = new Messenger.Instance();
        this.objects = new Map();
        this.affix_queues = {};
    }
    Has(object) {
        return this.objects.has(object);
    }
    Add(object) {
        Utils.Assert(!this.Has(object), `This object is already in the grid.`);
        this.objects.set(object, new Listeners());
    }
    Add_Many(objects) {
        for (const object of objects) {
            this.Add(object);
        }
    }
    Remove(object) {
        Utils.Assert(this.Has(object), `This object is not in the grid.`);
        this.Remove_All_Listeners(object);
        this.objects.delete(object);
    }
    Remove_Many(objects) {
        for (const object of objects) {
            this.Remove(object);
        }
    }
    Remove_All() {
        for (const object of this.objects.keys()) {
            this.Remove(object);
        }
    }
    Some_Listeners(object) {
        if (!this.Has(object)) {
            this.Add(object);
        }
        return this.objects.get(object);
    }
    Has_Listener(object, listener_handle) {
        return this.Some_Listeners(object).Has(listener_handle);
    }
    Add_Listener(object, listener_info) {
        return this.Some_Listeners(object).Add({
            messenger: this.messenger,
            object: object,
            listener_info: listener_info,
        });
    }
    Add_Many_Listeners(object, listener_infos) {
        return this.Some_Listeners(object).Add_Many({
            messenger: this.messenger,
            object: object,
            listener_infos: listener_infos,
        });
    }
    Remove_Listener(object, listener_handle) {
        this.Some_Listeners(object).Remove({
            messenger: this.messenger,
            listener_handle: listener_handle,
        });
    }
    Remove_Many_Listeners(object, listener_handles) {
        this.Some_Listeners(object).Remove_Many({
            messenger: this.messenger,
            listener_handles: listener_handles,
        });
    }
    Remove_All_Listeners(object) {
        this.Some_Listeners(object).Remove_All({
            messenger: this.messenger,
        });
    }
    Some_Affix_Queue(affix) {
        if (this.affix_queues[affix] == null) {
            this.affix_queues[affix] = new Queue.Instance();
        }
        return this.affix_queues[affix];
    }
    Send(event_info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Instance(this.messenger, this.Some_Affix_Queue(event_info.affix), event_info).Execute();
        });
    }
}
;
class Listeners {
    constructor() {
        this.listener_handles = new Set();
    }
    Has(listener_handle) {
        return this.listener_handles.has(listener_handle);
    }
    Add({ messenger, object, listener_info, }) {
        const listener_handle = messenger.Subscribe(listener_info.event_name.String(), {
            handler: listener_info.event_handler.bind(object),
            priority: listener_info.event_priority,
        });
        this.listener_handles.add(listener_handle);
        return listener_handle;
    }
    Add_Many({ messenger, object, listener_infos, }) {
        const listener_handles = [];
        for (const listener_info of listener_infos) {
            listener_handles.push(this.Add({
                object,
                listener_info,
                messenger,
            }));
        }
        return listener_handles;
    }
    Remove({ messenger, listener_handle, }) {
        messenger.Unsubscribe(listener_handle);
        this.listener_handles.delete(listener_handle);
    }
    Remove_Many({ messenger, listener_handles, }) {
        for (const listener_handle of listener_handles) {
            this.Remove({
                listener_handle,
                messenger,
            });
        }
    }
    Remove_All({ messenger, }) {
        for (const listener_handle of this.listener_handles.values()) {
            this.Remove({
                listener_handle,
                messenger,
            });
        }
    }
}
;
export var Prefix;
(function (Prefix) {
    Prefix["BEFORE"] = "Before";
    Prefix["ON"] = "On";
    Prefix["AFTER"] = "After";
})(Prefix || (Prefix = {}));
export class Name {
    static Has_Dangling_Underscore(text) {
        return (text.length > 0 &&
            (text[0] === `_` ||
                text[text.length - 1] === `_`));
    }
    constructor(prefix, affix, suffix) {
        Utils.Assert(affix.length > 0, `The affix must have at least one character.`);
        Utils.Assert(!Name.Has_Dangling_Underscore(affix), `The affix cannot have a dangling '_' on the beginning or end of the string.`);
        Utils.Assert(suffix == null || suffix.length > 0, `The suffix must either be null or a string with at least one character.`);
        Utils.Assert(suffix == null || !Name.Has_Dangling_Underscore(suffix), `The suffix cannot have a dangling '_' on the beginning or end of the string.`);
        if (suffix != null) {
            this.text = `${prefix}_${affix}_${suffix}`;
        }
        else {
            this.text = `${prefix}_${affix}`;
        }
    }
    String() {
        return this.text;
    }
}
;
export var Execution;
(function (Execution) {
    Execution[Execution["IMMEDIATE"] = 0] = "IMMEDIATE";
    Execution[Execution["QUEUED"] = 1] = "QUEUED";
    Execution[Execution["EXCLUSIVE"] = 2] = "EXCLUSIVE";
})(Execution || (Execution = {}));
export class Instance {
    static From(data) {
        return data[Instance.KEY];
    }
    constructor(messenger, affix_queue, { affix, suffixes = [], data = {}, }) {
        Utils.Assert(!Object.isFrozen(data), `data will be frozen for you.`);
        data[Instance.KEY] = this;
        this.messenger = messenger;
        this.affix_queue = affix_queue;
        this.affix = affix;
        this.suffixes = Array.from(suffixes);
        this.data = Object.freeze(data);
        this.has_executed = false;
    }
    Has_Executed() {
        return this.has_executed;
    }
    Execute() {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(this.has_executed === false, `This event instance has already been executed.`);
            this.has_executed = true;
            yield this.affix_queue.Enqueue(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const publication_info = Object.freeze({
                        execution: Messenger.Publication_Execution.IMMEDIATE,
                        data: this.data,
                    });
                    for (const prefix of [Prefix.BEFORE, Prefix.ON, Prefix.AFTER]) {
                        const promises = this.suffixes.map(function (suffix) {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield this.messenger.Publish(new Name(prefix, this.affix, suffix).String(), publication_info);
                            });
                        }.bind(this));
                        promises.push(this.messenger.Publish(new Name(prefix, this.affix).String(), publication_info));
                        yield Promise.all(promises);
                    }
                });
            }.bind(this));
        });
    }
}
Instance.KEY = Symbol(`Used to get Event.Instance from Event.Data`);
;
