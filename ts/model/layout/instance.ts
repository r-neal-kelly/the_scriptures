import * as Entity from "../entity.js";
import * as Desktop from "./desktop.js";
import * as Taskbar from "./taskbar.js";
import * as Window from "./window.js";

export class Instance extends Entity.Instance
{
    private desktop: Desktop.Instance;
    private taskbar: Taskbar.Instance;

    constructor()
    {
        super();

        this.desktop = new Desktop.Instance(
            {
                layout: this,
            },
        );
        this.taskbar = new Taskbar.Instance(
            {
                layout: this,
            },
        );

        this.Add_Dependencies(
            [
                this.desktop,
                this.taskbar,
            ],
        );
    }

    Desktop():
        Desktop.Instance
    {
        return this.desktop;
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
        return await this.Desktop().Wall().Add_Program(program);
    }
}
