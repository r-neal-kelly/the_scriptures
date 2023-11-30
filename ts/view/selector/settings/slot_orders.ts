import { Count } from "../../../types.js";
import { Delta } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Model from "../../../model/selector/settings.js";

import * as Entity from "../../entity.js";
import * as Settings from "./instance.js";
import * as Slot_Order from "./slot_order.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            settings,
            model,
        }: {
            settings: Settings.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: settings,
                event_grid: settings.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Refresh():
        void
    {
        if (this.Is_Visible()) {
            const model: Model.Instance = this.Model();
            const target: Count = model.Slot_Order_Count();
            const count: Count = this.Child_Count();
            const delta: Delta = target - count;

            if (delta < 0) {
                for (let idx = count, end = count + delta; idx > end;) {
                    idx -= 1;

                    this.Abort_Child(this.Child(idx));
                }
            } else if (delta > 0) {
                for (let idx = count, end = count + delta; idx < end; idx += 1) {
                    new Slot_Order.Instance(
                        {
                            slot_orders: this,
                            model: () => this.Model().Slot_Order(idx),
                        },
                    );
                }
            }
        } else {
            this.Skip_Children();
        }
    }

    override On_Reclass():
        Array<string>
    {
        const classes: Array<string> = [];

        classes.push(`Slot_Orders`);
        if (!this.Is_Visible()) {
            classes.push(`Invisible`);
        }

        return classes;
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Event_Grid_ID():
        ID
    {
        return this.Settings().Event_Grid_ID();
    }

    Settings():
        Settings.Instance
    {
        return this.Parent() as Settings.Instance;
    }

    Is_Visible():
        boolean
    {
        return this.Settings().Is_Visible() && this.Model().Is_Toggled();
    }
}
