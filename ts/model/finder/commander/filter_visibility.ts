import * as Commander from "./instance.js";

export class Instance
{
    private commander: Commander.Instance;
    private is_toggled: boolean;

    constructor(
        {
            commander,
        }: {
            commander: Commander.Instance,
        },
    )
    {
        this.commander = commander;
        this.is_toggled = false;
    }

    Commander():
        Commander.Instance
    {
        return this.commander;
    }

    Is_Toggled():
        boolean
    {
        return this.is_toggled;
    }

    Toggle():
        void
    {
        this.is_toggled = !this.is_toggled;
    }

    Symbol():
        string
    {
        if (this.Is_Toggled()) {
            return `Close Filter`;
        } else {
            return `Open Filter`;
        }
    }
}
