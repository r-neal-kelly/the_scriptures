import { Count } from "../../../../types.js";

import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/reader/file/segments.js";

import * as Line from "./line.js";
import * as Segment from "./segment.js";

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
        const target: Count = Math.max(Model.Instance.Min_Count(), model.Count());
        const count: Count = this.Child_Count();

        for (let idx = count, end = target; idx < end; idx += 1) {
            new Segment.Instance(
                {
                    model: () => this.Model().At(idx),
                    segments: this,
                },
            );
        }
    }

    override On_Restyle():
        string
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
