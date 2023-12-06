import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Entity from "../entity.js";
import * as Window from "./window.js";
import * as Bar from "./bar.js";
import * as Tab from "./tab.js";

export class Instance extends Entity.Instance
{
    private bar: Bar.Instance;
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
        this.tabs = [];

        this.Add_Dependencies(
            this.tabs,
        );
    }

    Bar():
        Bar.Instance
    {
        return this.bar;
    }

    Tab_Count():
        Count
    {
        return this.tabs.length;
    }

    Has_Tab(
        tab: Tab.Instance,
    ):
        boolean
    {
        return this.tabs.indexOf(tab) > -1;
    }

    Has_Tab_At(
        index: Index,
    ):
        boolean
    {
        return (
            index > -1 &&
            index < this.tabs.length
        );
    }

    Tab_At(
        index: Index,
    ):
        Tab.Instance
    {
        Utils.Assert(
            index > -1,
            `index must be greater than -1.`,
        );
        Utils.Assert(
            index < this.Tab_Count(),
            `index must be less than count.`,
        );

        return this.tabs[index];
    }

    Tabs():
        Array<Tab.Instance>
    {
        return Array.from(this.tabs);
    }

    Add_Tab(
        window: Window.Instance,
    ):
        void
    {
        this.tabs.push(
            new Tab.Instance(
                {
                    tabs: this,
                    window: window,
                },
            ),
        );
    }

    Remove_Tab(
        tab_index: Index,
    ):
        void
    {
        Utils.Assert(
            this.Has_Tab_At(tab_index),
            `Does not have tab at ${tab_index}.`,
        );

        this.tabs.splice(tab_index, 1);
    }
}
