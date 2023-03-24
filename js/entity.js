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
    constructor({ element, parent, event_grid, }) {
        Utils.Assert(Instance.next_id !== Infinity, `Can't create another ID!`);
        this.id = Instance.next_id++;
        this.element = element instanceof HTMLBodyElement ?
            element :
            document.createElement(element);
        this.styles = {};
        this.parent = null;
        this.children = [];
        this.refresh_state = undefined;
        this.refresh_adoptions = null;
        this.refresh_abortions = null;
        this.event_grid = event_grid;
        this.life_cycle_queue = new Queue.Instance();
        this.is_alive = true;
        if (parent != null) {
            parent.Adopt_Child(this);
        }
        this.Live();
    }
    Is_Alive() {
        return this.is_alive;
    }
    Live() {
        return __awaiter(this, void 0, void 0, function* () {
            // We need to avoid deadlocking the queue, which happens
            // when waiting for a queued callback to finish in
            // a previously queued callback. So we get the promise
            // for the last queued callback and wait on that.
            yield (yield new Promise(function (resolve) {
                this.life_cycle_queue.Enqueue(function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        Utils.Assert(this.Is_Alive());
                        // Waiting here allows the constructor
                        // of the derived type to finish before this is called.
                        // We could also use the async type perhaps, to let the main entity
                        // start life for all of its children.
                        // This also gives time to parent an entity before this tries to refresh
                        // itself if it doesn't have a parent.
                        yield Utils.Wait_Milliseconds(1);
                        this.Event_Grid().Add_Many_Listeners(this, yield this.On_Life());
                        if (!this.Has_Parent()) {
                            // We need to wait for this, but it will cause a deadlock
                            // if we do it directly, because it queues a callback.
                            // So we pass along its promise instead.
                            resolve(this.Refresh());
                        }
                    });
                }.bind(this));
            }.bind(this)));
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
                        yield Promise.all(this.children.map(function (child) {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield child.Restyle();
                            });
                        }));
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
            const styles_array = styles.split(/\s*;\s*/).map(s => s.match(/[^:]+/g));
            for (const style of styles_array) {
                if (style != null) {
                    // There can be empty lines of just space, which is just fine.
                    // But an invalid statement, no
                    Utils.Assert(style.length === 2, `Invalid css command! ${style}\nfrom\n${styles}`);
                    styles_object[style[0].trim()] = style[1].trim();
                }
            }
            this.styles = Object.assign(this.styles, styles_object);
        }
        this.Element().setAttribute(`style`, Object.entries(this.styles).map(([property, value]) => `${property}: ${value};`).join(`\n`));
    }
    Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.Is_Alive()) {
                // we need to queue like so in case a parent tries to call Refresh_Implementation
                // while this is still operating. Because Enqueue doesn't wait to put the
                // callbacks in the queue, this will certainly run one after the other,
                // and Refresh_Implementation itself adds a callback to the queue which will
                // run after these. We can't actually combine the two into one callback because
                // it does add to the queue, and we would end up creating a deadlock.
                const adoptions = new Set();
                const abortions = new Set();
                // We could also remove the queue from Refresh_Implementation, put it here
                // and when it calls its child, but when it calls the child, it has to use
                // the child's queue. this does work how it is however.
                // We DO NOT await here because we want these two to be queued one right after
                // another. We can await on the second which itself waits on this before
                // executing.
                this.Refresh_Implementation({
                    adoptions,
                    abortions,
                });
                yield this.life_cycle_queue.Enqueue(function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield this.Adopt_And_Abort_Unqueued({
                            adoptions,
                            abortions,
                        });
                    });
                }.bind(this));
            }
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
                        this.refresh_state = yield this.Before_Refresh();
                        // These are temporarily stored during the refresh event
                        // to save on both hot and cold memory.
                        this.refresh_adoptions = adoptions;
                        this.refresh_abortions = abortions;
                        yield this.On_Refresh();
                        this.refresh_adoptions = null;
                        this.refresh_abortions = null;
                        // Even though children can update the adoptions
                        // and abortions arrays asynchronously, their children
                        // are still added in order relative to itself, so its
                        // still deterministic what order they are added to the DOM.
                        // We need to skip calling refresh on any aborted children
                        // to avoid unnecessary creation of entities in their
                        // refresh calls, and thus their immediate deaths also.
                        // It's okay to call this for adoptions because the life event
                        // only triggers if the new entity doesn't have a parent,
                        // which these do. Otherwise, we'd have to skip this for
                        // adopted children because the refresh would be called
                        // multiple times.
                        yield Promise.all(this.children.map(function (child) {
                            return __awaiter(this, void 0, void 0, function* () {
                                if (!abortions.has(child)) {
                                    yield child.Refresh_Implementation({
                                        adoptions: adoptions,
                                        abortions: abortions,
                                    });
                                }
                            });
                        }));
                    }
                });
            }.bind(this));
        });
    }
    Adopt_And_Abort_Unqueued({ adoptions, abortions, }) {
        return __awaiter(this, void 0, void 0, function* () {
            // This function must be called within the context of a queued callback to avoid deadlock.
            Utils.Assert(this.Is_Alive());
            // We call this before removing the abortions from the dom,
            // and while they are still attached to their parent entities.
            // Thus every entity can look at their parents as well as their children.
            // We don't queue this here because we are already in the queue, and we
            // want this to finish before altering the dom.
            // Waiting here will not deadlock the queue because abortions can only be children.
            yield Promise.all(Array.from(abortions).map(function (abortion) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield abortion.Before_Dying_Unqueued();
                });
            }));
            // We update the dom all at once to limit draw calls.
            // Adoptions and abortions can come from the children
            // of this entity and are passed as an arena to
            // children during the refresh cycle.
            // It should be noted because of the lopsided nature of
            // abortions not being able to have refresh call after abortion,
            // the children of abortions are not within the abortions array,
            // only the top of the branches being severed. Die and Before_Dying take this into account.
            const deaths = [];
            for (const abortion of abortions) {
                const child = abortion;
                const parent = abortion.Parent();
                Utils.Assert(parent.Is_Alive());
                Utils.Assert(child.Is_Alive());
                Utils.Assert(child.Element().parentElement === parent.Element());
                parent.Element().removeChild(child.Element());
                deaths.push(child.Die());
            }
            for (const adoption of adoptions) {
                const child = adoption;
                const parent = adoption.Parent();
                Utils.Assert(parent.Is_Alive());
                Utils.Assert(child.Is_Alive());
                Utils.Assert(child.Element().parentElement === null);
                parent.Element().appendChild(child.Element());
            }
            // This will not cause a deadlock in this entity's queue
            // because all of the deaths are children and not its own.
            yield Promise.all(deaths);
            yield this.After_Refreshing_Unqueued();
        });
    }
    Before_Dying_Unqueued() {
        return __awaiter(this, void 0, void 0, function* () {
            // This function must be called within the context of a queued callback to avoid deadlock.
            Utils.Assert(this.Is_Alive());
            yield Promise.all(this.children.map(function (child) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield child.Before_Dying_Unqueued();
                });
            }));
            yield this.Before_Death();
        });
    }
    After_Refreshing_Unqueued() {
        return __awaiter(this, void 0, void 0, function* () {
            // This function must be called within the context of a queued callback to avoid deadlock.
            Utils.Assert(this.Is_Alive());
            yield this.After_Refresh(this.refresh_state);
            yield Promise.all(this.children.map(function (child) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield child.After_Refreshing_Unqueued();
                });
            }));
        });
    }
    Die() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.life_cycle_queue.Enqueue(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.Is_Alive()) {
                        yield Promise.all(this.children.map(function (child) {
                            return __awaiter(this, void 0, void 0, function* () {
                                yield child.Die();
                            });
                        }));
                        if (this.Has_Parent()) {
                            const parent = this.Parent();
                            if (this.Element().parentElement === parent.Element()) {
                                // We need to check because it would already
                                // be removed by this point if it was aborted.
                                parent.Element().removeChild(this.Element());
                            }
                            // this can be made more efficient by using two hashmaps for children
                            const child_index = parent.children.indexOf(this);
                            Utils.Assert(child_index > -1);
                            for (let idx = child_index + 1, end = parent.Child_Count(); idx < end; idx += 1) {
                                parent.children[idx - 1] = parent.children[idx];
                            }
                            parent.children.pop();
                            this.parent = null;
                        }
                        yield this.On_Death();
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
    Before_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
        });
    }
    After_Refresh(state) {
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
    Adopt_Child(child) {
        Utils.Assert(this.Is_Alive(), `A parent must be alive to adopt a child.`);
        Utils.Assert(this.refresh_adoptions != null, `You can only adopt a child during On_Refresh().`);
        Utils.Assert(child.Is_Alive(), `A child must be alive to be adopted.`);
        Utils.Assert(!child.Has_Parent(), `A child must not have a parent to be adopted.`);
        // We have a latent stack between this and abort.
        // First the child is added to an entity,
        // then to the dom,
        // then it's removed from the dom,
        // and then finally removed from its entity.
        this.children.push(child);
        child.parent = this;
        this.refresh_adoptions.add(child);
    }
    Abort_Child(child) {
        Utils.Assert(this.Is_Alive(), `A parent must be alive to abort a child.`);
        Utils.Assert(this.refresh_abortions != null, `You can only abort a child during On_Refresh().`);
        Utils.Assert(child.Is_Alive(), `A child must be alive to be aborted.`);
        Utils.Assert(child.Parent() === this, `A child must have this parent to be aborted.`);
        // We don't directly remove the child entity from parent entity
        // to maintain the stack as noted in Adopt. It's fully removed in
        // the Die event.
        this.refresh_abortions.add(child);
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
            // should this and animate methods be queued?
            // the reason I think not is because it would
            // be easy to dead-lock the queue by waiting for Refresh for example.
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
