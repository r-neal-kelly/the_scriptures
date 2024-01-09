import * as Window from "../instance.js";
import * as Title from "./title.js";
import * as Commands from "./commands.js";

export class Instance
{
    private window: Window.Instance;
    private title: Title.Instance;
    private commands: Commands.Instance;

    constructor(
        {
            window,
        }: {
            window: Window.Instance,
        },
    )
    {
        this.window = window;
        this.title = new Title.Instance(
            {
                banner: this,
            },
        );
        this.commands = new Commands.Instance(
            {
                banner: this,
            },
        );
    }

    Window():
        Window.Instance
    {
        return this.window;
    }

    Title():
        Title.Instance
    {
        return this.title;
    }

    Commands():
        Commands.Instance
    {
        return this.commands;
    }
}
