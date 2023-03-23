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
class Parent_And_Child {
    constructor({ parent, child, }) {
        this.parent = parent;
        this.child = child;
    }
    Parent() {
        return this.parent;
    }
    Child() {
        return this.child;
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
        this.refresh_adoptions = null;
        this.refresh_abortions = null;
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
                                this.refresh_adoptions = [];
                                this.refresh_abortions = [];
                                yield this.On_Refresh();
                                // this handles Is_Alive is a different way
                                yield this.Execute_Adoptions_And_Abortions({
                                    adoptions: this.refresh_adoptions,
                                    abortions: this.refresh_abortions,
                                });
                                this.refresh_adoptions = null;
                                this.refresh_abortions = null;
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
            const adoptions = [];
            const abortions = [];
            yield this.Refresh_Implementation({
                adoptions,
                abortions,
            });
            yield this.Execute_Adoptions_And_Abortions({
                adoptions,
                abortions,
            });
        });
    }
    Refresh_Implementation({ adoptions, abortions, }) {
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
                            // These are temporarily stored during the refresh event
                            // to save on both hot and cold memory.
                            this.refresh_adoptions = adoptions;
                            this.refresh_abortions = abortions;
                            yield this.On_Refresh();
                            this.refresh_adoptions = null;
                            this.refresh_abortions = null;
                            if (this.Is_Alive()) {
                                // Even though children can update the adoptions
                                // and abortions arrays asynchronously, their children
                                // are still added in order relative to itself.
                                yield Promise.all(this.children.map(function (child) {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        yield child.Refresh_Implementation({
                                            adoptions: adoptions,
                                            abortions: abortions,
                                        });
                                    });
                                }));
                            }
                        }
                    }
                });
            }.bind(this));
        });
    }
    Execute_Adoptions_And_Abortions({ adoptions, abortions, }) {
        return __awaiter(this, void 0, void 0, function* () {
            // We update the dom all at once to limit draw calls.
            // The dom is only updated after this entity and all
            // its children have been refreshed as entities.
            for (const adoption of adoptions) {
                const parent = adoption.Parent();
                if (parent.Is_Alive()) {
                    const child = adoption.Child();
                    parent.Element().appendChild(child.Element());
                }
            }
            // we need to untangle the dom changes in Die event still. this breaks before death event
            const deaths = [];
            for (const abortion of abortions) {
                const parent = abortion.Parent();
                if (parent.Is_Alive()) {
                    const child = abortion.Child();
                    // broken because we aren't removing it from this entity's children also.
                    // not sure how to untangle this part with Die(), but we'll get there.
                    // it actually seems to be refreshing fine in any case just with adoptions above,
                    // but I expect that won't be the case if a On_Death() or Before_Death() is waiting.
                    // yeah just checked, and what's happening is that the elements are doubling up
                    // because we haven't removed this from the dom first, which we have to do.
                    // but we want to keep the children on the entity and let the death event remove them
                    // when they are done, or maybe even here after we wait below.
                    //parent.Element().removeChild(child.Element());
                    deaths.push(child.Die());
                }
            }
            yield Promise.all(deaths);
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
    // we may want to leave this because maybe this might be useful to user besides Adoptions?
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
    Kill_All_Children() {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(this.Is_Alive(), `Cannot kill children of a dead parent.`);
            yield Promise.all(this.children.map(function (child) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield child.Die();
                });
            }));
        });
    }
    Adopt_Child(child) {
        Utils.Assert(this.Is_Alive(), `A parent must be alive to adopt a child.`);
        Utils.Assert(this.refresh_adoptions != null, `You can only adopt a child during On_Refresh().`);
        Utils.Assert(child.Is_Alive(), `A child must be alive to be adopted.`);
        Utils.Assert(!child.Has_Parent(), `A child must not have a parent to be adopted.`);
        this.children.push(child);
        child.parent = this;
        this.refresh_adoptions.push(new Parent_And_Child({
            parent: this,
            child: child,
        }));
    }
    Abort_Child(child) {
        Utils.Assert(this.Is_Alive(), `A parent must be alive to abort a child.`);
        Utils.Assert(this.refresh_abortions != null, `You can only abort a child during On_Refresh().`);
        Utils.Assert(child.Is_Alive(), `A child must be alive to be aborted.`);
        Utils.Assert(child.Parent() === this, `A child must have this parent to be aborted.`);
        // it's possible that we should go ahead and remove the child here
        // or during the death event, but wait until after both to remove from dom.
        this.refresh_abortions.push(new Parent_And_Child({
            parent: this,
            child: child,
        }));
    }
    Abort_All_Children() {
        for (const child of this.children) {
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
