import * as Layout from "./instance.js";
import * as Starter from "./starter.js";
import * as Tabs from "./tabs.js";

export class Instance
{
    private layout: Layout.Instance;
    private starter: Starter.Instance;
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
        this.starter = new Starter.Instance(
            {
                taskbar: this,
            },
        );
        this.tabs = new Tabs.Instance(
            {
                taskbar: this,
            },
        );
    }

    Layout():
        Layout.Instance
    {
        return this.layout;
    }

    Starter():
        Starter.Instance
    {
        return this.starter;
    }

    Tabs():
        Tabs.Instance
    {
        return this.tabs;
    }
}
