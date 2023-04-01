import * as Layout from "./instance.js";
import * as Tabs from "./tabs.js";

export class Instance
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
        this.layout = layout;
        this.tabs = new Tabs.Instance(
            {
                bar: this,
            },
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
