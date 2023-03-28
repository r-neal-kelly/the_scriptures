import * as Utils from "../../../../utils.js";
import * as Event from "../../../../event.js";
import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/reader/file.js";

import * as Reader from "../instance.js";
import * as Lines from "./lines.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            reader,
        }: {
            model: () => Model.Instance,
            reader: Reader.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: reader,
                event_grid: reader.Event_Grid()
            },
        );

        this.model = model;
    }

    override On_Refresh():
        void
    {
        if (!this.Has_Lines()) {
            this.Abort_All_Children();

            new Lines.Instance(
                {
                    model: () => this.Model().Lines(),
                    file: this,
                },
            );
        }
    }

    override On_Restyle():
        string
    {
        return `
            width: 100%;
            padding: 0 4px;
        `;
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Has_Lines():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Lines.Instance
        );
    }

    Lines():
        Lines.Instance
    {
        Utils.Assert(
            this.Has_Lines(),
            `Doesn't have lines.`,
        );

        return this.Child(0) as Lines.Instance;
    }
}
