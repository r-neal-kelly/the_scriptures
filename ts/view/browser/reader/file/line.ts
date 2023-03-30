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

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Line`);
        if (model.Is_Blank()) {
            classes.push(`Blank_Line`);
        } else if (model.Text().Value() === ``) {
            classes.push(`New_Line`);
        } else if (model.Text().Is_Centered()) {
            classes.push(`Centered_Line`);
        }

        return classes;
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
