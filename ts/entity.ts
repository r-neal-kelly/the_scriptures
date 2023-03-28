import { Count } from "./types.js";
import { Index } from "./types.js";
import { ID } from "./types.js";
import { Float } from "./types.js";

import * as Utils from "./utils.js";
import * as Queue from "./queue.js";
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
    //): Promise<void>;

    /*
        Automatically queued through Live.

        Should not be waited on in any of the event listeners,
        it will dead-lock the queue.
    */
    Refresh(): Promise<void>;

    /*
        Should not be waited on in any of the event listeners,
        it will dead-lock the queue.
    */
    Restyle(): Promise<void>;

    /*
        Automatically queued when the parent of the entity dies.

        Should not be waited on in any of the event listeners,
        it will dead-lock the queue.
    */
    Die(): Promise<void>;
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
    private static next_id: ID = 0;

    private id: ID;
    private element: HTMLElement;
    private styles: Styles;

    private parent: Instance | null;
    private children: Map<HTMLElement, Instance>;
    private refresh_adoptions: Set<Instance> | null;
    private refresh_abortions: Set<Instance> | null;

    private is_alive: boolean;
    private life_cycle_queue: Queue.Instance;
    private event_grid: Event.Grid;

    constructor(
        {
            element,
            parent,
            event_grid,
        }: {
            element: string | HTMLBodyElement,
            parent: Instance | null,
            event_grid: Event.Grid,
        },
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
        this.children = new Map();
        this.refresh_adoptions = null;
        this.refresh_abortions = null;

        this.is_alive = false;
        this.life_cycle_queue = new Queue.Instance();
        this.event_grid = event_grid;

        this.Live(parent);
    }

    private async Live(
        parent: Instance | null,
    ):
        Promise<void>
    {
        if (!this.Is_Alive()) {
            this.is_alive = true;

            this.Event_Grid().Add_Many_Listeners(this, this.On_Life());

            // We only refresh when there is no parent
            // because the parent itself will refresh
            // its children through this event.
            if (parent != null) {
                parent.Adopt_Child(this);
            } else {
                // Waiting in the queue allows the derived type to
                // finish its constructor.
                //this.life_cycle_queue.Enqueue(
                //    async function ():
                //        Promise<void>
                //    {
                await Utils.Wait_Milliseconds(1);
                //    }
                //);
                this.Refresh();
            }
        }
    }

    async Refresh():
        Promise<void>
    {
        //this.life_cycle_queue.Enqueue(
        //    function (
        //        this: Instance,
        //    ):
        //        void
        //    {
        if (this.Is_Alive()) {
            this.refresh_adoptions = new Set();
            this.refresh_abortions = new Set();

            this.On_Refresh();

            for (const abortion of this.refresh_abortions) {
                const child: Instance = abortion;
                const parent: Instance = abortion.Parent();

                if (child.Element().parentElement === parent.Element()) {
                    parent.Element().removeChild(child.Element());
                }
                child.Die();
            }

            for (const adoption of this.refresh_adoptions) {
                const child: Instance = adoption;
                const parent: Instance = adoption.Parent();

                parent.Element().appendChild(child.Element());
            }

            for (const child of this.children.values()) {
                child.Refresh();
            }
        }
        //    }.bind(this),
        //);

        await this.Restyle();
    }

    async Restyle():
        Promise<void>
    {
        //await this.life_cycle_queue.Enqueue(
        //    function (
        //        this: Instance,
        //    ):
        //        void
        //    {
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
        //    }.bind(this),
        //);
    }

    async Die():
        Promise<void>
    {
        //await this.life_cycle_queue.Enqueue(
        //    function (
        //        this: Instance,
        //    ):
        //        void
        //    {
        if (this.Is_Alive()) {
            this.Before_Death();

            for (const child of this.children.values()) {
                child.Die();
            }

            if (this.Has_Parent()) {
                const parent: Instance = this.Parent();
                if (this.Element().parentElement === parent.Element()) {
                    parent.Element().removeChild(this.Element());
                }
                this.parent = null;
                parent.children.delete(this.Element());
            }

            this.Event_Grid().Remove(this);
            this.life_cycle_queue.Flush();
            this.is_alive = false;

            this.styles = {};
            this.element = document.body;
        }
        //    }.bind(this),
        //);
    }

    Is_Alive():
        boolean
    {
        return this.is_alive;
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
            this.refresh_adoptions != null,
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

        child.parent = this;
        this.children.set(child.Element(), child);

        (this.refresh_adoptions as Set<Instance>).add(child);
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
            this.refresh_abortions != null,
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

        // We don't directly remove the child entity from parent entity
        // to maintain the stack started in Adopt. It's fully removed in
        // the Die event instead.
        (this.refresh_abortions as Set<Instance>).add(child);
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
