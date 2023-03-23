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
    constructor(element, event_grid) {
        Utils.Assert(Instance.next_id !== Infinity, `Can't create another ID!`);
        this.id = Instance.next_id++;
        this.element = element instanceof HTMLBodyElement ?
            element :
            document.createElement(element);
        this.styles = {};
        this.parent = null;
        this.children = [];
        this.event_grid = event_grid;
        this.life_cycle_queue = new Queue.Instance();
        this.is_alive = true;
        this.Live();
    }
    Is_Alive() {
        return this.is_alive;
    }
    Live() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.life_cycle_queue.Enqueue(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    // waiting here allows the constructor
                    // of the derived type to finish before this is called
                    // we could alternatively have the derived type call this func
                    yield Utils.Wait_Milliseconds(1);
                    if (this.Is_Alive()) {
                        const listeners = yield this.On_Life();
                        if (this.Is_Alive()) {
                            this.Event_Grid().Add_Many_Listeners(this, listeners);
                            this.Apply_Styles(yield this.On_Restyle());
                            if (this.Is_Alive()) {
                                yield this.On_Refresh();
                            }
                        }
                    }
                });
            }.bind(this));
        });
    }
    Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.life_cycle_queue.Enqueue(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.Is_Alive()) {
                        // We need to restyle before we do
                        // children so they have up to date data.
                        this.Apply_Styles(yield this.On_Restyle());
                        if (this.Is_Alive()) {
                            // It's assumed that order may matter,
                            // and thus we treat the children as a stack
                            // both during life and death.
                            for (const child of this.children) {
                                yield child.Restyle();
                                if (!this.Is_Alive()) {
                                    break;
                                }
                            }
                        }
                    }
                });
            }.bind(this));
        });
    }
    Apply_Styles(styles) {
        Utils.Assert(this.Is_Alive(), `Cannot apply styles on a dead entity.`);
        if (styles instanceof Object) {
            this.styles = Object.assign(this.styles, styles);
        }
        else {
            const styles_object = {};
            const styles_array = styles.split(/\s*;\s*/).map(s => s.match(/[^\s:]+/g));
            for (const style of styles_array) {
                if (style != null &&
                    style.length === 2) {
                    styles_object[style[0]] = style[1];
                }
            }
            this.styles = Object.assign(this.styles, styles_object);
        }
        this.Element().setAttribute(`style`, Object.entries(this.styles).map(([property, value]) => `${property}: ${value};`).join(`\n`));
    }
    Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.life_cycle_queue.Enqueue(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.Is_Alive()) {
                        // We need to restyle and refresh
                        // before we work on children so they
                        // have up to date data. Also because
                        // On_Refresh can add and remove children.
                        this.Apply_Styles(yield this.On_Restyle());
                        if (this.Is_Alive()) {
                            yield this.On_Refresh();
                            if (this.Is_Alive()) {
                                // It's assumed that order may matter,
                                // and thus we treat the children as a stack
                                // both during life and death.
                                for (const child of this.children) {
                                    yield child.Refresh();
                                    if (!this.Is_Alive()) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                });
            }.bind(this));
        });
    }
    Die() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.life_cycle_queue.Enqueue(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.Is_Alive()) {
                        // We callback the override first so that the parent and children
                        // are still accessible to the handler.
                        yield this.Before_Death();
                        // We currently do this backwards and in order to prevent
                        // unnecessary array rewrites which could be quite inefficient
                        // when there are a lot of children.
                        yield this.Kill_All_Children();
                        yield this.On_Death();
                        if (this.Has_Parent()) {
                            this.Parent().Remove_Child(this);
                        }
                        this.Event_Grid().Remove(this);
                        this.element = document.body;
                        this.is_alive = false;
                    }
                });
            }.bind(this));
        });
    }
    On_Life() {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    Before_Death() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    On_Death() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    // maybe add On_Adopted and On_Orphaned
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
        return this.children.length;
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
        return this.children[child_index];
    }
    Maybe_Child(child_index) {
        Utils.Assert(this.Is_Alive(), `Cannot get a child from a dead entity.`);
        Utils.Assert(child_index >= 0, `Cannot have an index less than 0.`);
        if (this.Has_Child(child_index)) {
            return this.children[child_index];
        }
        else {
            return null;
        }
    }
    Children() {
        Utils.Assert(this.Is_Alive(), `Cannot get children from a dead entity.`);
        return Array.from(this.children);
    }
    Add_Child(child) {
        Utils.Assert(this.Is_Alive(), `A parent must be alive to add a child.`);
        Utils.Assert(child.Is_Alive(), `A child must be alive to be added to a parent.`);
        Utils.Assert(!child.Has_Parent(), `A child must not have a parent to be added to another parent.`);
        this.Element().appendChild(child.Element());
        this.children.push(child);
        child.parent = this;
    }
    Remove_Child(child) {
        Utils.Assert(this.Is_Alive(), `A parent must be alive to remove a child.`);
        Utils.Assert(child.Is_Alive(), `A child must be alive to be removed from a parent.`);
        Utils.Assert(child.Has_Parent(), `A child must have a parent to be removed from a parent.`);
        Utils.Assert(child.Parent() === this, `A child must have this parent to be removed from it.`);
        this.Remove_Child_At(this.children.indexOf(child));
    }
    Remove_Child_At(child_index) {
        Utils.Assert(this.Is_Alive(), `A parent must be alive to remove a child.`);
        Utils.Assert(this.Has_Child(child_index), `Cannot remove a child the parent doesn't have.`);
        const child = this.children[child_index];
        Utils.Assert(child.Is_Alive());
        Utils.Assert(child.Has_Parent());
        Utils.Assert(child.Parent() === this);
        this.Element().removeChild(child.Element());
        for (let idx = child_index + 1, end = this.Child_Count(); idx < end; idx += 1) {
            this.children[idx - 1] = this.children[idx];
        }
        this.children.pop();
        child.parent = null;
        return child;
    }
    Remove_All_Children() {
        Utils.Assert(this.Is_Alive(), `A parent must be alive to remove its children.`);
        const children = this.Children();
        const element = this.Element();
        for (const child of children) {
            element.removeChild(child.Element());
            child.parent = null;
        }
        this.children = [];
        return children;
    }
    Kill_Child_At(child_index) {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(this.Is_Alive(), `Cannot kill child of a dead parent.`);
            Utils.Assert(this.Has_Child(child_index), `Cannot kill a child the parent doesn't have.`);
            const child = this.children[child_index];
            Utils.Assert(child.Is_Alive());
            Utils.Assert(child.Has_Parent());
            Utils.Assert(child.Parent() === this);
            yield child.Die();
        });
    }
    Kill_All_Children() {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(this.Is_Alive(), `Cannot kill children of a dead parent.`);
            const children = this.Children();
            for (let idx = children.length, end = 0; idx > end;) {
                idx -= 1;
                yield children[idx].Die();
            }
        });
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
                // Currently not checking if is alive so that we ensure even a dead element
                // goes back to its former state before being animated.
                for (const [key, value] of Object.entries(last_keyframe)) {
                    if (key !== `offset` && value != null) {
                        const value_string = value.toString();
                        this.styles[key] = value_string;
                        element.style[key] = value_string;
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
Instance.next_id = 0;
