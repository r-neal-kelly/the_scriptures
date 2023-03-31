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
var Life_Cycle_Listener;
(function (Life_Cycle_Listener) {
    Life_Cycle_Listener[Life_Cycle_Listener["_NONE_"] = 0] = "_NONE_";
    Life_Cycle_Listener[Life_Cycle_Listener["ON_LIFE"] = 1] = "ON_LIFE";
    Life_Cycle_Listener[Life_Cycle_Listener["ON_REFRESH"] = 2] = "ON_REFRESH";
    Life_Cycle_Listener[Life_Cycle_Listener["ON_RECLASS"] = 3] = "ON_RECLASS";
    Life_Cycle_Listener[Life_Cycle_Listener["ON_RESTYLE"] = 4] = "ON_RESTYLE";
    Life_Cycle_Listener[Life_Cycle_Listener["BEFORE_DEATH"] = 5] = "BEFORE_DEATH";
})(Life_Cycle_Listener || (Life_Cycle_Listener = {}));
var Life_Cycle_Skip;
(function (Life_Cycle_Skip) {
    Life_Cycle_Skip[Life_Cycle_Skip["_NONE_"] = 0] = "_NONE_";
    Life_Cycle_Skip[Life_Cycle_Skip["CHILDREN"] = 1] = "CHILDREN";
    Life_Cycle_Skip[Life_Cycle_Skip["REMAINING_SIBLINGS"] = 2] = "REMAINING_SIBLINGS";
})(Life_Cycle_Skip || (Life_Cycle_Skip = {}));
export class Instance {
    constructor({ element, parent, event_grid, }) {
        Utils.Assert(Instance.next_id !== Infinity, `Can't create another ID!`);
        this.is_alive = false;
        this.id = Instance.next_id++;
        this.element = element instanceof HTMLElement ?
            element :
            document.createElement(element);
        this.event_grid = event_grid;
        this.css = null;
        this.css_to_add = null;
        this.parent = null;
        this.children = new Map();
        this.life_cycle_listener = Life_Cycle_Listener._NONE_;
        this.life_cycle_skip = Life_Cycle_Skip._NONE_;
        this.Live(parent);
    }
    Live(parent) {
        if (!this.Is_Alive()) {
            this.is_alive = true;
            this.element.setAttribute(`id`, this.HTML_ID());
            // This needs to happen before On_Life so that
            // the listener has access to their parent.
            if (parent != null) {
                parent.Adopt_Child(this);
            }
            if (Object.getPrototypeOf(this).hasOwnProperty(`On_Life`)) {
                this.life_cycle_listener = Life_Cycle_Listener.ON_LIFE;
                this.css_to_add = ``;
                this.Event_Grid().Add_Many_Listeners(this, this.On_Life());
                if (this.css_to_add !== ``) {
                    this.css = Utils.Create_Style_Element(this.css_to_add);
                }
                this.css_to_add = null;
                this.life_cycle_listener = Life_Cycle_Listener._NONE_;
            }
            // We only refresh when there is no parent
            // because the parent itself will refresh
            // its children through this event.
            if (parent == null) {
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
    // This algorithm for the different Life-Cycle Senders is extremely efficient
    // because it only goes over the tree once, instead of once per Sender.
    Refresh() {
        if (this.Is_Alive()) {
            this.life_cycle_skip &= ~Life_Cycle_Skip.CHILDREN;
            this.Refresh_This();
            this.Reclass_This();
            this.Restyle_This();
            if (this.life_cycle_skip & Life_Cycle_Skip.CHILDREN) {
                return;
            }
            for (const child of this.children.values()) {
                child.life_cycle_skip &= ~Life_Cycle_Skip.REMAINING_SIBLINGS;
                child.Refresh();
                if (child.life_cycle_skip & Life_Cycle_Skip.REMAINING_SIBLINGS) {
                    return;
                }
            }
        }
    }
    Refresh_This() {
        if (this.Is_Alive() &&
            Object.getPrototypeOf(this).hasOwnProperty(`On_Refresh`)) {
            this.life_cycle_listener = Life_Cycle_Listener.ON_REFRESH;
            this.On_Refresh();
            this.life_cycle_listener = Life_Cycle_Listener._NONE_;
        }
    }
    Reclass() {
        if (this.Is_Alive()) {
            this.life_cycle_skip &= ~Life_Cycle_Skip.CHILDREN;
            this.Reclass_This();
            this.Restyle_This();
            if (this.life_cycle_skip & Life_Cycle_Skip.CHILDREN) {
                return;
            }
            for (const child of this.children.values()) {
                child.life_cycle_skip &= ~Life_Cycle_Skip.REMAINING_SIBLINGS;
                child.Reclass();
                if (child.life_cycle_skip & Life_Cycle_Skip.REMAINING_SIBLINGS) {
                    return;
                }
            }
        }
    }
    Reclass_This() {
        if (this.Is_Alive() &&
            Object.getPrototypeOf(this).hasOwnProperty(`On_Reclass`)) {
            this.life_cycle_listener = Life_Cycle_Listener.ON_RECLASS;
            const classes = this.On_Reclass().join(` `);
            this.life_cycle_listener = Life_Cycle_Listener._NONE_;
            // This might not be necessary, but we're trying to avoid internal browser slowdown.
            // It's probably already doing this internally, so we can relax it. However,
            // we can't just use the classList on element, it's way too slow sometimes.
            const element = this.Element();
            const current_classes = element.getAttribute(`class`);
            if (current_classes == null ||
                current_classes !== classes) {
                element.setAttribute(`class`, classes);
            }
        }
    }
    Restyle() {
        if (this.Is_Alive()) {
            this.life_cycle_skip &= ~Life_Cycle_Skip.CHILDREN;
            this.Restyle_This();
            if (this.life_cycle_skip & Life_Cycle_Skip.CHILDREN) {
                return;
            }
            for (const child of this.children.values()) {
                child.life_cycle_skip &= ~Life_Cycle_Skip.REMAINING_SIBLINGS;
                child.Restyle();
                if (child.life_cycle_skip & Life_Cycle_Skip.REMAINING_SIBLINGS) {
                    return;
                }
            }
        }
    }
    Restyle_This() {
        if (this.Is_Alive() &&
            Object.getPrototypeOf(this).hasOwnProperty(`On_Restyle`)) {
            this.life_cycle_listener = Life_Cycle_Listener.ON_RESTYLE;
            const styles = this.On_Restyle();
            this.life_cycle_listener = Life_Cycle_Listener._NONE_;
            if (styles instanceof Object) {
                const element = this.Element();
                for (const style of Object.entries(styles)) {
                    element.style[style[0]] = style[1];
                }
            }
            else {
                this.Element().setAttribute(`style`, styles);
            }
        }
    }
    Die() {
        if (this.Is_Alive()) {
            if (Object.getPrototypeOf(this).hasOwnProperty(`Before_Death`)) {
                this.life_cycle_listener = Life_Cycle_Listener.BEFORE_DEATH;
                this.Before_Death();
                this.life_cycle_listener = Life_Cycle_Listener._NONE_;
            }
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
            if (this.css != null) {
                Utils.Destroy_Style_Element(this.css);
            }
            this.Event_Grid().Remove(this);
            this.element = document.body;
            this.is_alive = false;
        }
    }
    On_Life() {
        Utils.Assert(false, `This method must be overridden to be used.`);
        return [];
    }
    On_Refresh() {
        Utils.Assert(false, `This method must be overridden to be used.`);
        return;
    }
    On_Reclass() {
        Utils.Assert(false, `This method must be overridden to be used.`);
        return [];
    }
    On_Restyle() {
        Utils.Assert(false, `This method must be overridden to be used.`);
        return ``;
    }
    Before_Death() {
        Utils.Assert(false, `This method must be overridden to be used.`);
        return;
    }
    Is_Alive() {
        return this.is_alive;
    }
    ID() {
        Utils.Assert(this.Is_Alive(), `Cannot get an ID from a dead entity.`);
        return this.id;
    }
    HTML_ID() {
        Utils.Assert(this.Is_Alive(), `Cannot get an html ID from a dead entity.`);
        return `Entity_${Instance.class_id}_${this.ID()}`;
    }
    Element() {
        Utils.Assert(this.Is_Alive(), `Cannot get an element from a dead entity.`);
        return this.element;
    }
    // We still need to handle things like is:() and where:() I think
    Add_CSS(css) {
        Utils.Assert(this.Is_Alive(), `Cannot add css on a dead entity.`);
        Utils.Assert(this.life_cycle_listener === Life_Cycle_Listener.ON_LIFE, `You can only add css during On_Life().`);
        const html_id = this.HTML_ID();
        this.css_to_add += `
            /* CSS for ${html_id} and its Children: */
        `;
        this.css_to_add += css.replace(/(}\s*|^\s*)([^@{]+)({)/g, function (match, left, selector_list, right) {
            let result = ``;
            const selectors = selector_list.trim().split(/\s*,\s*/g);
            for (let idx = 0, end = selectors.length; idx < end; idx += 1) {
                const selector = selectors[idx];
                result += `${selector.replace(/^([^\s>~+|]*)/, `$1#${html_id}`)}, `;
                if (idx !== end - 1) {
                    result += `#${html_id} ${selector}, `;
                }
                else {
                    result += `#${html_id} ${selector} `;
                }
            }
            return `${left}${result}${right}`;
        });
    }
    Add_This_CSS(this_css) {
        Utils.Assert(this.Is_Alive(), `Cannot add this_css on a dead entity.`);
        Utils.Assert(this.life_cycle_listener === Life_Cycle_Listener.ON_LIFE, `You can only add this_css during On_Life().`);
        const html_id = this.HTML_ID();
        this.css_to_add += `
            /* CSS for ${html_id}: */
        `;
        this.css_to_add += this_css.replace(/(}\s*|^\s*)([^@{]+)({)/g, function (match, left, selector_list, right) {
            let result = ``;
            const selectors = selector_list.trim().split(/\s*,\s*/g);
            for (let idx = 0, end = selectors.length; idx < end; idx += 1) {
                const selector = selectors[idx];
                if (idx !== end - 1) {
                    result += `${selector.replace(/^([^\s>~+|]*)/, `$1#${html_id}`)}, `;
                }
                else {
                    result += `${selector.replace(/^([^\s>~+|]*)/, `$1#${html_id}`)} `;
                }
            }
            return `${left}${result}${right}`;
        });
    }
    Add_Children_CSS(children_css) {
        Utils.Assert(this.Is_Alive(), `Cannot add children_css on a dead entity.`);
        Utils.Assert(this.life_cycle_listener === Life_Cycle_Listener.ON_LIFE, `You can only add children_css during On_Life().`);
        const html_id = this.HTML_ID();
        this.css_to_add += `
            /* CSS for ${html_id}'s Children: */
        `;
        this.css_to_add += children_css.replace(/(}\s*|^\s*)([^@{]+)({)/g, function (match, left, selector_list, right) {
            let result = ``;
            const selectors = selector_list.trim().split(/\s*,\s*/g);
            for (let idx = 0, end = selectors.length; idx < end; idx += 1) {
                const selector = selectors[idx];
                if (idx !== end - 1) {
                    result += `#${html_id} ${selector}, `;
                }
                else {
                    result += `#${html_id} ${selector} `;
                }
            }
            return `${left}${result}${right}`;
        });
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
        Utils.Assert(this.life_cycle_listener === Life_Cycle_Listener.ON_REFRESH, `You can only adopt a child during On_Refresh().`);
        Utils.Assert(child.Is_Alive(), `A child must be alive to be adopted.`);
        Utils.Assert(!child.Has_Parent(), `A child must not have a parent to be adopted.`);
        Utils.Assert(this.Child_Count() + 1 < Infinity, `Can not add any more children!`);
        this.children.set(child.Element(), child);
        child.parent = this;
        this.Element().appendChild(child.Element());
    }
    Abort_Child(child) {
        Utils.Assert(this.Is_Alive(), `A parent must be alive to abort a child.`);
        Utils.Assert(this.life_cycle_listener === Life_Cycle_Listener.ON_REFRESH, `You can only abort a child during On_Refresh().`);
        Utils.Assert(child.Is_Alive(), `A child must be alive to be aborted.`);
        Utils.Assert(child.Parent() === this, `A child must have this parent to be aborted.`);
        child.Die();
    }
    Abort_All_Children() {
        for (const child of Array.from(this.children.values())) {
            this.Abort_Child(child);
        }
    }
    Skip_Children() {
        Utils.Assert(this.life_cycle_listener === Life_Cycle_Listener.ON_REFRESH ||
            this.life_cycle_listener === Life_Cycle_Listener.ON_RECLASS ||
            this.life_cycle_listener === Life_Cycle_Listener.ON_RESTYLE, `You can only skip children during On_Refresh(), On_Reclass(), or On_Restyle().`);
        this.life_cycle_skip |= Life_Cycle_Skip.CHILDREN;
    }
    Skip_Remaining_Siblings() {
        Utils.Assert(this.life_cycle_listener === Life_Cycle_Listener.ON_REFRESH ||
            this.life_cycle_listener === Life_Cycle_Listener.ON_RECLASS ||
            this.life_cycle_listener === Life_Cycle_Listener.ON_RESTYLE, `You can only skip remaining siblings during On_Refresh(), On_Reclass(), or On_Restyle().`);
        this.life_cycle_skip |= Life_Cycle_Skip.REMAINING_SIBLINGS;
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
Instance.class_id = `${new Date().getTime()}${Math.random().toString().replace(/\./g, ``)}`;
Instance.next_id = 0;
