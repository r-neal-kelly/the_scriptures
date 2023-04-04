import { Count } from "../../types.js";
import { Delta } from "../../types.js";

import * as Model from "../../model/layout/tabs.js";

import * as Entity from "../entity.js";
import * as Bar from "./bar.js";
import * as Tab from "./tab.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            bar,
        }: {
            model: () => Model.Instance;
            bar: Bar.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: bar,
                event_grid: bar.Event_Grid(),
            },
        );

        this.model = model;
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();
        const target: Count = model.Count();
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
                        model: () => this.Model().At(idx),
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

    Bar():
        Bar.Instance
    {
        return this.Parent() as Bar.Instance;
    }
}
