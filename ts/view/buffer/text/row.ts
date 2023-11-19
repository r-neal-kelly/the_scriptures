import { Count } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Model from "../../../model/buffer/text/row.js";

import * as Entity from "../../entity.js";
import * as Column from "./column.js";
import * as Segment from "./segment.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            column,
            model,
        }: {
            column: Column.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: column,
                event_grid: column.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();
        const target: Count = Math.max(Model.Instance.Min_Segment_Count(), model.Segment_Count());
        const count: Count = this.Child_Count();

        for (let idx = count, end = target; idx < end; idx += 1) {
            new Segment.Instance(
                {
                    row: this,
                    model: () => this.Model().Segment_At(idx),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Row`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
        } else if (model.Value() === ``) {
            classes.push(`Transparent`);
        } else if (model.Is_Centered()) {
            classes.push(`Centered_Row`);
        } else if (model.Is_Padded()) {
            classes.push(`Padded_Row`);
        }

        return classes;
    }

    override On_Restyle():
        string | { [index: string]: string; }
    {
        const model: Model.Instance = this.Model();

        return model.Styles();
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Column():
        Column.Instance
    {
        return this.Parent() as Column.Instance;
    }

    Event_Grid_ID():
        ID
    {
        return this.Column().Event_Grid_ID();
    }
}
