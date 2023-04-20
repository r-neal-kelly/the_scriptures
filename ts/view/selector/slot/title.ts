import { ID } from "../../../types.js";

import * as Model from "../../../model/selector/slot.js";

import * as Entity from "../../entity.js";
import * as Slot from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            slot,
            model,
        }: {
            slot: Slot.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: slot,
                event_grid: slot.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        this.Element().textContent = model.Name();
    }

    override On_Reclass():
        Array<string>
    {
        return [`Slot_Title`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Event_Grid_ID():
        ID
    {
        return this.Slot().Event_Grid_ID();
    }

    Is_Visible():
        boolean
    {
        return this.Slot().Is_Visible();
    }

    Slot():
        Slot.Instance
    {
        return this.Parent() as Slot.Instance;
    }
}
