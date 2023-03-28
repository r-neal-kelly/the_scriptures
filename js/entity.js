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
export class Animation_Frame {
    constructor({ now, start, elapsed, }) {
        this.now = now;
        this.start = start;
        this.elapsed = elapsed;
        Object.freeze(this);
    }
    Now() {
        return this.now;
    }
    Start() {
        return this.start;
    }
    Elapsed() {
        return this.elapsed;
    }
}
export class Instance {
    constructor({ element, parent, event_grid, }) {
        Utils.Assert(Instance.next_id !== Infinity, `Can't create another ID!`);
        this.is_alive = false;
        this.id = Instance.next_id++;
        this.element = element instanceof HTMLElement ?
            element :
            document.createElement(element);
        this.event_grid = event_grid;
        this.parent = null;
        this.children = new Map();
        this.may_adopt_and_abort = false;
        this.Live(parent);
    }
    Live(parent) {
        if (!this.Is_Alive()) {
            this.is_alive = true;
            this.element.setAttribute(`id`, `Entity_${Instance.origin_id}_${this.ID()}`);
            this.Event_Grid().Add_Many_Listeners(this, this.On_Life());
            // We only refresh when there is no parent
            // because the parent itself will refresh
            // its children through this event.
            if (parent != null) {
                parent.Adopt_Child(this);
            }
            else {
                // Waiting here allows the derived type to
                // finish its constructor before Refresh.
                (function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield Utils.Wait_Milliseconds(1);
                        this.Refresh();
                    });
                }).bind(this)();
            }
        }
    }
    Refresh() {
        if (this.Is_Alive()) {
            this.may_adopt_and_abort = true;
            this.On_Refresh();
            this.may_adopt_and_abort = false;
            for (const child of this.children.values()) {
                child.Refresh();
            }
            this.Restyle();
        }
    }
    Restyle() {
        if (this.Is_Alive()) {
            this.Element().setAttribute(`style`, this.On_Restyle());
            for (const child of this.children.values()) {
                child.Restyle();
            }
        }
    }
    Die() {
        if (this.Is_Alive()) {
            this.Before_Death();
            for (const child of this.children.values()) {
                child.Die();
            }
            if (this.Has_Parent()) {
                const parent = this.Parent();
                const parent_element = parent.Element();
                const child_element = this.Element();
                if (child_element.parentElement === parent_element) {
                    parent_element.removeChild(child_element);
                }
                this.parent = null;
                parent.children.delete(child_element);
            }
            this.Event_Grid().Remove(this);
            this.element = document.body;
            this.is_alive = false;
        }
    }
    On_Life() {
        return [];
    }
    On_Refresh() {
        return;
    }
    On_Restyle() {
        return ``;
    }
    Before_Death() {
        return;
    }
    Is_Alive() {
        return this.is_alive;
    }
    ID() {
        Utils.Assert(this.Is_Alive(), `Cannot get an ID from a dead entity.`);
        return this.id;
    }
    Element() {
        Utils.Assert(this.Is_Alive(), `Cannot get an element from a dead entity.`);
        return this.element;
    }
    Has_Parent() {
        Utils.Assert(this.Is_Alive(), `Cannot know if a dead entity has a parent.`);
        return this.parent != null;
    }
    Parent() {
        Utils.Assert(this.Is_Alive(), `Cannot get a parent from a dead entity.`);
        Utils.Assert(this.Has_Parent(), `Entity does not have a parent, use Maybe_Parent or Has_Parent.`);
        return this.parent;
    }
    Maybe_Parent() {
        Utils.Assert(this.Is_Alive(), `Cannot get a parent from a dead entity.`);
        return this.parent;
    }
    Child_Count() {
        Utils.Assert(this.Is_Alive(), `Cannot know a dead entity's child count.`);
        return this.children.size;
    }
    Has_Child(child_index) {
        Utils.Assert(this.Is_Alive(), `Cannot know if a dead entity has a child.`);
        Utils.Assert(child_index >= 0, `Cannot have an index less than 0.`);
        return child_index < this.Child_Count();
    }
    Child(child_index) {
        Utils.Assert(this.Is_Alive(), `Cannot get a child from a dead entity.`);
        Utils.Assert(child_index >= 0, `Cannot have an index less than 0.`);
        Utils.Assert(this.Has_Child(child_index), `Entity does not have the indexed child, use Maybe_Child or Has_Child.`);
        return this.children.get(this.Element().children[child_index]);
    }
    Maybe_Child(child_index) {
        if (this.Has_Child(child_index)) {
            return this.Child(child_index);
        }
        else {
            return null;
        }
    }
    Children() {
        Utils.Assert(this.Is_Alive(), `Cannot get children from a dead entity.`);
        return Array.from(this.Element().children).map(function (child) {
            return this.children.get(child);
        }.bind(this));
    }
    Adopt_Child(child) {
        Utils.Assert(this.Is_Alive(), `A parent must be alive to adopt a child.`);
        Utils.Assert(this.may_adopt_and_abort === true, `You can only adopt a child during On_Refresh().`);
        Utils.Assert(child.Is_Alive(), `A child must be alive to be adopted.`);
        Utils.Assert(!child.Has_Parent(), `A child must not have a parent to be adopted.`);
        Utils.Assert(this.Child_Count() + 1 < Infinity, `Can not add any more children!`);
        this.children.set(child.Element(), child);
        child.parent = this;
        this.Element().appendChild(child.Element());
    }
    Abort_Child(child) {
        Utils.Assert(this.Is_Alive(), `A parent must be alive to abort a child.`);
        Utils.Assert(this.may_adopt_and_abort === true, `You can only abort a child during On_Refresh().`);
        Utils.Assert(child.Is_Alive(), `A child must be alive to be aborted.`);
        Utils.Assert(child.Parent() === this, `A child must have this parent to be aborted.`);
        child.Die();
    }
    Abort_All_Children() {
        for (const child of Array.from(this.children.values())) {
            this.Abort_Child(child);
        }
    }
    Event_Grid() {
        Utils.Assert(this.Is_Alive(), `Cannot get an event grid from a dead entity.`);
        return this.event_grid;
    }
    Send(event_info) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.Event_Grid().Send(event_info);
        });
    }
    Animate(keyframes, options) {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(keyframes.length >= 2, `Must have at least two keyframes.`);
            Utils.Assert(keyframes[0].offset === 0.0, `First keyframe's offset must be 0.0`);
            Utils.Assert(keyframes[keyframes.length - 1].offset === 1.0, `Last keyframe's offset must be 1.0`);
            Utils.Assert(options.direction === undefined ||
                options.direction === `normal` ||
                options.direction === `reverse`, `Invalid direction.`);
            Utils.Assert(options.fill === undefined ||
                options.fill === `both`, `Invalid fill.`);
            if (options.direction === undefined) {
                options.direction = `normal`;
            }
            if (options.fill === undefined) {
                // there's something wrong with setting this in Chromium,
                // and it causes JavaScript style sets to not work afterwards.
                // We simulate `both` below, which is necessary to avoid this bug
                // and also to keep our component model's styles up to date.
                options.fill = `none`;
            }
            if (this.Is_Alive()) {
                const element = this.Element();
                let first_keyframe;
                let last_keyframe;
                if (options.direction === `normal`) {
                    first_keyframe = keyframes[0];
                    last_keyframe = keyframes[keyframes.length - 1];
                }
                else {
                    first_keyframe = keyframes[keyframes.length - 1];
                    last_keyframe = keyframes[0];
                }
                for (const [key, value] of Object.entries(first_keyframe)) {
                    if (key !== `offset` && value != null) {
                        element.style[key] = value.toString();
                    }
                }
                yield new Promise(function (resolve) {
                    const animation = new Animation(new KeyframeEffect(element, keyframes, options));
                    animation.onfinish = function (event) {
                        resolve();
                    };
                    animation.play();
                });
                // We skip checking if it's still alive so that we ensure even a dead element
                // goes back to its former state, e.g. when using the HTMLBodyElement.
                for (const [key, value] of Object.entries(last_keyframe)) {
                    if (key !== `offset` && value != null) {
                        element.style[key] = value.toString();
                    }
                }
            }
        });
    }
    Animate_By_Frame(on_frame, state) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve) {
                let start = null;
                let last = -1.0;
                function Loop(now) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (this.Is_Alive()) {
                            if (start == null) {
                                start = now;
                            }
                            if (last !== now) {
                                last = now;
                                if (yield on_frame(new Animation_Frame({
                                    now: now,
                                    start: start,
                                    elapsed: now - start,
                                }), state)) {
                                    window.requestAnimationFrame(Loop.bind(this));
                                }
                                else {
                                    resolve();
                                }
                            }
                            else {
                                window.requestAnimationFrame(Loop.bind(this));
                            }
                        }
                        else {
                            resolve();
                        }
                    });
                }
                window.requestAnimationFrame(Loop.bind(this));
            }.bind(this));
        });
    }
}
Instance.origin_id = new Date().getTime();
Instance.next_id = 0;
