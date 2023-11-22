import { Count } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Model from "../../../model/buffer/text/column.js";

import * as Entity from "../../entity.js";
import * as Line from "./line.js";
import * as Row from "./row.js";

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
        const target: Count = Math.max(Model.Instance.Min_Row_Count(), model.Row_Count());
        const count: Count = this.Child_Count();

        for (let idx = count, end = target; idx < end; idx += 1) {
            new Row.Instance(
                {
                    column: this,
                    model: () => this.Model().Row_At(idx),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Column`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
        } else {
            if (model.Is_Marginal()) {
                classes.push(`Marginal_Column`);
            } else if (model.Is_Inter_Marginal()) {
                classes.push(`Inter_Marginal_Column`);
            } else if (model.Is_Interlinear()) {
                classes.push(`Interlinear_Column`);
            } else if (model.Is_Inter_Interlinear()) {
                classes.push(`Inter_Interlinear_Column`);
            }
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
