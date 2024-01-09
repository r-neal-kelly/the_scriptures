import * as Menu from "./instance.js";

export class Instance
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
        this.menu = menu;
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
