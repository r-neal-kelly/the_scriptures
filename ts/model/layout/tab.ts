import * as Entity from "../entity.js";
import * as Window from "./window.js";
import * as Tabs from "./tabs.js";

export class Instance extends Entity.Instance
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
        super();

        this.tabs = tabs;
        this.window = window;

        this.Is_Ready_After(
            [
            ],
        );
    }

    Tabs():
        Tabs.Instance
    {
        return this.tabs;
    }

    Window():
        Window.Instance
    {
        return this.window;
    }
}
