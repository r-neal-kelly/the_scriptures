import * as Utils from "../../../../utils.js";
import * as Event from "../../../../event.js";

import * as Model from "../../../../model/browser/body/reader/instance.js";

import * as Events from "../../../events.js";
import * as Entity from "../../../entity.js";
import * as Buffer from "../../../buffer.js";
import * as Body from "../instance.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            body,
        }: {
            model: () => Model.Instance,
            body: Body.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: body,
                event_grid: body.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.SELECTOR_SLOT_ITEM_SELECT,
                        this.Body().Browser().ID(),
                    ),
                    event_handler: this.After_Selector_Slot_Item_Select,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.FONT_SELECTOR_SLOT_ITEM_SELECT,
                        this.Body().Browser().ID(),
                    ),
                    event_handler: this.After_Font_Selector_Slot_Item_Select,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.BROWSER_COMMANDER_PREVIOUS,
                        this.Body().Browser().ID(),
                    ),
                    event_handler: () => this.Element().scrollTo(0, 0),
                    event_priority: 10,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.BROWSER_COMMANDER_NEXT,
                        this.Body().Browser().ID(),
                    ),
                    event_handler: () => this.Element().scrollTo(0, 0),
                    event_priority: 10,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        if (!this.Has_File()) {
            this.Abort_All_Children();

            new Buffer.Text.Instance(
                {
                    parent: this,
                    model: () => this.Model().File(),
                    event_grid_hook: () => this.Body().Browser().ID(),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Reader`];
    }

    private async After_Selector_Slot_Item_Select():
        Promise<void>
    {
        this.Refresh();
        this.Element().scrollTo(0, 0);

        await this.Send(
            new Event.Info(
                {
                    affix: Events.WINDOW_REFRESH_TITLE,
                    suffixes: [
                        this.Body().ID(),
                        this.Body().Browser().ID(),
                        this.Body().Browser().Event_Grid_Hook(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );
    }

    private async After_Font_Selector_Slot_Item_Select(
        {
            should_update_text,
        }: Events.FONT_SELECTOR_SLOT_ITEM_SELECT_DATA,
    ):
        Promise<void>
    {
        if (should_update_text) {
            this.Refresh();
        }
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Body():
        Body.Instance
    {
        return this.Parent() as Body.Instance;
    }

    Has_File():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Buffer.Text.Instance
        );
    }

    File():
        Buffer.Text.Instance
    {
        Utils.Assert(
            this.Has_File(),
            `Doesn't have file.`,
        );

        return this.Child(0) as Buffer.Text.Instance;
    }
}
