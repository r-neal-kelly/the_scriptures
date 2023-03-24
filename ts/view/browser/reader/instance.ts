import * as Utils from "../../../utils.js";
import * as Entity from "../../../entity.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/browser/reader/instance.js";

import * as Browser from "../instance.js";
import * as File from "./file.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;
    private file: File.Instance | null;

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
        this.file = null;
    }

    override async On_Life():
        Promise<Array<Event.Listener_Info>>
    {
        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.ON, "Reader_Has_File"),
                    event_handler: this.On_Reader_Has_File.bind(this),
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

        this.Abort_All_Children();

        if (this.model.Has_File()) {
            this.file = new File.Instance(
                {
                    model: model.File(),
                    reader: this,
                },
            );
        } else {
            this.file = null;
        }
    }

    async On_Reader_Has_File():
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
        return this.file != null;
    }

    File():
        File.Instance
    {
        Utils.Assert(
            this.Has_File(),
            `Has no file.`,
        );

        return this.file as File.Instance;
    }
}
