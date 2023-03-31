import { Count } from "./types.js";
import { Index } from "./types.js";
import { ID } from "./types.js";
import { Float } from "./types.js";
import { Name } from "./types.js";

import * as Utils from "./utils.js";
import * as Event from "./event.js";

export { ID } from "./types.js";

/*
    Life-Cycle:
        Live:
            On_Life
            On_Refresh
            On_Reclass
            On_Restyle
        Refresh:
            On_Refresh
            On_Reclass
            On_Restyle
        Reclass:
            On_Reclass
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

    HTML_ID(): string;

    Element(): HTMLElement;
}

export interface Life_Cycle_Sender_API
{
    /*
        Automatically called after the entity is constructed.
    */
    // private Live(
    //    parent: Instance | null,
    //): void;

    /*
        Automatically called through Live.
        You can call this to refresh an entity and all of its children.
    */
    Refresh(): void;

    /*
        Automatically called through Live and Refresh.
    */
    Reclass(): void;

    /*
        Automatically called through Live, Reclass, and Refresh.
        You can call this to restyle an entity and all of its children.
        Calling this does not fully refresh entities, but only updates
        their styles.
    */
    Restyle(): void;

    /*
        Automatically called when the parent of the entity dies,
        or when the entity is aborted.

        Typically, you only need to call this directly for the top
        entity of your entity tree, e.g. before unloading the window.
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
        Providing this event handler allows you to return CSS classes that will
        be applied to the entity's underlying element.
        The returned classes completely replace all classes on the entity.
        Returned classes should simply be a class_name.
        Children get this event after their parents.
        If a child is aborted in the Refresh event, it does not receive this event.
    */
    On_Reclass(): Array<string>;

    /*
        Providing this event handler allows you to return CSS styles that will
        be applied to the entity's underlying element.
        Styles returned as a string completely replace all styles on the entity.
        Styles returned as an object only override styles on the entity.
        The returned string should have valid CSS code within it, as if you were
        writing the interior of a valid CSS class, without the '{' and '}'.
        Children get this event after their parents.
        If a child is aborted in the Refresh event, it does not receive this event.
    */
    On_Restyle(): string | { [index: string]: string };

    /*
        Providing this event handler allows you to work with an entity
        before its children die and before it is removed from its parent.
        The entity is still in the DOM during this event.
        Children get this event before their parents.
    */
    Before_Death(): void;
}

export interface CSS_API
{
    /*
        Adds css that is localized to this entity and its children.
    */
    Add_CSS(
        css: string,
    ): void;

    /*
        Adds css that is localized only to this entity.
    */
    Add_This_CSS(
        css: string,
    ): void;

    /*
        Adds css that is localized only to this entity's children.
    */
    Add_Children_CSS(
        css: string,
    ): void;
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

    /*
        Works during On_Refresh(), On_Reclass(), and On_Restyle().
        Allows you to completely skip the above three listeners
        on the children of an entity.

        Is reset after being checked, so the next cycle will not
        skip children unless this is called again.
    */
    Skip_Children(): void;

    /*
        Works during On_Refresh(), On_Reclass(), and On_Restyle().
        Allows you to completely skip the above three listeners
        on the remaining siblings of an entity.

        Is reset after being checked, so the next cycle will not
        skip remaining siblings unless this is called again.
    */
    Skip_Remaining_Siblings(): void;
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

enum Life_Cycle_Listener
{
    _NONE_ = 0,

    ON_LIFE,
    ON_REFRESH,
    ON_RECLASS,
    ON_RESTYLE,
    BEFORE_DEATH,
}

enum Life_Cycle_Skip
{
    _NONE_ = 0,

    CHILDREN = 1 << 0,
    REMAINING_SIBLINGS = 1 << 1,
}

export class Instance implements
    Info_API,
    Life_Cycle_Sender_API,
    Life_Cycle_Listener_API,
    CSS_API,
    Parent_API,
    Child_API,
    Event_API,
    Animation_API
{
    private static class_id: string =
        `${new Date().getTime()}${Math.random().toString().replace(/\./g, ``)}`;
    private static next_id: ID = 0;

    private is_alive: boolean;
    private id: ID;
    private element: HTMLElement;
    private event_grid: Event.Grid;

    private css: HTMLStyleElement | null;
    private css_to_add: string | null;

    private parent: Instance | null;
    private children: Map<HTMLElement, Instance>;

    private life_cycle_listener: Life_Cycle_Listener;
    private life_cycle_skip: Life_Cycle_Skip;

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
        this.event_grid = event_grid;

        this.css = null;
        this.css_to_add = null;

        this.parent = null;
        this.children = new Map();

        this.life_cycle_listener = Life_Cycle_Listener._NONE_;
        this.life_cycle_skip = Life_Cycle_Skip._NONE_;

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
                this.HTML_ID(),
            );

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

    // This algorithm for the different Life-Cycle Senders is extremely efficient
    // because it only goes over the tree once, instead of once per Sender.
    Refresh():
        void
    {
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

    private Refresh_This():
        void
    {
        if (
            this.Is_Alive() &&
            Object.getPrototypeOf(this).hasOwnProperty(`On_Refresh`)
        ) {
            this.life_cycle_listener = Life_Cycle_Listener.ON_REFRESH;
            this.On_Refresh();
            this.life_cycle_listener = Life_Cycle_Listener._NONE_;
        }
    }

    Reclass():
        void
    {
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

    private Reclass_This():
        void
    {
        if (
            this.Is_Alive() &&
            Object.getPrototypeOf(this).hasOwnProperty(`On_Reclass`)
        ) {
            this.life_cycle_listener = Life_Cycle_Listener.ON_RECLASS;
            const classes: string = this.On_Reclass().join(` `);
            this.life_cycle_listener = Life_Cycle_Listener._NONE_;

            // This might not be necessary, but we're trying to avoid internal browser slowdown.
            // It's probably already doing this internally, so we can relax it. However,
            // we can't just use the classList on element, it's way too slow sometimes.
            const element: HTMLElement = this.Element();
            const current_classes: string | null = element.getAttribute(`class`);
            if (
                current_classes == null ||
                current_classes !== classes
            ) {
                element.setAttribute(
                    `class`,
                    classes,
                );
            }
        }
    }

    Restyle():
        void
    {
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

    private Restyle_This():
        void
    {
        if (
            this.Is_Alive() &&
            Object.getPrototypeOf(this).hasOwnProperty(`On_Restyle`)
        ) {
            this.life_cycle_listener = Life_Cycle_Listener.ON_RESTYLE;
            const styles: string | { [index: string]: string } = this.On_Restyle();
            this.life_cycle_listener = Life_Cycle_Listener._NONE_;

            if (styles as any instanceof Object) {
                const element: HTMLElement = this.Element();
                for (const style of Object.entries(styles)) {
                    (element.style as any)[style[0]] = style[1];
                }
            } else {
                this.Element().setAttribute(
                    `style`,
                    styles as string,
                );
            }
        }
    }

    Die():
        void
    {
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
                const parent: Instance = this.Parent();
                const parent_element: HTMLElement = parent.Element();
                const child_element: HTMLElement = this.Element();

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

    On_Life():
        Array<Event.Listener_Info>
    {
        Utils.Assert(
            false,
            `This method must be overridden to be used.`,
        );

        return [];
    }

    On_Refresh():
        void
    {
        Utils.Assert(
            false,
            `This method must be overridden to be used.`,
        );

        return;
    }

    On_Reclass():
        Array<string>
    {
        Utils.Assert(
            false,
            `This method must be overridden to be used.`,
        );

        return [];
    }

    On_Restyle():
        string | { [index: string]: string }
    {
        Utils.Assert(
            false,
            `This method must be overridden to be used.`,
        );

        return ``;
    }

    Before_Death():
        void
    {
        Utils.Assert(
            false,
            `This method must be overridden to be used.`,
        );

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

    HTML_ID():
        string
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot get an html ID from a dead entity.`,
        );

        return `Entity_${Instance.class_id}_${this.ID()}`;
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

    // We still need to handle things like is:() and where:() I think
    Add_CSS(
        css: string,
    ):
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot add css on a dead entity.`,
        );
        Utils.Assert(
            this.life_cycle_listener === Life_Cycle_Listener.ON_LIFE,
            `You can only add css during On_Life().`,
        );

        const html_id: string = this.HTML_ID();

        this.css_to_add += `
            /* CSS for ${html_id} and its Children: */
        `;
        this.css_to_add += css.replace(
            /(}\s*|^\s*)([^@{]+)({)/g,
            function (
                match: string,
                left: string,
                selector_list: string,
                right: string,
            ):
                string
            {
                let result: string = ``;

                const selectors: Array<string> = selector_list.trim().split(/\s*,\s*/g);
                for (let idx = 0, end = selectors.length; idx < end; idx += 1) {
                    const selector: string = selectors[idx];
                    result += `${selector.replace(/^([^\s>~+|]*)/, `$1#${html_id}`)}, `;
                    if (idx !== end - 1) {
                        result += `#${html_id} ${selector}, `;
                    } else {
                        result += `#${html_id} ${selector} `;
                    }
                }

                return `${left}${result}${right}`;
            },
        );
    }

    Add_This_CSS(
        this_css: string,
    ):
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot add this_css on a dead entity.`,
        );
        Utils.Assert(
            this.life_cycle_listener === Life_Cycle_Listener.ON_LIFE,
            `You can only add this_css during On_Life().`,
        );

        const html_id: string = this.HTML_ID();

        this.css_to_add += `
            /* CSS for ${html_id}: */
        `;
        this.css_to_add += this_css.replace(
            /(}\s*|^\s*)([^@{]+)({)/g,
            function (
                match: string,
                left: string,
                selector_list: string,
                right: string,
            ):
                string
            {
                let result: string = ``;

                const selectors: Array<string> = selector_list.trim().split(/\s*,\s*/g);
                for (let idx = 0, end = selectors.length; idx < end; idx += 1) {
                    const selector: string = selectors[idx];
                    if (idx !== end - 1) {
                        result += `${selector.replace(/^([^\s>~+|]*)/, `$1#${html_id}`)}, `;
                    } else {
                        result += `${selector.replace(/^([^\s>~+|]*)/, `$1#${html_id}`)} `;
                    }
                }

                return `${left}${result}${right}`;
            },
        );
    }

    Add_Children_CSS(
        children_css: string,
    ):
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot add children_css on a dead entity.`,
        );
        Utils.Assert(
            this.life_cycle_listener === Life_Cycle_Listener.ON_LIFE,
            `You can only add children_css during On_Life().`,
        );

        const html_id: string = this.HTML_ID();

        this.css_to_add += `
            /* CSS for ${html_id}'s Children: */
        `;
        this.css_to_add += children_css.replace(
            /(}\s*|^\s*)([^@{]+)({)/g,
            function (
                match: string,
                left: string,
                selector_list: string,
                right: string,
            ):
                string
            {
                let result: string = ``;

                const selectors: Array<string> = selector_list.trim().split(/\s*,\s*/g);
                for (let idx = 0, end = selectors.length; idx < end; idx += 1) {
                    const selector: string = selectors[idx];
                    if (idx !== end - 1) {
                        result += `#${html_id} ${selector}, `;
                    } else {
                        result += `#${html_id} ${selector} `;
                    }
                }

                return `${left}${result}${right}`;
            },
        );
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
            this.life_cycle_listener === Life_Cycle_Listener.ON_REFRESH,
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
            this.life_cycle_listener === Life_Cycle_Listener.ON_REFRESH,
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

    Skip_Children():
        void
    {
        Utils.Assert(
            this.life_cycle_listener === Life_Cycle_Listener.ON_REFRESH ||
            this.life_cycle_listener === Life_Cycle_Listener.ON_RECLASS ||
            this.life_cycle_listener === Life_Cycle_Listener.ON_RESTYLE,
            `You can only skip children during On_Refresh(), On_Reclass(), or On_Restyle().`,
        );

        this.life_cycle_skip |= Life_Cycle_Skip.CHILDREN;
    }

    Skip_Remaining_Siblings():
        void
    {
        Utils.Assert(
            this.life_cycle_listener === Life_Cycle_Listener.ON_REFRESH ||
            this.life_cycle_listener === Life_Cycle_Listener.ON_RECLASS ||
            this.life_cycle_listener === Life_Cycle_Listener.ON_RESTYLE,
            `You can only skip remaining siblings during On_Refresh(), On_Reclass(), or On_Restyle().`,
        );

        this.life_cycle_skip |= Life_Cycle_Skip.REMAINING_SIBLINGS;
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
                    (element.style as any)[key] = value.toString();
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
