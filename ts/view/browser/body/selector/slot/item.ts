import * as Entity from "../../../../../entity.js";
import * as Event from "../../../../../event.js";

import * as Model from "../../../../../model/browser/body/selector/slot/item.js";

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
        this.Element().addEventListener(
            `click`,
            this.On_Click.bind(this),
        );

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.ON, `Selector_Slot_Item_Select`, `${this.ID()}`),
                    event_handler: this.On_Selector_Slot_Item_Select,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        this.Element().textContent = model.Title();
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
                    affix: `Selector_Slot_Item_Select`,
                    suffixes: [
                        `${this.Items().Slot().Slots().Selector().Body().Browser().ID()}`,
                        `${this.ID()}`,
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
