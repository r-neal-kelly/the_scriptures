import * as Utils from "../../../../utils.js";

import * as Entity from "../../../entity.js";
import * as Commands from "./commands.js";

export class Instance extends Entity.Instance
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
        super();

        this.commands = commands;

        this.Is_Ready_After(
            [
            ],
        );
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
