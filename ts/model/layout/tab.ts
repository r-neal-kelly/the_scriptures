import { Index } from "../../types.js";
import { Name } from "../../types.js";

import * as Window from "./window.js";
import * as Tabs from "./tabs.js";

export class Instance
{
    private tabs: Tabs.Instance;
    private index: Index;

    constructor(
        {
            tabs,
            index
        }: {
            tabs: Tabs.Instance,
            index: Index,
        },
    )
    {
        this.tabs = tabs;
        this.index = index;
    }

    Tabs():
        Tabs.Instance
    {
        return this.tabs;
    }

    Index():
        Index
    {
        return this.index;
    }

    __Set_Index__(
        index: Index,
    ):
        void
    {
        this.index = index;
    }

    Window():
        Window.Instance
    {
        return this.Tabs().Taskbar().Layout().Desktop().Wall().Window_At(this.Index());
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

    Is_Active():
        boolean
    {
        return this.Window().Is_Active();
    }

    Is_Maximized():
        boolean
    {
        return this.Window().Is_Maximized();
    }

    Is_Minimized():
        boolean
    {
        return this.Window().Is_Minimized();
    }
}
