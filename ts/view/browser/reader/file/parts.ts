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

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();
        const model_count: Count = Math.max(Model.Instance.Min_Count(), model.Count());
        const view_count: Count = this.Child_Count();

        for (let idx = view_count, end = model_count; idx < end; idx += 1) {
            new Part.Instance(
                {
                    model: () => this.Model().At(idx),
                    parts: this,
                },
            );
        }
    }

    override On_Restyle():
        Entity.Styles | string
    {
        return ``;
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
