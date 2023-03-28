import { Integer } from "./types.js";
import { Count } from "./types.js";
import { Index } from "./types.js";
import { ID } from "./types.js";
import { Float } from "./types.js";

import * as Utils from "./utils.js";
import * as Event from "./event.js";

export { ID } from "./types.js";

/*
    Life-Cycle:
        Live:
            On_Life
            On_Refresh
            On_Restyle
        Refresh:
            On_Refresh
            On_Restyle
        Restyle:
            On_Restyle
        Die:
            Before_Death
*/

export interface Info_API
{
    Is_Alive(): boolean;

    ID(): ID;

    Element(): HTMLElement;
}

export interface Life_Cycle_Sender_API
{
    /*
        Automatically queued when the entity is constructed.
    */
    // private Live(
    //    parent: Instance | null,
    //): void;

    /*
        Automatically queued through Live.

        Should not be waited on in any of the event listeners,
        it will dead-lock the queue.
    */
    Refresh(): void;

    /*
        Should not be waited on in any of the event listeners,
        it will dead-lock the queue.
    */
    Restyle(): void;

    /*
        Automatically queued when the parent of the entity dies.

        Should not be waited on in any of the event listeners,
        it will dead-lock the queue.
    */
    Die(): void;
}

export interface Life_Cycle_Listener_API
{
    /*
        Providing this event handler allows you to work on the entity before
        it is has been restyled or refreshed for the first time.
        The Event is triggered immediately upon construction of the entity.
        After On_Life, it automatically refreshes if it has no parent, otherwise
        it waits for its parent to refresh it as a child.
        The element of the entity is fully accessible, however it is only added to
        the DOM in the refresh cycle.
    */
    On_Life(): Array<Event.Listener_Info>;

    /*
        Providing this event handler allows you to Adopt and Abort children
        entities, thus building the internal tree structure of your entity.
        Children get this event after their parents.
        If a child is aborted during this event, it doesn't get a refresh event.
    */
    On_Refresh(): void;

    /*
        Providing this event handler allows you to return CSS styles that will
        be applied to the entity's underlying element immediately.
        The returned styles are combined with and override already existing
        styles stored on the entity.
        If returning a styles object, the properties are standard CSS names,
        that use the '-' symbol, and not camelCase.
        A return string should have valid CSS code within it, as if you were
        writing the interior of a valid CSS class, without the '{' and '}'.
        Children get this event after their parents.
        If a child is aborted in the Refresh event, it does not receive the event.
    */
    On_Restyle(): Styles | string;

    /*
        Providing this event handler allows you to work with an entity
        before its children die and before it is removed from its parent.
        The entity is still in the DOM during this event.
        Children get this event before their parents.
    */
    Before_Death(): void;
}

export interface Parent_API
{
    Has_Parent(): boolean;

    Parent(): Instance;

    Maybe_Parent(): Instance | null;
}

export interface Child_API
{
    Child_Count(): Count;

    Has_Child(
        child_index: Index,
    ): boolean;

    Child(
        child_index: Index,
    ): Instance;

    Maybe_Child(
        child_index: Index,
    ): Instance | null;

    Children(): Array<Instance>;

    Adopt_Child(
        child: Instance,
    ): void;

    Abort_Child(
        child: Instance,
    ): void;

    Abort_All_Children(): void;
}

export interface Event_API
{
    Event_Grid(): Event.Grid;

    Send(
        event_info: Event.Info,
    ): Promise<void>
}

export interface Animation_API
{
    Animate(
        keyframes: Array<Keyframe>,
        options: KeyframeEffectOptions,
    ): Promise<void>;

    Animate_By_Frame<User_State>(
        on_frame: Animation_Frame_Callback<User_State>,
        state: User_State,
    ): Promise<void>;
}

export type Styles = { [index: string]: string };

export class Animation_Frame
{
    private now: Float;
    private start: Float;
    private elapsed: Float;

    constructor(
        {
            now,
            start,
            elapsed,
        }: {
            now: Float,
            start: Float,
            elapsed: Float,
        },
    )
    {
        this.now = now;
        this.start = start;
        this.elapsed = elapsed;

        Object.freeze(this);
    }

    Now():
        Float
    {
        return this.now;
    }

    Start():
        Float
    {
        return this.start;
    }

    Elapsed():
        Float
    {
        return this.elapsed;
    }
}

export type Animation_Frame_Callback<User_State> = (
    frame: Animation_Frame,
    state: User_State,
) => boolean | Promise<boolean>;

export class Instance implements
    Info_API,
    Life_Cycle_Sender_API,
    Life_Cycle_Listener_API,
    Parent_API,
    Child_API,
    Event_API,
    Animation_API
{
    private static origin_id: Integer = new Date().getTime();
    private static next_id: ID = 0;

    private is_alive: boolean;
    private id: ID;
    private element: HTMLElement;
    private styles: Styles;
    private event_grid: Event.Grid;

    private parent: Instance | null;
    private children: Map<HTMLElement, Instance>;
    private may_adopt_and_abort: boolean;

    constructor(
        {
            element,
            parent,
            event_grid,
        }: {
            element: string | HTMLElement,
            parent: Instance | null,
            event_grid: Event.Grid,
        },
    )
    {
        Utils.Assert(
            Instance.next_id !== Infinity,
            `Can't create another ID!`,
        );

        this.is_alive = false;
        this.id = Instance.next_id++;
        this.element = element instanceof HTMLElement ?
            element :
            document.createElement(element);
        this.styles = {};
        this.event_grid = event_grid;

        this.parent = null;
        this.children = new Map();
        this.may_adopt_and_abort = false;

        this.Live(parent);
    }

    private Live(
        parent: Instance | null,
    ):
        void
    {
        if (!this.Is_Alive()) {
            this.is_alive = true;

            this.element.setAttribute(
                `id`,
                `Entity_${Instance.origin_id}_${this.ID()}`,
            );

            this.Event_Grid().Add_Many_Listeners(this, this.On_Life());

            // We only refresh when there is no parent
            // because the parent itself will refresh
            // its children through this event.
            if (parent != null) {
                parent.Adopt_Child(this);
            } else {
                // Waiting here allows the derived type to
                // finish its constructor before Refresh.
                (
                    async function (
                        this: Instance,
                    ):
                        Promise<void>
                    {
                        await Utils.Wait_Milliseconds(1);
                        this.Refresh();
                    }
                ).bind(this)();
            }
        }
    }

    Refresh():
        void
    {
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

    Restyle():
        void
    {
        if (this.Is_Alive()) {
            const styles: Styles | string = this.On_Restyle();

            if (styles instanceof Object) {
                this.styles = Object.assign(this.styles, styles);
            } else {
                const styles_object: Styles = {};
                const styles_array: Array<RegExpMatchArray | null> =
                    styles.split(/\s*;\s*/).map(s => s.match(/[^:]+/g));
                for (const style of styles_array) {
                    if (style != null) {
                        Utils.Assert(
                            style.length === 2,
                            `Invalid css command! ${style}\nfrom\n${styles}`,
                        );

                        styles_object[style[0].trim()] = style[1].trim();
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

            for (const child of this.children.values()) {
                child.Restyle();
            }
        }
    }

    Die():
        void
    {
        if (this.Is_Alive()) {
            this.Before_Death();

            for (const child of this.children.values()) {
                child.Die();
            }

            if (this.Has_Parent()) {
                const parent: Instance = this.Parent();
                const parent_element: HTMLElement = parent.Element();
                const child_element: HTMLElement = this.Element();

                if (child_element.parentElement === parent_element) {
                    parent_element.removeChild(child_element);
                }
                this.parent = null;
                parent.children.delete(child_element);
            }

            this.Event_Grid().Remove(this);
            this.styles = {};
            this.element = document.body;
            this.is_alive = false;
        }
    }

    On_Life():
        Array<Event.Listener_Info>
    {
        return [];
    }

    On_Refresh():
        void
    {
        return;
    }

    On_Restyle():
        Styles | string
    {
        return ``;
    }

    Before_Death():
        void
    {
        return;
    }

    Is_Alive():
        boolean
    {
        return this.is_alive;
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
        Count
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot know a dead entity's child count.`,
        );

        return this.children.size;
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

        return this.children.get(this.Element().children[child_index] as HTMLElement) as Instance;
    }

    Maybe_Child(
        child_index: Index,
    ):
        Instance | null
    {
        if (this.Has_Child(child_index)) {
            return this.Child(child_index);
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

        return Array.from(this.Element().children).map(
            function (
                this: Instance,
                child: Element,
            ):
                Instance
            {
                return this.children.get(child as HTMLElement) as Instance;
            }.bind(this),
        );
    }

    Adopt_Child(
        child: Instance,
    ):
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `A parent must be alive to adopt a child.`,
        );
        Utils.Assert(
            this.may_adopt_and_abort === true,
            `You can only adopt a child during On_Refresh().`,
        );
        Utils.Assert(
            child.Is_Alive(),
            `A child must be alive to be adopted.`,
        );
        Utils.Assert(
            !child.Has_Parent(),
            `A child must not have a parent to be adopted.`,
        );
        Utils.Assert(
            this.Child_Count() + 1 < Infinity,
            `Can not add any more children!`,
        );

        this.children.set(child.Element(), child);
        child.parent = this;
        this.Element().appendChild(child.Element());
    }

    Abort_Child(
        child: Instance,
    ):
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `A parent must be alive to abort a child.`,
        );
        Utils.Assert(
            this.may_adopt_and_abort === true,
            `You can only abort a child during On_Refresh().`,
        );
        Utils.Assert(
            child.Is_Alive(),
            `A child must be alive to be aborted.`,
        );
        Utils.Assert(
            child.Parent() === this,
            `A child must have this parent to be aborted.`,
        );

        child.Die();
    }

    Abort_All_Children():
        void
    {
        for (const child of Array.from(this.children.values())) {
            this.Abort_Child(child);
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

            // We skip checking if it's still alive so that we ensure even a dead element
            // goes back to its former state, e.g. when using the HTMLBodyElement.
            for (const [key, value] of Object.entries(last_keyframe)) {
                if (key !== `offset` && value != null) {
                    const value_string: string = value.toString();
                    this.styles[key] = value_string;
                    (element.style as any)[key] = value_string;
                }
            }
        }
    }

    async Animate_By_Frame<User_State>(
        on_frame: Animation_Frame_Callback<User_State>,
        state: User_State,
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
                                    new Animation_Frame(
                                        {
                                            now: now,
                                            start: start as Float,
                                            elapsed: now - start,
                                        },
                                    ),
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
