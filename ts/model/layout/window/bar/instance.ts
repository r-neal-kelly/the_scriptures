import * as Entity from "../../../entity.js";
import * as Window from "../instance.js";
import * as Title from "./title.js";
import * as Commands from "./commands.js";

export class Instance extends Entity.Instance
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
        super();

        this.window = window;
        this.title = new Title.Instance(
            {
                bar: this,
            },
        );
        this.commands = new Commands.Instance(
            {
                bar: this,
            },
        );

        this.Add_Dependencies(
            [
                this.title,
                this.commands,
            ],
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
