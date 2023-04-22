import { Count } from "../../../../../types.js";
import { Delta } from "../../../../../types.js";

import * as Model from "../../../../../model/finder/body/results/tree/branch.js";

import * as Entity from "../../../../entity.js";
import * as Tree from "./instance.js";
import * as Branch from "./branch.js";
import * as Leaf from "./leaf.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            branch,
            model,
        }: {
            branch: Branch.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: branch,
                event_grid: branch.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();
        const target: Count = model.Leaf_Count();
        const count: Count = this.Child_Count();
        const delta: Delta = target - count;

        if (delta < 0) {
            for (let idx = count, end = count + delta; idx > end;) {
                idx -= 1;

                this.Abort_Child(this.Child(idx));
            }
        } else if (delta > 0) {
            for (let idx = count, end = count + delta; idx < end; idx += 1) {
                new Leaf.Instance(
                    {
                        parent: this,
                        model: () => this.Model().Leaf_At(idx),
                    },
                );
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Leaves`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Tree():
        Tree.Instance
    {
        let parent: Entity.Instance = this.Parent();
        while (!(parent instanceof Tree.Instance)) {
            parent = parent.Parent();
        }

        return parent as Tree.Instance;
    }
}
