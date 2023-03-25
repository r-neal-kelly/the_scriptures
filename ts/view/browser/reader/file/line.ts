import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/reader/file/line.js";

import * as Lines from "./lines.js";

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
        const color: string = model.Text() === `` ?
            `transparent` :
            `inherit`;

        return `
            color: ${color};
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        const model: Model.Instance = this.Model();
        const text: string = model.Text();

        // I would like to avoid altering the text here,
        // probably need to figure out what can be done
        // with styling instead.
        if (text === ``) {
            this.Element().textContent = `_`;
        } else {
            this.Element().textContent = text;
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
}
