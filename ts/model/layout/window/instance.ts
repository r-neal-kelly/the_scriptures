import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Wall from "../wall.js";
import { State } from "./state.js";
import * as Program from "./program.js";
import * as Bar from "./bar.js";

export class Instance extends Entity.Instance
{
    private wall: Wall.Instance | null;
    private state: State;
    private program: Program.Instance;
    private bar: Bar.Instance;

    constructor(
        {
            wall,
            program,
        }: {
            wall: Wall.Instance | null,
            program: Program.Instance,
        },
    )
    {
        super();

        this.wall = wall;
        this.state = State._NONE_;
        this.program = program;
        this.bar = new Bar.Instance(
            {
                window: this,
            },
        );

        this.Is_Ready_After(
            [
                this.program,
                this.bar,
            ],
        );
    }

    Is_In_Wall():
        boolean
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot know if a dead window is in a wall.`,
        );

        return this.wall != null;
    }

    Wall():
        Wall.Instance
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to get its wall.`,
        );
        Utils.Assert(
            this.Is_In_Wall(),
            `Isn't in a wall.`,
        );

        return this.wall as Wall.Instance;
    }

    Add_To_Wall(
        wall: Wall.Instance,
    ):
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to be added to a wall.`,
        );
        Utils.Assert(
            !this.Is_In_Wall(),
            `Is already in a wall.`,
        );

        wall.Add(this);
        this.wall = wall;
    }

    Remove_From_Wall():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to be removed from a wall.`,
        );
        Utils.Assert(
            this.Is_In_Wall(),
            `Isn't in a wall.`,
        );

        this.Wall().Remove(this.ID());
        this.wall = null;
    }

    Move_To_Wall(
        wall: Wall.Instance | null,
    ):
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to be moved to a wall.`,
        );

        if (this.Is_In_Wall()) {
            this.Remove_From_Wall();
        }
        if (wall != null) {
            this.Add_To_Wall(wall);
        }
    }

    State():
        State
    {
        return this.state;
    }

    Program():
        Program.Instance
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to get its model.`,
        );
        Utils.Assert(
            this.Is_Ready(),
            `Window does not have a ready program, it's probably still loading in.`,
        )

        return this.program;
    }

    Bar():
        Bar.Instance
    {
        return this.bar;
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

        if (this.wall != null) {
            const wall = this.wall;
            this.wall = null;
            this.Add_To_Wall(wall);
        }
    }

    Kill():
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window is already dead.`,
        );

        this.Move_To_Wall(null);
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

    Is_Active():
        boolean
    {
        return this.Wall().Layout().Maybe_Active_Window() === this;
    }

    override async Ready():
        Promise<void>
    {
        if (!this.Is_Ready()) {
            this.Live();
            // We do this after Live so that the window can
            // get anchored to its wall synchronously.
            await super.Ready();
        }
    }
}
