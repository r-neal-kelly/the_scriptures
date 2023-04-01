import { Count } from "../../types.js";
import { Delta } from "../../types.js";

import * as Entity from "../../entity.js";

import * as Model from "../../model/layout/wall.js";

import * as Layout from "./instance.js";
import * as Window from "./window.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            layout,
        }: {
            model: () => Model.Instance;
            layout: Layout.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: layout,
                event_grid: layout.Event_Grid(),
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
                new Window.Instance(
                    {
                        model: () => this.Model().At(idx),
                        wall: this,
                    },
                );
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Wall`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Layout():
        Layout.Instance
    {
        return this.Parent() as Layout.Instance;
    }
}
