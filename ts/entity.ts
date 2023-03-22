import { Integer } from "./types.js";
import { Index } from "./types.js";
import { ID } from "./types.js";
import { Float } from "./types.js";

import * as Utils from "./utils.js";
import * as Queue from "./queue.js";
import * as Event from "./event.js";

export { ID } from "./types.js";

export type Styles = { [index: string]: string };

export type Animation_Frame = {
    now: Float;
    start: Float;
    elapsed: Float;
}

export class Instance
{
    private static next_id: ID = 0;

    private id: ID;

    private element: HTMLElement;
    private styles: Styles;
    private parent: Instance | null;
    private children: Array<Instance>;

    private event_grid: Event.Grid;
    private life_cycle_queue: Queue.Instance;

    private is_alive: boolean;

    constructor(
        element: string | HTMLBodyElement,
        event_grid: Event.Grid,
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

        this.event_grid = event_grid;
        this.life_cycle_queue = new Queue.Instance();

        this.is_alive = true;

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
        await this.life_cycle_queue.Enqueue(
            async function (
                this: Instance,
            ):
                Promise<void>
            {
                // waiting here allows the constructor
                // of the derived type to finish before this is called
                // we could alternatively have the derived type call this func
                await Utils.Wait_Milliseconds(1);
                if (this.Is_Alive()) {
                    const listeners: Array<Event.Listener_Info> = await this.On_Life();
                    if (this.Is_Alive()) {
                        this.Event_Grid().Add_Many_Listeners(this, listeners);
                        this.Apply_Styles(await this.On_Restyle());
                        if (this.Is_Alive()) {
                            await this.On_Refresh();
                        }
                    }
                }
            }.bind(this),
        );
    }

    async Restyle():
        Promise<void>
    {
        await this.life_cycle_queue.Enqueue(
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
            `Cannot apply styles on a dead entity.`,
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
        await this.life_cycle_queue.Enqueue(
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
            }.bind(this),
        );
    }

    async Die():
        Promise<void>
    {
        await this.life_cycle_queue.Enqueue(
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

                    this.Event_Grid().Remove(this);

                    this.element = document.body;
                    this.is_alive = false;
                }
            }.bind(this),
        );
    }

    async On_Life():
        Promise<Array<Event.Listener_Info>>
    {
        return [];
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

    private Remove_Child(
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

    private Remove_Child_At(
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

    private Remove_All_Children():
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

    async Kill_Child_At(
        child_index: Index,
    ):
        Promise<void>
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot kill child of a dead parent.`,
        );
        Utils.Assert(
            this.Has_Child(child_index),
            `Cannot kill a child the parent doesn't have.`,
        );

        const child: Instance = this.children[child_index];
        Utils.Assert(child.Is_Alive());
        Utils.Assert(child.Has_Parent());
        Utils.Assert(child.Parent() === this);

        await child.Die();
    }

    async Kill_All_Children():
        Promise<void>
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot kill children of a dead parent.`,
        );

        const children: Array<Instance> = this.Children();
        for (let idx = children.length, end = 0; idx > end;) {
            idx -= 1;
            await children[idx].Die();
        }
    }

    Event_Grid():
        Event.Grid
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot get an event grid from a dead entity.`,
        );

        return this.event_grid;
    }

    async Send(
        event_info: Event.Info,
    ):
        Promise<void>
    {
        return this.Event_Grid().Send(event_info);
    }

    async Animate(
        keyframes: Array<Keyframe>,
        options: KeyframeEffectOptions,
    ):
        Promise<void>
    {
        Utils.Assert(
            keyframes.length >= 2,
            `Must have at least two keyframes.`,
        );
        Utils.Assert(
            keyframes[0].offset === 0.0,
            `First keyframe's offset must be 0.0`,
        );
        Utils.Assert(
            keyframes[keyframes.length - 1].offset === 1.0,
            `Last keyframe's offset must be 1.0`,
        );

        Utils.Assert(
            options.direction === undefined ||
            options.direction === `normal` ||
            options.direction === `reverse`,
            `Invalid direction.`,
        );
        Utils.Assert(
            options.fill === undefined ||
            options.fill === `both`,
            `Invalid fill.`,
        );

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
            const element: HTMLElement = this.Element();

            let first_keyframe: Keyframe;
            let last_keyframe: Keyframe;
            if (options.direction === `normal`) {
                first_keyframe = keyframes[0];
                last_keyframe = keyframes[keyframes.length - 1];
            } else {
                first_keyframe = keyframes[keyframes.length - 1];
                last_keyframe = keyframes[0];
            }

            for (const [key, value] of Object.entries(first_keyframe)) {
                if (key !== `offset` && value != null) {
                    (element.style as any)[key] = value.toString();
                }
            }

            await new Promise<void>(
                function (
                    resolve: () => void,
                ):
                    void
                {
                    const animation: Animation =
                        new Animation(new KeyframeEffect(element, keyframes, options));

                    animation.onfinish = function (
                        event: AnimationPlaybackEvent,
                    ):
                        void
                    {
                        resolve();
                    };

                    animation.play();
                },
            );

            // Currently not checking if is alive so that we ensure even a dead element
            // goes back to its former state before being animated.
            for (const [key, value] of Object.entries(last_keyframe)) {
                if (key !== `offset` && value != null) {
                    const value_string: string = value.toString();
                    this.styles[key] = value_string;
                    (element.style as any)[key] = value_string;
                }
            }
        }
    }

    async Animate_By_Frame<State>(
        on_frame: (
            frame: Animation_Frame,
            state: State,
        ) => boolean | Promise<boolean>,
        state: State,
    ):
        Promise<void>
    {
        return new Promise(
            function (
                this: Instance,
                resolve: () => void,
            ):
                void
            {
                let start: Float | null = null;
                let last: Float = -1.0;

                async function Loop(
                    this: Instance,
                    now: Float,
                ):
                    Promise<void>
                {
                    if (this.Is_Alive()) {
                        if (start == null) {
                            start = now;
                        }
                        if (last !== now) {
                            last = now;
                            if (
                                await on_frame(
                                    {
                                        now: now,
                                        start: start as Float,
                                        elapsed: now - start,
                                    } as Animation_Frame,
                                    state,
                                )
                            ) {
                                window.requestAnimationFrame(Loop.bind(this));
                            } else {
                                resolve();
                            }
                        } else {
                            window.requestAnimationFrame(Loop.bind(this));
                        }
                    } else {
                        resolve();
                    }
                }

                window.requestAnimationFrame(Loop.bind(this));
            }.bind(this),
        );
    }
}
