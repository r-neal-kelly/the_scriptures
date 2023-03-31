import { Count } from "../../../../types.js";

import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/reader/file/line.js";

import * as File from "./instance.js";
import * as Item from "./item.js";

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
        const target: Count = Math.max(Model.Instance.Min_Item_Count(), model.Item_Count());
        const count: Count = this.Child_Count();

        for (let idx = count, end = target; idx < end; idx += 1) {
            new Item.Instance(
                {
                    model: () => this.Model().Item_At(idx),
                    line: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Line`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
        } else if (model.Text().Value() === ``) {
            classes.push(`Transparent`);
        } else if (model.Text().Is_Centered()) {
            classes.push(`Centered_Line`);
        }

        return classes;
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
