import * as Utils from "../../../../utils.js";

import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/reader/file/line.js";

import * as Lines from "./lines.js";
import * as Segments from "./segments.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            lines,
        }: {
            model: () => Model.Instance,
            lines: Lines.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: lines,
                event_grid: lines.Event_Grid(),
            },
        );

        this.model = model;
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        if (!this.Has_Segments()) {
            this.Abort_All_Children();

            new Segments.Instance(
                {
                    model: () => this.Model().Segments(),
                    line: this,
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
            model.Text().Is_Centered() ?
                `flex` :
                `block`;

        const color: string = is_blank || model.Text().Value() === `` ?
            `transparent` :
            `inherit`;

        return `
            display: ${display};
            flex-wrap: wrap;
            justify-content: center;

            color: ${color};
        `;
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Lines():
        Lines.Instance
    {
        return this.Parent() as Lines.Instance;
    }

    Has_Segments():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Segments.Instance
        );
    }

    Segments():
        Segments.Instance
    {
        Utils.Assert(
            this.Has_Segments(),
            `Doesn't have segments.`,
        );

        return this.Child(0) as Segments.Instance;
    }
}
