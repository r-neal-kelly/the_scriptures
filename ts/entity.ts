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
            On_Restyle
            On_Refresh
            After_Refresh
        Restyle:
            On_Restyle
        Refresh:
            On_Restyle
            On_Refresh
            After_Refresh
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

        Queues a full Refresh on itself directly if it is not adopted
        synchronously during or after creation in another entity's
        On_Refresh event listener, or else it is automatically
        refreshed by its parent.
    */
    // private Live(): Promise<void>;

    /*
        Should not be waited on in any of the event listeners,
        it will dead-lock the queue.
    */
    Restyle(): Promise<void>;

    /*
        Automatically queued through Live.

        Should not be waited on in any of the event listeners,
        it will dead-lock the queue.
    */
    Refresh(): Promise<void>;

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
        The Event is triggered immediately upon construction of the entity,
        and after the executing async frame that made the entity is finished.
        After On_Refresh, it automatically refreshes if it has no parent, otherwise
        it waits for its parent to refresh before it refreshes.
        The element of the entity is fully accessible, however it is only added to
        the DOM in the refresh cycle.
    */
    On_Life(): Promise<Array<Event.Listener_Info>>;

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
        All children receive this event at the same time.
        If a child is aborted, it does not receive the event.
    */
    On_Restyle(): Promise<Styles | string>;

    /*
    */
    Before_Refresh(): Promise<void>;

    /*
        Providing this event handler allows you to Adopt and Abort children
        entities, thus building the internal tree structure of your entity.
        Children get this event after their parents.
        All children receive this event at the same time.
        If a child is aborted during this event, this is not called on it.
    */
    On_Refresh(): Promise<void>;

    /*
        Providing this event handler allows you to word on an entity after
        its children have been updated on the DOM in the Refresh event.
        Children get this event after their parents.
        All children receive this event at the same time.
        If a child is aborted during this event, this is not called on it.
    */
    After_Refresh(): Promise<void>;

    /*
        Providing this event handler allows you to work with an entity
        before its children die and before it is removed from its parent.
        The entity is still in the DOM during this event.
        Children get this event before their parents.
        All children receive the event at the same time.
    */
    Before_Death(): Promise<void>;
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

        // This is queued and executed before the potential
        // refresh below.
        this.Live();

        // We only allow adoption of children in the
        // constructor or in the refresh event, and so
        // there is no possibility that the latent Live
        // event will change if this has a parent or not,
        // therefore it's perfectly safe to check now.
        if (parent != null) {
            // Notice that the parent's refresh_adoptions
            // must necessarily be extant when this is called,
            // but not the child's, whose refresh event is called
            // after parent's finishes.
            parent.Adopt_Child(this);
        } else {
            // We only refresh when there is no parent
            // because the parent itself will refresh
            // its children.
            this.Refresh();
        }
    }

    Is_Alive():
        boolean
    {
        return this.is_alive;
    }

    private async Live():
        Promise<void>
    {
        if (!this.Is_Alive()) {
            this.is_alive = true;

            await this.life_cycle_queue.Enqueue(
                async function (
                    this: Instance,
                ):
                    Promise<void>
                {
                    // Waiting here allows the constructor
                    // of the derived type to finish before this is called.
                    // We could also use the async type perhaps, to let the main entity
                    // start life for all of its children.
                    // This also gives time to parent an entity before this tries to refresh
                    // itself if it doesn't have a parent.
                    await Utils.Wait_Milliseconds(1);

                    if (this.Has_On_Life()) {
                        this.Event_Grid().Add_Many_Listeners(this, await this.On_Life());
                    }
                }.bind(this),
            );
        }
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
                    if (this.Has_On_Restyle()) {
                        this.Apply_Styles(await this.On_Restyle());
                    }

                    // It's more efficient to check if it has a listener
                    // before spinning up an async frame.
                    const promises: Array<Promise<void>> = [];
                    (
                        function Call_Children(
                            entity: Instance,
                        ):
                            void
                        {
                            for (const child of entity.children.values()) {
                                if (child.Has_On_Restyle()) {
                                    promises.push(child.Restyle());
                                } else {
                                    // If a child doesn't have On_Restyle,
                                    // then its children can be treated in its
                                    // place in each await pass of the tree.
                                    Call_Children(child);
                                }
                            }
                        }
                    )(this);
                    await Promise.all(promises);
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
                styles.split(/\s*;\s*/).map(s => s.match(/[^:]+/g));
            for (const style of styles_array) {
                if (style != null) {
                    // There can be empty lines of just space, which is just fine.
                    // But an invalid statement, no
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
    }

    async Refresh():
        Promise<void>
    {
        if (this.Is_Alive()) {
            // we need to queue like so in case a parent tries to call Refresh_Implementation
            // while this is still operating. Because Enqueue doesn't wait to put the
            // callbacks in the queue, this will certainly run one after the other,
            // and Refresh_Implementation itself adds a callback to the queue which will
            // run after these. We can't actually combine the two into one callback because
            // it does add to the queue, and we would end up creating a deadlock.
            const adoptions: Set<Instance> = new Set();
            const abortions: Set<Instance> = new Set();

            // We could also remove the queue from Refresh_Implementation, put it here
            // and when it calls its child, but when it calls the child, it has to use
            // the child's queue. this does work how it is however.
            // We DO NOT await here because we want these two to be queued one right after
            // another. We can await on the second which itself waits on this before
            // executing.
            this.Refresh_Implementation(
                {
                    adoptions,
                    abortions,
                },
            );

            await this.life_cycle_queue.Enqueue(
                async function (
                    this: Instance,
                ):
                    Promise<void>
                {
                    await this.Adopt_And_Abort_Unqueued(
                        {
                            adoptions,
                            abortions,
                        },
                    );
                }.bind(this),
            );
        }
    }

    private async Refresh_Implementation(
        {
            adoptions,
            abortions,
        }: {
            adoptions: Set<Instance>,
            abortions: Set<Instance>,
        },
    ):
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
                    if (this.Has_On_Restyle()) {
                        this.Apply_Styles(await this.On_Restyle());
                    }

                    if (this.Has_Before_Refresh()) {
                        await this.Before_Refresh();
                    }

                    // These are temporarily stored during the refresh event
                    // to save on both hot and cold memory.
                    if (this.Has_On_Refresh()) {
                        this.refresh_adoptions = adoptions;
                        this.refresh_abortions = abortions;
                        await this.On_Refresh();
                        this.refresh_adoptions = null;
                        this.refresh_abortions = null;
                    }

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
                    await Promise.all(
                        Array.from(this.children.values()).map(
                            async function (
                                child: Instance,
                            ):
                                Promise<void>
                            {
                                if (!abortions.has(child)) {
                                    await child.Refresh_Implementation(
                                        {
                                            adoptions: adoptions,
                                            abortions: abortions,
                                        },
                                    );
                                }
                            },
                        ),
                    );
                }
            }.bind(this),
        );
    }

    private async Adopt_And_Abort_Unqueued(
        {
            adoptions,
            abortions,
        }: {
            adoptions: Set<Instance>,
            abortions: Set<Instance>,
        },
    ):
        Promise<void>
    {
        // This function is called within the context of a queued callback to avoid deadlock.

        Utils.Assert(this.Is_Alive());

        // We update the dom all at once to limit draw calls.
        // Adoptions and abortions can come from the children
        // of this entity and are passed as an arena to
        // children during the refresh cycle.
        // It should be noted because of the lopsided nature of
        // abortions not being able to have refresh calls after abortion,
        // the children of abortions are not within the abortions array,
        // only the top of the branches being severed. Die and Before_Dying take this into account.
        // Otherwise we'd have to create a cache to check if a child as a parent has already died
        // before inefficiently calling for its children's death.
        const deaths: Array<Promise<void>> = [];
        for (const abortion of abortions) {
            const child: Instance = abortion;
            const parent: Instance = abortion.Parent();

            Utils.Assert(parent.Is_Alive());
            Utils.Assert(child.Is_Alive());

            if (child.Element().parentElement === parent.Element()) {
                // I don't think it's possible in our algorithm that this
                // could already be removed, but it can happen, perhaps something
                // in the browser, not sure. Also I suppose it's possible for
                // a user to do this, so the redundancy is not a bad thing.
                parent.Element().removeChild(child.Element());
            }
            deaths.push(child.Die());
        }

        for (const adoption of adoptions) {
            const child: Instance = adoption;
            const parent: Instance = adoption.Parent();

            Utils.Assert(parent.Is_Alive());
            Utils.Assert(child.Is_Alive());
            Utils.Assert(child.Element().parentElement === null);

            parent.Element().appendChild(child.Element());
        }

        // This will not cause a deadlock in this entity's queue
        // because all of the deaths are children and not its own.
        await Promise.all(deaths);

        await this.After_Refreshing_Unqueued();
    }

    private async After_Refreshing_Unqueued():
        Promise<void>
    {
        // This function is called within the context of a queued callback to avoid deadlock.

        Utils.Assert(this.Is_Alive());

        if (this.Has_After_Refresh()) {
            await this.After_Refresh();
        }

        const promises: Array<Promise<void>> = [];
        (
            function Call_Children(
                entity: Instance,
            ):
                void
            {
                for (const child of entity.children.values()) {
                    if (child.Has_After_Refresh()) {
                        promises.push(child.After_Refreshing_Unqueued());
                    } else {
                        Call_Children(child);
                    }
                }
            }
        )(this);
        await Promise.all(promises);
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
                    if (this.Has_Before_Death()) {
                        await this.Before_Death();
                    }

                    await Promise.all(
                        Array.from(this.children.values()).map(
                            async function (
                                child: Instance,
                            ):
                                Promise<void>
                            {
                                await child.Die();
                            },
                        ),
                    );

                    if (this.Has_Parent()) {
                        const parent: Instance = this.Parent();
                        if (this.Element().parentElement === parent.Element()) {
                            // We need to check because it would already
                            // be removed by this point if it was aborted,
                            // but it would still be there during a manual
                            // Die event.
                            parent.Element().removeChild(this.Element());
                        }
                        this.parent = null;
                        parent.children.delete(this.Element());
                    }

                    this.Event_Grid().Remove(this);

                    this.element = document.body;
                    this.is_alive = false;
                }
            }.bind(this),
        );
    }

    private Has_On_Life():
        boolean
    {
        return Object.getPrototypeOf(this).hasOwnProperty(`On_Life`);
    }

    async On_Life():
        Promise<Array<Event.Listener_Info>>
    {
        Utils.Assert(
            false,
            `You need to override On_Life or update your life_cycle_info.`,
        );

        return [];
    }

    private Has_On_Restyle():
        boolean
    {
        return Object.getPrototypeOf(this).hasOwnProperty(`On_Restyle`);
    }

    async On_Restyle():
        Promise<Styles | string>
    {
        Utils.Assert(
            false,
            `You need to override On_Restyle or update your life_cycle_info.`,
        );

        return ``;
    }

    private Has_Before_Refresh():
        boolean
    {
        return Object.getPrototypeOf(this).hasOwnProperty(`Before_Refresh`);
    }

    async Before_Refresh():
        Promise<void>
    {
        Utils.Assert(
            false,
            `You need to override Before_Refresh or update your life_cycle_info.`,
        );

        return;
    }

    private Has_On_Refresh():
        boolean
    {
        return Object.getPrototypeOf(this).hasOwnProperty(`On_Refresh`);
    }

    async On_Refresh():
        Promise<void>
    {
        Utils.Assert(
            false,
            `You need to override On_Refresh or update your life_cycle_info.`,
        );

        return;
    }

    private Has_After_Refresh():
        boolean
    {
        return Object.getPrototypeOf(this).hasOwnProperty(`After_Refresh`);
    }

    async After_Refresh():
        Promise<void>
    {
        Utils.Assert(
            false,
            `You need to override After_Refresh or update your life_cycle_info.`,
        );

        return;
    }

    private Has_Before_Death():
        boolean
    {
        return Object.getPrototypeOf(this).hasOwnProperty(`Before_Death`);
    }

    async Before_Death():
        Promise<void>
    {
        Utils.Assert(
            false,
            `You need to override Before_Death or update your life_cycle_info.`,
        );

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

        // We have a latent stack between this and abort.
        // First the child is added to an entity,
        // then to the dom,
        // then it's removed from the dom,
        // and then finally removed from its entity.
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
        // to maintain the stack as noted in Adopt. It's fully removed in
        // the Die event.
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
        // should this and animate methods be queued?
        // the reason I think not is because it would
        // be easy to dead-lock the queue by waiting for Refresh for example.
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
