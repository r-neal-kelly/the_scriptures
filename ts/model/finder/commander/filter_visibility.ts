import * as Entity from "../../entity.js";

export class Instance extends Entity.Instance
{
    private is_toggled: boolean;

    constructor()
    {
        super();

        this.is_toggled = false;

        this.Add_Dependencies(
            [
            ],
        );
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
