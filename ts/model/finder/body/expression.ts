import * as Utils from "../../../utils.js";

import * as Search from "../../search.js";
import * as Body from "./instance.js";

export class Instance
{
    private body: Body.Instance;
    private value: string;
    private help: Search.Parser.Help | null;

    constructor(
        {
            body,
        }: {
            body: Body.Instance,
        },
    )
    {
        this.body = body;
        this.value = ``;
        this.help = null;
    }

    Body():
        Body.Instance
    {
        return this.body;
    }

    Value():
        string
    {
        return this.value;
    }

    Set_Value(
        value: string,
    ):
        void
    {
        this.value = value;
        this.help = null;
    }

    Placeholder():
        string
    {
        return `type an expression`;
    }

    Has_Help():
        boolean
    {
        return this.help != null;
    }

    Maybe_Help():
        Search.Parser.Help | null
    {
        return this.help;
    }

    Help():
        Search.Parser.Help
    {
        Utils.Assert(
            this.Has_Help(),
            `Does not have help.`,
        );

        return this.help as Search.Parser.Help;
    }

    Set_Help(
        help: Search.Parser.Help | null
    ):
        void
    {
        this.help = help;
    }
}
