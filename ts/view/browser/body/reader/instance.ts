import * as Utils from "../../../../utils.js";
import * as Event from "../../../../event.js";

import * as Model from "../../../../model/browser/body/reader/instance.js";

import * as Entity from "../../../entity.js";
import * as Body from "../instance.js";
import * as File from "./file.js";

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
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        `Selector_Slot_Item_Select`,
                        this.Body().Browser().ID(),
                    ),
                    event_handler: this.After_Selector_Slot_Item_Select,
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

            new File.Instance(
                {
                    model: () => this.Model().File(),
                    reader: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Reader`];
    }

    async After_Selector_Slot_Item_Select():
        Promise<void>
    {
        this.Element().scrollTo(0, 0);
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
            this.Child(0) instanceof File.Instance
        );
    }

    File():
        File.Instance
    {
        Utils.Assert(
            this.Has_File(),
            `Doesn't have file.`,
        );

        return this.Child(0) as File.Instance;
    }
}
