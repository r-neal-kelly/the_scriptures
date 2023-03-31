import * as Utils from "../../../utils.js";
import * as Entity from "../../../entity.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/browser/reader/instance.js";

import * as Browser from "../instance.js";
import * as File from "./file.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;

    constructor(
        {
            model,
            browser,
        }: {
            model: Model.Instance,
            browser: Browser.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: browser,
                event_grid: browser.Event_Grid(),
            },
        );

        this.model = model;
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Add_This_CSS(
            `
                .Reader {
                    width: 100%;
            
                    overflow-x: auto;
                    overflow-y: auto;
                }
            `,
        );

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.AFTER, "Selector_Slot_Item_Select"),
                    event_handler: this.After_Selector_Slot_Item_Select.bind(this),
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        if (!this.Has_File()) {
            new File.Instance(
                {
                    model: () => this.Model().File(),
                    reader: this,
                },
            );
        }

        this.Element().scrollTo(0, 0);
    }

    override On_Reclass():
        Array<string>
    {
        return [`Reader`];
    }

    async After_Selector_Slot_Item_Select():
        Promise<void>
    {
        this.Refresh();
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Browser():
        Browser.Instance
    {
        return this.Parent() as Browser.Instance;
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
