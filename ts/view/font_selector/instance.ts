import { ID } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Event from "../../event.js";

import * as Model from "../../model/font_selector/instance.js";

import * as Events from "../events.js";
import * as Entity from "../entity.js";
import * as CSS from "./css.js";
import * as Slots from "./slots.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;
    private event_grid_hook: () => ID;
    private is_visible: () => boolean;

    constructor(
        {
            parent,
            model,
            event_grid_hook,
            is_visible,
        }: {
            parent: Entity.Instance,
            model: () => Model.Instance,
            event_grid_hook: () => ID,
            is_visible: () => boolean,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: parent,
                event_grid: parent.Event_Grid(),
            },
        );

        this.model = model;
        this.event_grid_hook = event_grid_hook;
        this.is_visible = is_visible;

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Add_This_CSS(CSS.This_CSS());
        this.Add_Children_CSS(CSS.Children_CSS());
        this.Add_CSS(CSS.CSS());

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.FONT_SELECTOR_SLOT_ITEM_SELECT,
                        this.ID(),
                    ),
                    event_handler: this.After_Font_Selector_Slot_Item_Select,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Slots()
        ) {
            this.Abort_All_Children();

            new Slots.Instance(
                {
                    selector: this,
                    model: () => this.Model(),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        const classes: Array<string> = [];

        classes.push(`Selector`);
        if (!this.Is_Visible()) {
            classes.push(`Invisible`);
        }

        return classes;
    }

    private async After_Font_Selector_Slot_Item_Select():
        Promise<void>
    {
        this.Refresh();
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Event_Grid_Hook():
        ID
    {
        return this.event_grid_hook();
    }

    Is_Visible():
        boolean
    {
        return this.is_visible();
    }

    Has_Slots():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Slots.Instance
        );
    }

    Slots():
        Slots.Instance
    {
        Utils.Assert(
            this.Has_Slots(),
            `Does not have slots.`,
        );

        return this.Child(0) as Slots.Instance;
    }
}
