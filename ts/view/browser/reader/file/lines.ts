import { Count } from "../../../../types.js";

import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/reader/file/lines.js";

import * as File from "./instance.js";
import * as Line from "./line.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            file,
        }: {
            model: () => Model.Instance,
            file: File.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: file,
                event_grid: file.Event_Grid(),
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
            new Line.Instance(
                {
                    model: () => this.Model().At(idx),
                    lines: this,
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

    File():
        File.Instance
    {
        return this.Parent() as File.Instance;
    }
}
