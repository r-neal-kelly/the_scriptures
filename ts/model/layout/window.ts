import { ID } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Async from "../../async.js";

import * as Layout from "./instance.js";

export { ID } from "../../types.js";

export enum State
{
    _NONE_ = 0,

    IS_ALIVE = 1 << 0,
    IS_MINIMIZED = 1 << 1,
    IS_MAXIMIZED = 1 << 2,
}

export class Instance extends Async.Instance
{
    private static next_id: ID = 0;

    private static New_ID():
        ID
    {
        Utils.Assert(
            Instance.next_id + 1 < Infinity,
            `Can't make a new id!`,
        );

        return Instance.next_id++;
    }

    private layout: Layout.Instance | null;
    private id: ID;
    private state: State;
    private program: Async.Instance;

    constructor(
        {
            layout,
            program,
        }: {
            layout: Layout.Instance | null,
            program: Async.Instance,
        },
    )
    {
        super();

        this.layout = layout;
        this.id = Instance.New_ID();
        this.state = State._NONE_;
        this.program = program;

        this.Is_Ready_After(
            [
                program,
            ],
        );
    }

    Has_Layout():
        boolean
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot know if a dead window has a layout.`,
        );

        return this.layout != null;
    }

    Layout():
        Layout.Instance
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to get a layout.`,
        );
        Utils.Assert(
            this.Has_Layout(),
            `Doesn't have a layout.`,
        );

        return this.layout as Layout.Instance;
    }

    Add_Layout(
        layout: Layout.Instance,
    ):
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to add a layout.`,
        );
        Utils.Assert(
            !this.Has_Layout(),
            `Already has a layout.`,
        );

        layout.Add_Window(this);
        this.layout = layout;
    }

    Remove_Layout():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to remove a layout.`,
        );
        Utils.Assert(
            this.Has_Layout(),
            `Doesn't have a layout to remove.`,
        );

        this.Layout().Remove_Window(this.ID());
        this.layout = null;
    }

    Change_Layout(
        layout: Layout.Instance | null,
    ):
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to change layout.`,
        );

        if (this.Has_Layout()) {
            this.Remove_Layout();
        }
        if (layout != null) {
            this.Add_Layout(layout);
        }
    }

    ID():
        ID
    {
        return this.id;
    }

    State():
        State
    {
        return this.state;
    }

    Program():
        Async.Instance
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to get its program.`,
        );

        return this.program;
    }

    Is_Alive():
        boolean
    {
        return (this.state & State.IS_ALIVE) !== 0;
    }

    private Live():
        void
    {
        Utils.Assert(
            !this.Is_Alive(),
            `Window is already alive.`,
        );

        this.state |= State.IS_ALIVE;

        if (this.layout != null) {
            const layout = this.layout;
            this.layout = null;
            this.Add_Layout(layout);
        }
    }

    Kill():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window is already dead.`,
        );

        this.Change_Layout(null);
        this.state &= ~State.IS_ALIVE;
    }

    Is_Minimized():
        boolean
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot know if a dead window is minimized.`,
        );

        return (this.state & State.IS_MINIMIZED) !== 0;
    }

    Minimize():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot minimize a dead window.`,
        );

        this.state |= State.IS_MINIMIZED;
    }

    Unminimize():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot unminimize a dead window.`,
        );

        this.state &= ~State.IS_MINIMIZED;
    }

    Toggle_Minimization():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot toggle minimization of a dead window.`,
        );

        this.state ^= State.IS_MINIMIZED;
    }

    Is_Maximized():
        boolean
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot know if a dead window is maximized.`,
        );

        return (this.state & State.IS_MAXIMIZED) !== 0;
    }

    Maximize():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot maximize a dead window.`,
        );

        this.state |= State.IS_MAXIMIZED;
    }

    Unmaximize():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot unmaximize a dead window.`,
        );

        this.state &= ~State.IS_MAXIMIZED;
    }

    Toggle_Maximization():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot toggle maximization of a dead window.`,
        );

        this.state ^= State.IS_MAXIMIZED;
    }

    override async Ready():
        Promise<void>
    {
        if (!this.Is_Ready()) {
            await super.Ready();
            this.Live();
        }
    }
}
