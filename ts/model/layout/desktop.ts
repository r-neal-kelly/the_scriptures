import * as Layout from "./instance.js";
import * as Wall from "./wall.js";
import * as Window from "./window.js";
import * as Menu from "./menu.js";

export class Instance
{
    private layout: Layout.Instance;
    private wall: Wall.Instance;
    private menu: Menu.Instance;

    constructor(
        {
            layout,
        }: {
            layout: Layout.Instance,
        },
    )
    {
        this.layout = layout;
        this.wall = new Wall.Instance(
            {
                desktop: this,
            },
        );
        this.menu = new Menu.Instance(
            {
                desktop: this,
            },
        );
    }

    Layout():
        Layout.Instance
    {
        return this.layout;
    }

    Wall():
        Wall.Instance
    {
        return this.wall;
    }

    Menu():
        Menu.Instance
    {
        return this.menu;
    }

    async Add_Program(
        program: Window.Program.Instance
    ):
        Promise<Window.Instance>
    {
        return await this.Wall().Add_Program(program);
    }
}
