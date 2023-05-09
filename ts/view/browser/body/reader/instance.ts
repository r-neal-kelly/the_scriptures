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
                    event_handler: () => this.Element().scrollTo(0, 0),
                    event_priority: 10,
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
                    event_grid_id: () => this.Body().Browser().ID(),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Reader`];
    }

    override On_Restyle():
        string | { [index: string]: string }
    {
        return `
            font-family: ${this.Model().Font_Name()};
        `;
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
