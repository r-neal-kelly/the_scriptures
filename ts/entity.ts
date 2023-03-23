import { Integer } from "./types.js";
import { Index } from "./types.js";
import { ID } from "./types.js";
import { Float } from "./types.js";

import * as Utils from "./utils.js";
import * as Queue from "./queue.js";
import * as Event from "./event.js";

export { ID } from "./types.js";

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

class Parent_And_Child
{
    private parent: Instance;
    private child: Instance;

    constructor(
        {
            parent,
            child,
        }: {
            parent: Instance,
            child: Instance,
        },
    )
    {
        this.parent = parent;
        this.child = child;
    }

    Parent():
        Instance
    {
        return this.parent;
    }

    Child():
        Instance
    {
        return this.child;
    }
}

export class Instance
{
    private static next_id: ID = 0;

    private id: ID;

    private element: HTMLElement;
    private styles: Styles;
    private parent: Instance | null;
    private children: Array<Instance>; // it may be worth using an object with an index attached to instance?
    private refresh_adoptions: Set<Instance> | null;
    private refresh_abortions: Set<Instance> | null;

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
        this.refresh_adoptions = null;
        this.refresh_abortions = null;

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
                Utils.Assert(this.Is_Alive());

                // waiting here allows the constructor
                // of the derived type to finish before this is called
                // we could alternatively have the derived type call this func
                await Utils.Wait_Milliseconds(1);

                const listeners: Array<Event.Listener_Info> = await this.On_Life();
                this.Event_Grid().Add_Many_Listeners(this, listeners);

                this.Apply_Styles(await this.On_Restyle());

                this.refresh_adoptions = new Set();
                this.refresh_abortions = new Set();
                await this.On_Refresh();
                await this.Execute_Adoptions_And_Abortions(
                    {
                        adoptions: this.refresh_adoptions,
                        abortions: this.refresh_abortions,
                    },
                );
                this.refresh_adoptions = null;
                this.refresh_abortions = null;
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

                    await Promise.all(
                        this.children.map(
                            async function (
                                child: Instance,
                            ):
                                Promise<void>
                            {
                                await child.Restyle();
                            },
                        ),
                    );
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
                if (
                    style != null &&
                    style.length === 2
                ) {
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
                    await this.Execute_Adoptions_And_Abortions(
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
                    this.Apply_Styles(await this.On_Restyle());

                    // These are temporarily stored during the refresh event
                    // to save on both hot and cold memory.
                    this.refresh_adoptions = adoptions;
                    this.refresh_abortions = abortions;
                    await this.On_Refresh();
                    this.refresh_adoptions = null;
                    this.refresh_abortions = null;

                    // Even though children can update the adoptions
                    // and abortions arrays asynchronously, their children
                    // are still added in order relative to itself.
                    // Okay, we need to skip calling refresh on any just
                    // adopted children, because their life event calls
                    // refresh. We also skip calling refresh on abortions
                    // to avoid unnecessary creation of entities in their
                    // refresh calls.
                    await Promise.all(
                        this.children.map(
                            async function (
                                child: Instance,
                            ):
                                Promise<void>
                            {
                                if (
                                    !adoptions.has(child) &&
                                    !abortions.has(child)
                                ) {
                                    await child.Refresh_Implementation(
                                        {
                                            adoptions: adoptions,
                                            abortions: abortions,
                                        },
                                    );
                                } else {
                                    // This is restyling everything at least twice
                                    // for adoptions, because the life event styles
                                    // its own entity, and each entity that is its
                                    // child also get the life event. But the problem
                                    // is that it's too slow. What should happen is that
                                    // the life event styles its element and then its children
                                    // quicker. That's why calling this is working faster,
                                    // because it doesn't wait to style its children.
                                    // Once we fix the life event, we may want to do the
                                    // same thing in the death event, and then this branch
                                    // can be completely removed.
                                    await child.Restyle();
                                }
                            },
                        ),
                    );
                }
            }.bind(this),
        );
    }

    private async Execute_Adoptions_And_Abortions(
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
        Utils.Assert(this.Is_Alive());

        // We update the dom all at once to limit draw calls.
        // Adoptions and abortions can come from the children
        // of this entity and can be passed as an arena to
        // children during the refresh cycle.
        for (const adoption of adoptions) {
            const child: Instance = adoption;
            const parent: Instance = adoption.Parent();

            Utils.Assert(parent.Is_Alive());
            Utils.Assert(child.Is_Alive());
            Utils.Assert(child.Element().parentElement === null);

            parent.Element().appendChild(child.Element());
        }

        const deaths: Array<Promise<void>> = [];
        for (const abortion of abortions) {
            const child: Instance = abortion;
            const parent: Instance = abortion.Parent();

            Utils.Assert(parent.Is_Alive());
            Utils.Assert(child.Is_Alive());
            Utils.Assert(child.Element().parentElement === parent.Element());

            parent.Element().removeChild(child.Element());
            deaths.push(child.Die());
        }
        await Promise.all(deaths);
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
                    await this.On_Death();

                    await Promise.all(
                        this.children.map(
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

        if (child.Element().parentElement === this.Element()) {
            // It would already be removed by this point if it was aborted
            this.Element().removeChild(child.Element());
        }

        const child_index: Index = this.children.indexOf(child);
        Utils.Assert(child_index > -1);
        for (let idx = child_index + 1, end = this.Child_Count(); idx < end; idx += 1) {
            this.children[idx - 1] = this.children[idx];
        }
        this.children.pop();
        child.parent = null;
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

        // We have a latent stack between this and abort.
        // First the child is added to an entity,
        // then to the dom,
        // then it's removed from the dom,
        // and then finally removed from its entity.
        this.children.push(child);
        child.parent = this;

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

        (this.refresh_abortions as Set<Instance>).add(child);
    }

    Abort_All_Children():
        void
    {
        for (const child of this.children) {
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
