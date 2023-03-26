import * as Utils from "../../../../utils.js";

import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/reader/file/line.js";

import * as Lines from "./lines.js";
import * as Parts from "./parts.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;

    constructor(
        {
            model,
            lines,
        }: {
            model: Model.Instance,
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

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        const model: Model.Instance = this.Model();
        const color: string = model.Text().Value() === `` ?
            `transparent` :
            `inherit`;

        return `
            display: block;
            ${model.Text().Is_Centered() ? `display: flex;` : ``}
            flex-wrap: wrap;
            justify-content: center;

            color: ${color};
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        const model: Model.Instance = this.Model();

        if (model.Text().Value() === ``) {
            this.Element().textContent = `_`;
        } else {
            if (!this.Has_Parts()) {
                this.Abort_All_Children();

                new Parts.Instance(
                    {
                        model: model.Parts(),
                        line: this,
                    },
                );
            }
        }
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Lines():
        Lines.Instance
    {
        return this.Parent() as Lines.Instance;
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
