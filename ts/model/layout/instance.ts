import { ID } from "../../types.js";

import * as Entity from "../entity.js";
import * as Wall from "./wall.js";
import * as Window from "./window.js";
import * as Taskbar from "./taskbar.js";

export class Instance extends Entity.Instance
{
    private wall: Wall.Instance;
    private taskbar: Taskbar.Instance;
    private active_window: Window.Instance | null;

    constructor()
    {
        super();

        this.wall = new Wall.Instance(
            {
                layout: this,
            },
        );
        this.taskbar = new Taskbar.Instance(
            {
                layout: this,
            },
        );
        this.active_window = null;

        this.Add_Dependencies(
            [
                this.wall,
                this.taskbar,
            ],
        );
    }

    Wall():
        Wall.Instance
    {
        return this.wall;
    }

    Taskbar():
        Taskbar.Instance
    {
        return this.taskbar;
    }

    async Add_Program(
        program: Window.Program.Instance
    ):
        Promise<Window.Instance>
    {
        return await this.Wall().Add_Program(program);
    }

    Has_Active_Window():
        boolean
    {
        return this.active_window != null;
    }

    Maybe_Active_Window():
        Window.Instance | null
    {
        return this.active_window;
    }

    __Set_Active_Window__(
        active_window: Window.Instance | null,
    ):
        void
    {
        this.active_window = active_window;
    }
}
