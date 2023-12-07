import * as Entity from "../entity.js";
import * as Layout from "./instance.js";
import * as Tabs from "./tabs.js";

export class Instance extends Entity.Instance
{
    private layout: Layout.Instance;
    private tabs: Tabs.Instance;

    constructor(
        {
            layout,
        }: {
            layout: Layout.Instance,
        },
    )
    {
        super();

        this.layout = layout;
        this.tabs = new Tabs.Instance(
            {
                taskbar: this,
            },
        );

        this.Add_Dependencies(
            [
                this.tabs,
            ],
        );
    }

    Layout():
        Layout.Instance
    {
        return this.layout;
    }

    Tabs():
        Tabs.Instance
    {
        return this.tabs;
    }
}
