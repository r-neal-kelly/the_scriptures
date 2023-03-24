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

    override async On_Life():
        Promise<Array<Event.Listener_Info>>
    {
        this.Element().addEventListener(`click`, this.On_Click.bind(this));

        return [];
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
        this.Element().textContent = this.Model().Title();
    }

    async On_Click(
        event: MouseEvent,
    ):
        Promise<void>
    {
        const model: Model.Instance = this.Model();

        await model.Select();

        await this.Send(
            new Event.Info(
                {
                    affix: `Selector_Slot_Item_Select`,
                    suffixes: [],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );
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
