import * as Wall from "./wall.js";
import * as Window from "./window.js";
import * as Bar from "./bar.js";

export class Instance
{
    private wall: Wall.Instance;
    private bar: Bar.Instance;

    constructor()
    {
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
        Promise<Window.ID>
    {
        return await this.Wall().Add_Program(program);
    }
}
