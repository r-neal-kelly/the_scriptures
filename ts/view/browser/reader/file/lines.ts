import { Count } from "../../../../types.js";
import { Delta } from "../../../../types.js";

import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/reader/file/lines.js";

import * as File from "./instance.js";
import * as Line from "./line.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;

    constructor(
        {
            model,
            file,
        }: {
            model: Model.Instance,
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

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return ``;
    }

    override async On_Refresh():
        Promise<void>
    {
        const model: Model.Instance = this.Model();
        const count: Count = this.Child_Count();
        const delta: Delta = model.Count() - count;

        if (delta < 0) {
            for (let idx = count, end = count + delta; idx > end;) {
                idx -= 1;

                this.Abort_Child(this.Child(idx));
            }
        } else if (delta > 0) {
            for (let idx = count, end = count + delta; idx < end;) {
                new Line.Instance(
                    {
                        model: model.At(idx),
                        lines: this,
                    },
                );

                idx += 1;
            }
        }
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    File():
        File.Instance
    {
        return this.Parent() as File.Instance;
    }
}
