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
// might want to make this a limited circle buffer.
// it would have to never reject the Live and Die methods though, unless they aren't already queued
class Queue {
    constructor() {
        this.slots = [];
        this.is_executing = false;
    }
    Execute() {
        return __awaiter(this, void 0, void 0, function* () {
            this.is_executing = true;
            while (this.slots.length > 0) {
                yield this.slots[0]();
                this.slots = this.slots.slice(1);
            }
            this.is_executing = false;
        });
    }
    Push(method) {
        this.slots.push(method);
        if (!this.is_executing) {
            this.Execute();
        }
        if (this.slots.length > 1) {
            console.log(this.slots.length);
        }
    }
}
export class Instance {
    constructor(element) {
        Utils.Assert(Instance.next_id !== Infinity, `Can't create another ID!`);
        this.id = Instance.next_id++;
        this.element = element instanceof HTMLBodyElement ?
            element :
            document.createElement(element);
        this.styles = {};
        this.parent = null;
        this.children = [];
        this.is_alive = true;
        this.queue = new Queue();
        this.Live();
    }
    Is_Alive() {
        return this.is_alive;
    }
    Live() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve) {
                this.queue.Push(function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (this.Is_Alive()) {
                            yield this.On_Life();
                            if (this.Is_Alive()) {
                                this.Apply_Styles(yield this.On_Restyle());
                                if (this.Is_Alive()) {
                                    yield this.On_Refresh();
                                }
                            }
                        }
                        resolve();
                    });
                }.bind(this));
            }.bind(this));
        });
    }
    Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve) {
                this.queue.Push(function () {
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
                        resolve();
                    });
                }.bind(this));
            }.bind(this));
        });
    }
    Apply_Styles(styles) {
        Utils.Assert(this.Is_Alive(), `Cannot apply styles on a dead element.`);
        this.styles = Object.assign(this.styles, styles);
        this.Element().setAttribute(`style`, Object.entries(this.styles).map(([property, value]) => `${property}: ${value};`).join(`\n`));
    }
    Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve) {
                this.queue.Push(function () {
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
                        resolve();
                    });
                }.bind(this));
            }.bind(this));
        });
    }
    Die() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve) {
                this.queue.Push(function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (this.Is_Alive()) {
                            // We callback the override first so that the parent and children
                            // are still accessible to the handler.
                            yield this.On_Death();
                            // We currently do this backwards and in order to prevent
                            // unnecessary array rewrites which could be quite inefficient
                            // when there are a lot of children.
                            yield this.Kill_All_Children();
                            if (this.Has_Parent()) {
                                this.Parent().Remove_Child(this);
                            }
                            this.element = document.body;
                            this.is_alive = false;
                        }
                        resolve();
                    });
                }.bind(this));
            }.bind(this));
        });
    }
    On_Life() {
        return __awaiter(this, void 0, void 0, function* () {
            return;
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
    Kill_All_Children() {
        return __awaiter(this, void 0, void 0, function* () {
            const children = this.Remove_All_Children();
            for (let idx = children.length, end = 0; idx > end;) {
                idx -= 1;
                yield children[idx].Die();
            }
        });
    }
}
Instance.next_id = 0;
