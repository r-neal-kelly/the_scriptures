import * as Entity from "../../entity.js";
import * as Menu from "./instance.js";

export class Instance extends Entity.Instance
{
    private menu: Menu.Instance;

    constructor(
        {
            menu,
        }: {
            menu: Menu.Instance,
        },
    )
    {
        super();

        this.menu = menu;

        this.Add_Dependencies(
            [
            ],
        );
    }

    Menu():
        Menu.Instance
    {
        return this.menu;
    }

    Text():
        string
    {
        return `Open Finder`;
    }
}
