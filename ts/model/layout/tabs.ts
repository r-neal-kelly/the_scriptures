import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { ID } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Entity from "../entity.js";
import * as Window from "./window.js";
import * as Bar from "./bar.js";
import * as Tab from "./tab.js";

export class Instance extends Entity.Instance
{
    private bar: Bar.Instance;
    private window_ids: Array<ID>;
    private tabs: Array<Tab.Instance>;

    constructor(
        {
            bar,
        }: {
            bar: Bar.Instance,
        },
    )
    {
        super();

        this.bar = bar;
        this.window_ids = [];
        this.tabs = [];

        this.Is_Ready_After(
            this.tabs,
        );
    }

    Bar():
        Bar.Instance
    {
        return this.bar;
    }

    Count():
        Count
    {
        return this.tabs.length;
    }

    Has(
        tab: Tab.Instance,
    ):
        boolean
    {
        return this.tabs.indexOf(tab) > -1;
    }

    Has_At(
        index: Index,
    ):
        boolean
    {
        return (
            index > -1 &&
            index < this.tabs.length
        );
    }

    At(
        index: Index,
    ):
        Tab.Instance
    {
        Utils.Assert(
            index > -1,
            `index must be greater than -1.`,
        );
        Utils.Assert(
            index < this.Count(),
            `index must be less than count.`,
        );

        return this.tabs[index];
    }

    Tabs():
        Array<Tab.Instance>
    {
        return Array.from(this.tabs);
    }

    Has_Window(
        window: Window.Instance,
    ):
        boolean
    {
        return this.window_ids.indexOf(window.ID()) > -1;
    }

    Add_Window(
        window: Window.Instance,
    ):
        void
    {
        Utils.Assert(
            !this.Has_Window(window),
            `Already has window with id of ${window.ID()}.`,
        );

        this.window_ids.push(window.ID());
        this.tabs.push(
            new Tab.Instance(
                {
                    tabs: this,
                    window: window,
                },
            ),
        );
    }

    Remove_Window(
        window: Window.Instance,
    ):
        void
    {
        const index: Index = this.window_ids.indexOf(window.ID());
        Utils.Assert(
            index > -1,
            `Does not have window with id of ${window.ID()}.`,
        );

        this.window_ids.splice(index, 1);
        this.tabs.splice(index, 1);
    }

    Windows():
        Array<Window.Instance>
    {
        const windows: Array<Window.Instance> = [];
        for (const tab of this.tabs) {
            windows.push(tab.Window());
        }

        return windows;
    }
}
