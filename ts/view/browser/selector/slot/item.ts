import * as Entity from "../../../../entity.js";
import * as Event from "../../../../event.js";

import * as Model from "../../../../model/browser/selector/slot/item.js";

import * as Slot from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;
    private slot: Slot.Instance;

    constructor(
        {
            model,
            slot,
        }: {
            model: Model.Instance,
            slot: Slot.Instance,
        },
    )
    {
        super(`div`, slot.Event_Grid());

        this.model = model;
        this.slot = slot;
    }

    override async On_Life():
        Promise<Array<Event.Listener_Info>>
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
                    event_handler: this.On_Select.bind(this),
                    event_priority: 0,
                },
            ),
        ];
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
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

    override async On_Refresh():
        Promise<void>
    {
        this.Abort_All_Children();

        this.Element().textContent = this.Model().Name();
    }

    async On_Click(
        event: MouseEvent,
    ):
        Promise<void>
    {
        this.Send(
            new Event.Info(
                {
                    affix: `Selector_Slot_Item_Select`,
                    suffixes: [
                        this.ID().toString(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {
                        item: this,
                    },
                },
            ),
        );
    }

    async On_Select(
        {
            item,
        }: {
            item: Instance,
        },
    ):
        Promise<void>
    {
        await this.Model().Select();
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Slot():
        Slot.Instance
    {
        return this.slot;
    }
}
