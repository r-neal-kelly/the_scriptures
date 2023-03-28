import { Count } from "../../../../types.js";
import { Delta } from "../../../../types.js";

import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/reader/file/parts.js";

import * as Line from "./line.js";
import * as Part from "./part.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            line,
        }: {
            model: () => Model.Instance,
            line: Line.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: line,
                event_grid: line.Event_Grid(),
            },
        );

        this.model = model;
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return ``;
    }

    override async On_Refresh():
        Promise<void>
    {
        const model: Model.Instance = this.Model();
        const target: Count = model.Count();
        const current: Count = this.Child_Count();
        const delta: Delta = target - current;

        if (delta < 0) {
            for (let idx = current, end = current + delta; idx > end;) {
                idx -= 1;

                this.Abort_Child(this.Child(idx));
            }
        } else if (delta > 0) {
            for (let idx = current, end = current + delta; idx < end; idx += 1) {
                new Part.Instance(
                    {
                        model: () => this.Model().At(idx),
                        parts: this,
                    },
                );
            }
        }
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Line():
        Line.Instance
    {
        return this.Parent() as Line.Instance;
    }
}
