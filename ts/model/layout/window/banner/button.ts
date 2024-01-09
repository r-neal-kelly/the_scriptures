import * as Utils from "../../../../utils.js";

import * as Commands from "./commands.js";

export class Instance
{
    private commands: Commands.Instance;

    constructor(
        {
            commands,
        }: {
            commands: Commands.Instance,
        },
    )
    {
        this.commands = commands;
    }

    Commands():
        Commands.Instance
    {
        return this.commands;
    }

    Symbol():
        string
    {
        Utils.Assert(
            false,
            `This method must be overridden.`,
        );

        return ``;
    }

    async Click():
        Promise<void>
    {
        Utils.Assert(
            false,
            `This method must be overridden.`,
        );
    }
}
