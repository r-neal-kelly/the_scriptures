import { ID } from "../../types.js";

import * as Entity from "../entity.js";
import * as Wall from "./wall.js";
import * as Window from "./window.js";
import * as Bar from "./bar.js";

export class Instance extends Entity.Instance
{
    private wall: Wall.Instance;
    private bar: Bar.Instance;

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

        this.Is_Ready_After(
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
}
