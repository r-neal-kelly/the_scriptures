import { Count } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Model from "../../../model/buffer/search/segment.js";

import * as Entity from "../../entity.js";
import * as Line from "./line.js";
import * as Item from "./item.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            line,
            model,
        }: {
            line: Line.Instance,
            model: () => Model.Instance,
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

        this.Live();
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();
        if (model.Is_Blank()) {
            this.Skip_Children();

            if (this.Element().classList.contains(`Blank`)) {
                this.Skip_Remaining_Siblings();
            }
        } else {
            const target: Count = Math.max(Model.Instance.Min_Item_Count(), model.Item_Count());
            const count: Count = this.Child_Count();

            for (let idx = count, end = target; idx < end; idx += 1) {
                new Item.Instance(
                    {
                        segment: this,
                        model: () => this.Model().Item_At(idx),
                    },
                );
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Segment`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
        }

        return classes;
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

    Event_Grid_ID():
        ID
    {
        return this.Line().Event_Grid_ID();
    }
}
