import { ID } from "../../../types.js";

import * as Event from "../../../event.js";

import * as Model from "../../../model/selector/settings/slot_order.js";

import * as Events from "../../events.js";
import * as Entity from "../../entity.js";
import * as Slot_Orders from "./slot_orders.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            slot_orders,
            model,
        }: {
            slot_orders: Slot_Orders.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: slot_orders,
                event_grid: slot_orders.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Element().addEventListener(
            `click`,
            this.On_Click.bind(this),
        );

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.SELECTOR_SLOT_ORDER_SELECT,
                        this.ID(),
                    ),
                    event_handler: this.On_Selector_Slot_Order_Select,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        if (this.Is_Visible()) {
            this.Element().textContent = this.Model().Name();
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Slot_Order`);
        if (!this.Is_Visible()) {
            classes.push(`Invisible`);
        } else {
            if (model.Is_Selected()) {
                classes.push(`Selected_Slot_Order`);
            }
        }

        return classes;
    }

    private async On_Click(
        event: MouseEvent,
    ):
        Promise<void>
    {
        await this.Send(
            new Event.Info(
                {
                    affix: Events.SELECTOR_SLOT_ORDER_SELECT,
                    suffixes: [
                        this.ID(),
                        this.Event_Grid_ID(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );
    }

    private async On_Selector_Slot_Order_Select():
        Promise<void>
    {
        this.Model().Select();
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Event_Grid_ID():
        ID
    {
        return this.Slot_Orders().Event_Grid_ID();
    }

    Slot_Orders():
        Slot_Orders.Instance
    {
        return this.Parent() as Slot_Orders.Instance;
    }

    Is_Visible():
        boolean
    {
        return this.Slot_Orders().Is_Visible();
    }
}
