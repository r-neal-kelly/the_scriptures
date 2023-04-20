import { ID } from "../../../types.js";

import * as Event from "../../../event.js";

import * as Model from "../../../model/selector/slot/item.js";

import * as Events from "../../events.js";
import * as Entity from "../../entity.js";
import * as Items from "./items.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            items,
            model,
        }: {
            items: Items.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: items,
                event_grid: items.Event_Grid(),
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
                        Events.SELECTOR_SLOT_ITEM_SELECT,
                        this.ID(),
                    ),
                    event_handler: this.On_Selector_Slot_Item_Select,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        this.Element().textContent = this.Model().Name();
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Slot_Item`);
        if (model.Is_Selected()) {
            classes.push(`Slot_Item_Selected`);
        }

        return classes;
    }

    async On_Click(
        event: MouseEvent,
    ):
        Promise<void>
    {
        await this.Send(
            new Event.Info(
                {
                    affix: Events.SELECTOR_SLOT_ITEM_SELECT,
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

    async On_Selector_Slot_Item_Select():
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
        return this.Items().Event_Grid_ID();
    }

    Is_Visible():
        boolean
    {
        return this.Items().Is_Visible();
    }

    Items():
        Items.Instance
    {
        return this.Parent() as Items.Instance;
    }
}
