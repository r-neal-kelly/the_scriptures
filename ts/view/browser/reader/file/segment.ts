import * as Utils from "../../../../utils.js";

import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/reader/file/segment.js";

import * as Segments from "./segments.js";
import * as Parts from "./parts.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            segments,
        }: {
            model: () => Model.Instance,
            segments: Segments.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: segments,
                event_grid: segments.Event_Grid(),
            },
        );

        this.model = model;
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        if (!this.Has_Parts()) {
            this.Abort_All_Children();

            new Parts.Instance(
                {
                    model: () => this.Model().Parts(),
                    segment: this,
                },
            );
        }
    }

    override On_Restyle():
        string
    {
        const model: Model.Instance = this.Model();
        const is_blank: boolean = model.Is_Blank();

        const display: string = is_blank ?
            `none` :
            `inline-block`;

        const color: string = is_blank ?
            `transparent` :
            `inherit`;

        return `
            display: ${display};

            color: ${color};
        `;
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Segments():
        Segments.Instance
    {
        return this.Parent() as Segments.Instance;
    }

    Has_Parts():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Parts.Instance
        );
    }

    Parts():
        Parts.Instance
    {
        Utils.Assert(
            this.Has_Parts(),
            `Doesn't have parts.`,
        );

        return this.Child(0) as Parts.Instance;
    }
}
