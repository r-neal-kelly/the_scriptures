import * as Utils from "../../../../utils.js";
import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/body/reader/instance.js";

import * as Body from "../instance.js";
import * as File from "./file.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;

    constructor(
        {
            model,
            body,
        }: {
            model: Model.Instance,
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

        this.Element().scrollTo(0, 0);
    }

    override On_Reclass():
        Array<string>
    {
        return [`Reader`];
    }

    Model():
        Model.Instance
    {
        return this.model;
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
