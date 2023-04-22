import { ID } from "../../../types.js";

import * as Model from "../../../model/buffer/search/division.js";

import * as Entity from "../../entity.js";
import * as Item from "./item.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            item,
            model,
        }: {
            item: Item.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: item,
                event_grid: item.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Refresh():
        void
    {
        this.Element().textContent = this.Model().Value();
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Division`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
        } else {
            if (model.Is_Highlighted()) {
                classes.push(`Highlighted_Division`);
            }
        }

        return classes;
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Item():
        Item.Instance
    {
        return this.Parent() as Item.Instance;
    }

    Event_Grid_ID():
        ID
    {
        return this.Item().Event_Grid_ID();
    }
}
