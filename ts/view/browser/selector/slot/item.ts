import * as Entity from "../../../../entity.js";
import * as Event from "../../../../event.js";

import * as Model from "../../../../model/browser/selector/slot/item.js";

import * as Items from "./items.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;

    constructor(
        {
            model,
            items,
        }: {
            model: Model.Instance,
            items: Items.Instance,
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
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Element().addEventListener(`click`, this.On_Click.bind(this));

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        "Selector_Slot_Item_Select",
                        this.ID().toString(),
                    ),
                    event_handler: this.On_Selector_Slot_Item_Select.bind(this),
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        this.Element().textContent = this.Model().Title();
    }

    override On_Restyle():
        Entity.Styles | string
    {
        let color: string;
        let background_color: string;
        if (this.Model().Is_Selected()) {
            color = `black`;
            background_color = `white`;
        } else {
            color = `white`;
            background_color = `black`;
        }

        return `
            width: 100%;
            padding: 2px 2px;
            
            overflow-x: hidden;
            overflow-y: hidden;

            background-color: ${background_color};
            color: ${color};

            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        `;
    }

    async On_Click(
        event: MouseEvent,
    ):
        Promise<void>
    {
        await this.Send(
            new Event.Info(
                {
                    affix: `Selector_Slot_Item_Select`,
                    suffixes: [
                        this.ID().toString(),
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
        await this.Model().Select();
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Items():
        Items.Instance
    {
        return this.Parent() as Items.Instance;
    }
}
