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

    async Add_Window(
        {
            model_class,
            view_class,
            model_data = undefined,
        }: {
            model_class: Window.Model_Class,
            view_class: Window.View_Class,
            model_data?: Window.Model_Data,
        },
    ):
        Promise<Window.ID>
    {
        return this.Wall().Add_With(
            {
                model_class,
                view_class,
                model_data,
            },
        );
    }
}
