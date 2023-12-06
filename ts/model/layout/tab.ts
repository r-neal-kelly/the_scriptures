import { Name } from "../../types.js";

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

        this.Add_Dependencies(
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

    Title():
        Name
    {
        if (this.Window().Is_Ready()) {
            return this.Window().Program().Model_Instance().Short_Title();
        } else {
            return `Loading`;
        }
    }
}
