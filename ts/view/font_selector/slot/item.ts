import * as Event from "../../../event.js";

import * as Model from "../../../model/font_selector/slot/item.js";

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
                        Events.FONT_SELECTOR_SLOT_ITEM_SELECT,
                        this.ID(),
                    ),
                    event_handler: this.On_Font_Selector_Slot_Item_Select,
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

    private async On_Click(
        event: MouseEvent,
    ):
        Promise<void>
    {
        const model: Model.Instance = this.Model();

        await this.Send(
            new Event.Info(
                {
                    affix: Events.FONT_SELECTOR_SLOT_ITEM_SELECT,
                    suffixes: [
                        this.ID(),
                        this.Items().ID(),
                        this.Items().Slot().ID(),
                        this.Items().Slot().Slots().ID(),
                        this.Items().Slot().Slots().Selector().ID(),
                        this.Items().Slot().Slots().Selector().Event_Grid_Hook(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {
                        should_update_text: model.Is_In_Fonts_Slot(),
                    } as Events.FONT_SELECTOR_SLOT_ITEM_SELECT_DATA,
                },
            ),
        );
    }

    private async On_Font_Selector_Slot_Item_Select():
        Promise<void>
    {
        this.Model().Select();
    }

    Model():
        Model.Instance
    {
        return this.model();
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
