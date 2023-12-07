import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Wall from "../wall.js";
import { State } from "./state.js";
import * as Program from "./program.js";
import * as Banner from "./banner.js";

import { Render_Type } from "../wall/render_type.js";
export { Render_Type } from "../wall/render_type.js";

export class Instance extends Entity.Instance
{
    private wall: Wall.Instance | null;
    private state: State;
    private program: Program.Instance;
    private banner: Banner.Instance;

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
        this.banner = new Banner.Instance(
            {
                window: this,
            },
        );

        this.Add_Dependencies(
            [
                this.program,
                this.banner,
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

    Maybe_Wall():
        Wall.Instance | null
    {
        Utils.Assert(
            this.Is_Alive(),
            `Cannot know if a dead window is in a wall.`,
        );

        return this.wall;
    }

    Some_Wall():
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

    private Add_To_Wall(
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

        wall.__Add_Window__(this);
        this.wall = wall;
    }

    private Remove_From_Wall():
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

        this.Some_Wall().__Remove_Window__(this);
        this.wall = null;
    }

    Index():
        Index
    {
        Utils.Assert(
            this.Is_Alive(),
            `Window must be alive to get its wall.`,
        );
        Utils.Assert(
            this.Is_In_Wall(),
            `Isn't in a wall.`,
        );

        return this.Some_Wall().Window_Index(this);
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

    Banner():
        Banner.Instance
    {
        return this.banner;
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
            if (
                this.program.Is_Window_Active() ||
                !wall.Layout().Has_Active_Window()
            ) {
                this.Activate();
            }
            if (this.program.Is_Window_Maximized()) {
                this.Maximize();
            } else if (this.program.Is_Window_Minimized()) {
                this.Minimize();
            }
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

    Is_Active():
        boolean
    {
        return (
            this.Is_In_Wall() &&
            this.Some_Wall().Layout().Maybe_Active_Window() === this
        );
    }

    Activate():
        void
    {
        Utils.Assert(
            this.Is_In_Wall(),
            `not in wall, can't activate`,
        );

        this.Some_Wall().Layout().__Set_Active_Window__(this);
    }

    Deactivate():
        void
    {
        Utils.Assert(
            this.Is_In_Wall(),
            `not in wall, can't deactivate`,
        );

        this.Some_Wall().Layout().__Set_Active_Window__(null);
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

    Is_Visible():
        boolean
    {
        return this.Is_In_Wall() && !this.Is_Minimized();
    }

    Render_Type():
        Render_Type
    {
        Utils.Assert(
            this.Is_Visible(),
            `is not visible.`,
        );

        return this.Some_Wall().Render_Type();
    }

    Render_Limit():
        Count
    {
        Utils.Assert(
            this.Is_Visible(),
            `is not visible.`,
        );

        return this.Some_Wall().Render_Limit();
    }

    override async Before_Dependencies_Are_Ready():
        Promise<void>
    {
        // We do this before so that the window can
        // get anchored to its wall quicker.
        this.Live();
    }
}
