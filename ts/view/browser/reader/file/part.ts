import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/reader/file/part.js";

import * as Parts from "./parts.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            parts,
        }: {
            model: () => Model.Instance,
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

        const width: string = model.Index() === 0 && model.Parts().Line().Text().Is_Indented() ?
            `3em` :
            `auto`;

        const border_color: string = is_error ?
            `#ffcbcb` :
            `transparent`;

        const color: string = is_error ?
            `#ffcbcb` :
            `inherit`;
        const font_style: string = model.Text().Has_Italic_Style() ?
            `italic` :
            `normal`;
        const font_weight: string = model.Text().Has_Bold_Style() ?
            `bold` :
            `normal`;
        const font_variant: string = model.Text().Has_Small_Caps_Style() ?
            `small-caps` :
            `normal`;
        const text_decoration: string = model.Text().Has_Underline_Style() ?
            `underline` :
            `none`;

        return `
            display: inline-block;

            width: ${width};

            border-style: solid;
            border-width: 0 0 2px 0;
            border-color: ${border_color};

            color: ${color};
            font-style: ${font_style};
            font-weight: ${font_weight};
            font-variant: ${font_variant};
            text-decoration: ${text_decoration};
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        const model: Model.Instance = this.Model();

        if (model.Text().Is_Command()) {
            this.Element().textContent = ``;
        } else {
            // Doing this in reader causes the dictionary to think some things are
            // errors, because the dictionary doesn't recognize the non-breaking space.
            this.Element().textContent = model.Text().Value().replace(/ /g, ` `);
        }
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Parts():
        Parts.Instance
    {
        return this.Parent() as Parts.Instance;
    }
}
