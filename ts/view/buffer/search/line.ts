import { Count } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Model from "../../../model/buffer/search/line.js";

import * as Entity from "../../entity.js";
import * as Text from "./instance.js";
import * as Segment from "./segment.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            text,
            model,
        }: {
            text: Text.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: text,
                event_grid: text.Event_Grid(),
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
                    line: this,
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

        classes.push(`Line`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
        } else if (model.Value() === ``) {
            classes.push(`Transparent`);
        } else if (model.Is_Centered()) {
            classes.push(`Centered_Line`);
        } else if (model.Is_Padded()) {
            classes.push(`Padded_Line`);
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

    Text():
        Text.Instance
    {
        return this.Parent() as Text.Instance;
    }

    Event_Grid_ID():
        ID
    {
        return this.Text().Event_Grid_ID();
    }
}
