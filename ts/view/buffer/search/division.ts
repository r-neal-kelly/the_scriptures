import { ID } from "../../../types.js";

import * as Model from "../../../model/buffer/search/division.js";

import * as Entity from "../../entity.js";
import * as Buffer from "./instance.js";
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
        const model: Model.Instance = this.Model();

        if (!model.Is_Blank()) {
            this.Element().textContent = this.Model().Value();
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        if (model.Is_Blank()) {
            classes.push(`Blank_Division`);
        } else {
            classes.push(`Division`);
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

    Buffer():
        Buffer.Instance
    {
        return this.Item().Buffer();
    }

    Item():
        Item.Instance
    {
        return this.Parent() as Item.Instance;
    }

    Event_Grid_ID():
        ID
    {
        return this.Buffer().Event_Grid_ID();
    }
}
