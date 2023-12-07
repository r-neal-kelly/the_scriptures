import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Entity from "../entity.js";
import * as Taskbar from "./taskbar.js";
import * as Tab from "./tab.js";

export class Instance extends Entity.Instance
{
    private taskbar: Taskbar.Instance;
    private tabs: Array<Tab.Instance>;

    constructor(
        {
            taskbar,
        }: {
            taskbar: Taskbar.Instance,
        },
    )
    {
        super();

        this.taskbar = taskbar;
        this.tabs = [];

        this.Add_Dependencies(
            this.tabs,
        );
    }

    Taskbar():
        Taskbar.Instance
    {
        return this.taskbar;
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

    Add_Tab():
        void
    {
        this.tabs.push(
            new Tab.Instance(
                {
                    tabs: this,
                    index: this.tabs.length,
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

        for (
            let tab_idx = tab_index, tab_end = this.tabs.length;
            tab_idx < tab_end;
            tab_idx += 1
        ) {
            this.Tab_At(tab_idx).__Set_Index__(tab_idx);
        }
    }
}
