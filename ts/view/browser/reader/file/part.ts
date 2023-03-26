import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/reader/file/part.js";

import * as Parts from "./parts.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;

    constructor(
        {
            model,
            parts,
        }: {
            model: Model.Instance,
            parts: Parts.Instance,
        },
    )
    {
        super(
            {
                element: `span`,
                parent: parts,
                event_grid: parts.Event_Grid(),
            },
        );

        this.model = model;
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        const model: Model.Instance = this.Model();
        const is_error: boolean =
            model.Text().Is_Error() ||
            model.Text().Has_Error_Style();

        return `
            display: inline-block;

            border-color: transparent;
            border-style: solid;
            border-width: 0 0 2px 0;
            ${is_error ? `border-color: #ffcbcb;` : ``}

            ${model.Index() === 0 && model.Parts().Line().Text().Is_Indented() ? `width: 3em;` : ``}

            ${model.Text().Has_Italic_Style() ? `font-style: italic;` : ``}
            ${model.Text().Has_Bold_Style() ? `font-weight: bold;` : ``}
            ${model.Text().Has_Underline_Style() ? `text-decoration: underline;` : ``}
            ${model.Text().Has_Small_Caps_Style() ? `font-variant: small-caps;` : ``}
            ${is_error ? `color: #ffcbcb;` : ``}
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        // I would like to avoid altering the text here,
        // probably need to figure out what can be done
        // with styling instead.

        const model: Model.Instance = this.Model();
        //const text: string = model.Text().Value().replaceAll(/  /g, `  `);

        if (model.Text().Is_Command()) {
            this.Element().textContent = ``;
        } else {
            this.Element().textContent = model.Text().Value().replace(/ /g, ` `);
        }
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Parts():
        Parts.Instance
    {
        return this.Parent() as Parts.Instance;
    }
}
