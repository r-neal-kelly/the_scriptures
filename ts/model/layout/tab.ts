import * as Window from "./window.js";
import { ID } from "./window.js";
import * as Tabs from "./tabs.js";

export { ID } from "./window.js";

export class Instance
{
    private tabs: Tabs.Instance;
    private window: Window.Instance;

    constructor(
        {
            tabs,
            window
        }: {
            tabs: Tabs.Instance,
            window: Window.Instance,
        },
    )
    {
        this.tabs = tabs;
        this.window = window;
    }

    Tabs():
        Tabs.Instance
    {
        return this.tabs;
    }

    ID():
        ID
    {
        return this.window.ID();
    }

    Window():
        Window.Instance
    {
        return this.window;
    }
}
