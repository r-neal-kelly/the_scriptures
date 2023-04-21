import * as Entity from "../../entity.js";
import * as Search from "../../search.js";
import * as Body from "./instance.js";

export class Instance extends Entity.Instance
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
        super();

        this.body = body;
        this.value = ``;
        this.help = null;

        this.Add_Dependencies(
            [
            ],
        );
    }

    Value():
        string
    {
        return this.value;
    }

    Maybe_Help():
        Search.Parser.Help | null
    {
        return this.help;
    }
}
