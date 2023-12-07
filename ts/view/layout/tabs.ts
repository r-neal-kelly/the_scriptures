import { Count } from "../../types.js";
import { Delta } from "../../types.js";

import * as Model from "../../model/layout/tabs.js";

import * as Entity from "../entity.js";
import * as Taskbar from "./taskbar.js";
import * as Tab from "./tab.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            taskbar,
        }: {
            model: () => Model.Instance;
            taskbar: Taskbar.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: taskbar,
                event_grid: taskbar.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();
        const target: Count = model.Tab_Count();
        const count: Count = this.Child_Count();
        const delta: Delta = target - count;

        if (delta < 0) {
            for (let idx = count, end = count + delta; idx > end;) {
                idx -= 1;

                this.Abort_Child(this.Child(idx));
            }
        } else if (delta > 0) {
            for (let idx = count, end = count + delta; idx < end; idx += 1) {
                new Tab.Instance(
                    {
                        model: () => this.Model().Tab_At(idx),
                        tabs: this,
                    },
                );
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Tabs`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Taskbar():
        Taskbar.Instance
    {
        return this.Parent() as Taskbar.Instance;
    }
}
