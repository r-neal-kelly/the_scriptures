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
                        Events.SELECTOR_SLOT_ITEM_HIGHLIGHT,
                        this.ID(),
                    ),
                    event_handler: this.On_Selector_Slot_Item_Highlight,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.SELECTOR_SLOT_ITEM_UNHIGHLIGHT,
                        this.ID(),
                    ),
                    event_handler: this.On_Selector_Slot_Item_Unhighlight,
                    event_priority: 0,
                },
            ),
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

    override On_Restyle():
        string | { [index: string]: string; }
    {
        return ``;
    }

    private async On_Click(
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
                        this.Items().ID(),
                        this.Items().Slot().ID(),
                        this.Items().Slot().Slots().ID(),
                        this.Items().Slot().Slots().Selector().ID(),
                        this.Items().Slot().Slots().Selector().Event_Grid_Hook(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );
    }

    private async On_Selector_Slot_Item_Highlight():
        Promise<void>
    {
        await this.Animate(
            [
                {
                    offset: 0.00,
                    backgroundColor: `black`,
                    color: `white`,
                },
                {
                    offset: 1.00,
                    backgroundColor: `white`,
                    color: `black`,
                },
            ],
            {
                duration: 200,
                easing: `ease`,
                fill: `both`,
            },
        );
    }

    private async On_Selector_Slot_Item_Unhighlight():
        Promise<void>
    {
        await this.Animate(
            [
                {
                    offset: 0.00,
                    backgroundColor: `white`,
                    color: `black`,
                },
                {
                    offset: 1.00,
                    backgroundColor: `black`,
                    color: `white`,
                },
            ],
            {
                duration: 200,
                easing: `ease`,
                fill: `both`,
            },
        );
    }

    private async On_Selector_Slot_Item_Select():
        Promise<void>
    {
        const model: Model.Instance = this.Model();
        const animation_events: Array<Promise<void>> = [];

        if (model.Slot().Has_Selected_Item()) {
            const selected_item_id: ID =
                this.Parent().Child(model.Slot().Selected_Item_Index()).ID();

            animation_events.push(
                this.Send(
                    new Event.Info(
                        {
                            affix: Events.SELECTOR_SLOT_ITEM_UNHIGHLIGHT,
                            suffixes: [
                                selected_item_id,
                            ],
                            type: Event.Type.EXCLUSIVE,
                            data: {},
                        },
                    ),
                ),
            );
        }

        animation_events.push(
            this.Send(
                new Event.Info(
                    {
                        affix: Events.SELECTOR_SLOT_ITEM_HIGHLIGHT,
                        suffixes: [
                            this.ID(),
                        ],
                        type: Event.Type.EXCLUSIVE,
                        data: {},
                    },
                ),
            ),
        );

        await Promise.all(animation_events);

        this.Model().Select();
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Items():
        Items.Instance
    {
        return this.Parent() as Items.Instance;
    }

    Is_Visible():
        boolean
    {
        return this.Items().Is_Visible();
    }
}
