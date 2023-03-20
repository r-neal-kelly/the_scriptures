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
export class Grid {
    constructor() {
        this.messenger = new Messenger.Instance();
        this.objects = new Map();
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
    Send(event_info) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Instance(this.messenger, event_info).Start();
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
    Execution[Execution["QUEUED"] = 1] = "QUEUED";
    Execution[Execution["EXCLUSIVE"] = 2] = "EXCLUSIVE";
})(Execution || (Execution = {}));
class Instance {
    constructor(messenger, { affix, suffixes = [], data = {}, execution = Execution.QUEUED, }) {
        Utils.Assert(data["event"] == null, `data contains a property called 'event' which will be overridden.`);
        Utils.Assert(!Object.isFrozen(data), `data must not be frozen to add the event to it. It will then be frozen for you.`);
        data["event"] = this;
        this.messenger = messenger;
        this.affix = affix;
        this.suffixes = Array.from(suffixes);
        this.execution = execution;
        this.data = Object.freeze(data);
        this.is_started = false;
        this.is_stopped = false;
    }
    Is_Started() {
        return this.is_started;
    }
    Is_Stopped() {
        return this.is_stopped;
    }
    Is_Running() {
        return this.Is_Started() && !this.Is_Stopped;
    }
    Start() {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(!this.Is_Started(), `This event has already been started.`);
            const publication_info = Object.freeze({
                execution: this.execution,
                data: this.data,
            });
            for (const prefix of [Prefix.BEFORE, Prefix.ON, Prefix.AFTER]) {
                if (!this.Is_Stopped()) {
                    const promises = this.suffixes.map(function (suffix) {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield this.messenger.Publish(new Name(prefix, this.affix, suffix).String(), publication_info);
                        });
                    }.bind(this));
                    promises.push(this.messenger.Publish(new Name(prefix, this.affix).String(), publication_info));
                    yield Promise.all(promises);
                }
            }
            this.Stop();
        });
    }
    /*
        Stops subsequent waves of the event, i.e.
        if this is called during the 'Before' wave,
        'On' and 'After' waves will never occur.
    */
    Stop() {
        this.is_stopped = true;
    }
}
;
