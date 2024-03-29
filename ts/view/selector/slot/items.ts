import { Count } from "../../../types.js";
import { Delta } from "../../../types.js";

import * as Model from "../../../model/selector/slot.js";

import * as Entity from "../../entity.js";
import * as Slot from "./instance.js";
import * as Item from "./item.js";

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
        const target: Count = model.Item_Count();
        const count: Count = this.Child_Count();
        const delta: Delta = target - count;

        if (delta < 0) {
            for (let idx = count, end = count + delta; idx > end;) {
                idx -= 1;

                this.Abort_Child(this.Child(idx));
            }
        } else if (delta > 0) {
            for (let idx = count, end = count + delta; idx < end; idx += 1) {
                new Item.Instance(
                    {
                        items: this,
                        model: () => this.Model().Item_At_Index(idx),
                    },
                );
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Slot_Items`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Slot():
        Slot.Instance
    {
        return this.Parent() as Slot.Instance;
    }

    Is_Visible():
        boolean
    {
        return this.Slot().Is_Visible();
    }
}
