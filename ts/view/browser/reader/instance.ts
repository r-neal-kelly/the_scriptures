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

    override async On_Life():
        Promise<Array<Event.Listener_Info>>
    {
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

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return `
            width: 100%;
            
            overflow-x: auto;
            overflow-y: auto;
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        const model: Model.Instance = this.Model();

        if (this.model.Has_File()) {
            if (!this.Has_File()) {
                new File.Instance(
                    {
                        model: () => this.Model().File(),
                        reader: this,
                    },
                );
            }
        } else {
            if (this.Has_File()) {
                this.Abort_Child(this.File());
            }
        }
    }

    override async After_Refresh():
        Promise<void>
    {
        this.Element().scrollTo(0, 0);
    }

    async After_Selector_Slot_Item_Select():
        Promise<void>
    {
        await this.Refresh();
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
