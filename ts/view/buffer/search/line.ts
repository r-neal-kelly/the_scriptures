import { Count } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Model from "../../../model/buffer/search/line.js";

import * as Entity from "../../entity.js";
import * as Search from "./instance.js";
import * as Column from "./column.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            search,
            model,
        }: {
            search: Search.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: search,
                event_grid: search.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();
        const target: Count = Math.max(Model.Instance.Min_Column_Count(), model.Column_Count());
        const count: Count = this.Child_Count();

        for (let idx = count, end = target; idx < end; idx += 1) {
            new Column.Instance(
                {
                    line: this,
                    model: () => this.Model().Column_At(idx),
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
        } else {
            if (model.Is_Multi_Column()) {
                classes.push(`Multi_Column_Line`);
                if (model.Is_First_Multi_Column()) {
                    classes.push(`First_Multi_Column_Line`);
                }
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

    Search():
        Search.Instance
    {
        return this.Parent() as Search.Instance;
    }

    Event_Grid_ID():
        ID
    {
        return this.Search().Event_Grid_ID();
    }
}
