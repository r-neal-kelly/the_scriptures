import { Integer } from "./types.js"
import { Index } from "./types.js"
import { ID } from "./types.js"

import * as Utils from "./utils.js"

export { ID } from "./types.js"

export type Styles = {
    [index: string]: string,
}

// might want to make this a limited circle buffer.
// it would have to never reject the Live and Die methods though, unless they aren't already queued
class Queue
{
    private slots: Array<any>;
    private is_executing: boolean;

    constructor()
    {
        this.slots = [];
        this.is_executing = false;
    }

    async Execute():
        Promise<void>
    {
        this.is_executing = true;

        while (this.slots.length > 0) {
            await this.slots[0]();
            this.slots = this.slots.slice(1);
        }

        this.is_executing = false;
    }

    Push(
        method: any,
    ):
        void
    {
        this.slots.push(method);

        if (!this.is_executing) {
            this.Execute();
        }
    }
}

export class Instance
{
    private static next_id: ID = 0;

    private id: ID;
    private element: HTMLElement;
    private styles: Styles;
    private parent: Instance | null;
    private children: Array<Instance>;

    private is_alive: boolean;

    private queue: Queue;

    constructor(
        element: string | HTMLBodyElement,
    )
    {
        Utils.Assert(
            Instance.next_id !== Infinity,
            `Can't create another ID!`,
        );

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

    Is_Alive():
        boolean
    {
        return this.is_alive;
    }

    private async Live():
        Promise<void>
    {
        return new Promise(
            function (
                this: Instance,
                resolve: any,
            ):
                void
            {
                this.queue.Push(
                    async function (
                        this: Instance,
                    ):
                        Promise<void>
                    {
                        if (this.Is_Alive()) {
                            await this.On_Life();
                            if (this.Is_Alive()) {
                                this.Apply_Styles(await this.On_Restyle());
                                if (this.Is_Alive()) {
                                    await this.On_Refresh();
                                }
                            }
                        }
                        resolve();
                    }.bind(this),
                );
            }.bind(this),
        );
    }

    async Restyle():
        Promise<void>
    {
        return new Promise(
            function (
                this: Instance,
                resolve: any,
            ):
                void
            {
                this.queue.Push(
                    async function (
                        this: Instance,
                    ):
                        Promise<void>
                    {
                        if (this.Is_Alive()) {
                            // We need to restyle before we do
                            // children so they have up to date data.
                            this.Apply_Styles(await this.On_Restyle());
                            if (this.Is_Alive()) {
                                // It's assumed that order may matter,
                                // and thus we treat the children as a stack
                                // both during life and death.
                                for (const child of this.children) {
                                    await child.Restyle();
                                    if (!this.Is_Alive()) {
                                        break;
                                    }
                                }
                            }
                        }
                        resolve();
                    }.bind(this),
                );
            }.bind(this),
        );
    }

    private Apply_Styles(
        styles: Styles | string,
    ):
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot apply styles on a dead element.`,
        );

        if (styles instanceof Object) {
            this.styles = Object.assign(this.styles, styles);
        } else {
            const styles_object: Styles = {};
            const styles_array: Array<RegExpMatchArray | null> =
                styles.split(/\s*;\s*/).map(s => s.match(/[^\s:]+/g));
            for (const style of styles_array) {
                if (
                    style != null &&
                    style.length === 2
                ) {
                    styles_object[style[0]] = style[1];
                }
            }

            this.styles = Object.assign(this.styles, styles_object);
        }

        this.Element().setAttribute(
            `style`,
            Object.entries(this.styles).map(
                ([property, value]) => `${property}: ${value};`
            ).join(`\n`),
        );
    }

    async Refresh():
        Promise<void>
    {
        return new Promise(
            function (
                this: Instance,
                resolve: any,
            ):
                void
            {
                this.queue.Push(
                    async function (
                        this: Instance,
                    ):
                        Promise<void>
                    {
                        if (this.Is_Alive()) {
                            // We need to restyle and refresh
                            // before we work on children so they
                            // have up to date data. Also because
                            // On_Refresh can add and remove children.
                            this.Apply_Styles(await this.On_Restyle());
                            if (this.Is_Alive()) {
                                await this.On_Refresh();
                                if (this.Is_Alive()) {
                                    // It's assumed that order may matter,
                                    // and thus we treat the children as a stack
                                    // both during life and death.
                                    for (const child of this.children) {
                                        await child.Refresh();
                                        if (!this.Is_Alive()) {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        resolve();
                    }.bind(this),
                );
            }.bind(this),
        );
    }

    async Die():
        Promise<void>
    {
        return new Promise(
            function (
                this: Instance,
                resolve: any,
            ):
                void
            {
                this.queue.Push(
                    async function (
                        this: Instance,
                    ):
                        Promise<void>
                    {
                        if (this.Is_Alive()) {
                            // We callback the override first so that the parent and children
                            // are still accessible to the handler.
                            await this.Before_Death();

                            // We currently do this backwards and in order to prevent
                            // unnecessary array rewrites which could be quite inefficient
                            // when there are a lot of children.
                            await this.Kill_All_Children();

                            await this.On_Death();

                            if (this.Has_Parent()) {
                                this.Parent().Remove_Child(this);
                            }

                            this.element = document.body;
                            this.is_alive = false;
                        }
                        resolve();
                    }.bind(this),
                );
            }.bind(this),
        );
    }

    async On_Life():
        Promise<void>
    {
        return;
    }

    async On_Restyle():
        Promise<Styles | string>
    {
        return {};
    }

    async On_Refresh():
        Promise<void>
    {
        return;
    }

    async Before_Death():
        Promise<void>
    {
        return;
    }

    async On_Death():
        Promise<void>
    {
        return;
    }

    ID():
        ID
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot get an ID from a dead entity.`,
        );

        return this.id;
    }

    Element():
        HTMLElement
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot get an element from a dead entity.`,
        );

        return this.element;
    }

    Has_Parent():
        boolean
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot know if a dead entity has a parent.`,
        );

        return this.parent != null;
    }

    Parent():
        Instance
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot get a parent from a dead entity.`,
        );
        Utils.Assert(
            this.Has_Parent(),
            `Entity does not have a parent, use Maybe_Parent or Has_Parent.`,
        );

        return this.parent as Instance;
    }

    Maybe_Parent():
        Instance | null
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot get a parent from a dead entity.`,
        );

        return this.parent;
    }

    Child_Count():
        Integer
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot know a dead entity's child count.`,
        );

        return this.children.length;
    }

    Has_Child(
        child_index: Index,
    ):
        boolean
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot know if a dead entity has a child.`,
        );
        Utils.Assert(
            child_index >= 0,
            `Cannot have an index less than 0.`,
        );

        return child_index < this.Child_Count();
    }

    Child(
        child_index: Index,
    ):
        Instance
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot get a child from a dead entity.`,
        );
        Utils.Assert(
            child_index >= 0,
            `Cannot have an index less than 0.`,
        );
        Utils.Assert(
            this.Has_Child(child_index),
            `Entity does not have the indexed child, use Maybe_Child or Has_Child.`
        );

        return this.children[child_index];
    }

    Maybe_Child(
        child_index: Index,
    ):
        Instance | null
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot get a child from a dead entity.`,
        );
        Utils.Assert(
            child_index >= 0,
            `Cannot have an index less than 0.`,
        );

        if (this.Has_Child(child_index)) {
            return this.children[child_index];
        } else {
            return null;
        }
    }

    Children():
        Array<Instance>
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot get children from a dead entity.`,
        );

        return Array.from(this.children);
    }

    Add_Child(
        child: Instance,
    ):
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `A parent must be alive to add a child.`,
        );
        Utils.Assert(
            child.Is_Alive(),
            `A child must be alive to be added to a parent.`,
        );
        Utils.Assert(
            !child.Has_Parent(),
            `A child must not have a parent to be added to another parent.`,
        );

        this.Element().appendChild(child.Element());
        this.children.push(child);
        child.parent = this;
    }

    Remove_Child(
        child: Instance,
    ):
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `A parent must be alive to remove a child.`,
        );
        Utils.Assert(
            child.Is_Alive(),
            `A child must be alive to be removed from a parent.`,
        );
        Utils.Assert(
            child.Has_Parent(),
            `A child must have a parent to be removed from a parent.`,
        );
        Utils.Assert(
            child.Parent() === this,
            `A child must have this parent to be removed from it.`,
        );

        this.Remove_Child_At(this.children.indexOf(child));
    }

    Remove_Child_At(
        child_index: Index,
    ):
        Instance
    {
        Utils.Assert(
            this.Is_Alive(),
            `A parent must be alive to remove a child.`,
        );
        Utils.Assert(
            this.Has_Child(child_index),
            `Cannot remove a child the parent doesn't have.`,
        );

        const child: Instance = this.children[child_index];
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

    Remove_All_Children():
        Array<Instance>
    {
        Utils.Assert(
            this.Is_Alive(),
            `A parent must be alive to remove its children.`,
        );

        const children: Array<Instance> = this.Children();
        const element: HTMLElement = this.Element();
        for (const child of children) {
            element.removeChild(child.Element());
            child.parent = null;
        }
        this.children = [];

        return children;
    }

    async Kill_All_Children():
        Promise<void>
    {
        const children: Array<Instance> = this.Children();
        for (let idx = children.length, end = 0; idx > end;) {
            idx -= 1;
            await children[idx].Die();
        }
    }
}
