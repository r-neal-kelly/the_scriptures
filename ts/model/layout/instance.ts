import { ID } from "../../types.js";

import * as Entity from "../entity.js";
import * as Wall from "./wall.js";
import * as Window from "./window.js";
import * as Bar from "./bar.js";

export class Instance extends Entity.Instance
{
    private wall: Wall.Instance;
    private bar: Bar.Instance;
    private active_window: Window.Instance | null;

    constructor()
    {
        super();

        this.wall = new Wall.Instance(
            {
                layout: this,
            },
        );
        this.bar = new Bar.Instance(
            {
                layout: this,
            },
        );
        this.active_window = null;

        this.Add_Dependencies(
            [
                this.wall,
                this.bar,
            ],
        );
    }

    Wall():
        Wall.Instance
    {
        return this.wall;
    }

    Bar():
        Bar.Instance
    {
        return this.bar;
    }

    async Add_Program(
        program: Window.Program.Instance
    ):
        Promise<ID>
    {
        return await this.Wall().Add_Program(program);
    }

    Maybe_Active_Window():
        Window.Instance | null
    {
        return this.active_window;
    }

    Set_Active_Window(
        active_window: Window.Instance | null,
    ):
        void
    {
        this.active_window = active_window;
    }
}
