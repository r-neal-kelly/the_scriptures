import * as Utils from "../../utils.js";

import * as Font from "../font.js";
import * as Fonts from "../fonts.js";

export class Instance
{
    private font: Font.Instance;
    private styles: { [css_property: string]: string };
    private treater: (text: string) => string;

    constructor(
        {
            font_name,
            styles,
            treater
        }: {
            font_name: Font.Name,
            styles: { [css_property: string]: string },
            treater: (text: string) => string,
        },
    )
    {
        Utils.Assert(
            !Object.isFrozen(styles),
            `can't add font-family to styles when its frozen`,
        );

        this.font = Fonts.Singleton().Font(font_name);
        this.styles = styles;
        this.treater = treater;

        this.styles[`font-family`] = `"${this.font.Family()}"`;

        Object.freeze(this.styles);
    }

    Font():
        Font.Instance
    {
        return this.font;
    }

    Styles():
        { [css_property: string]: string }
    {
        return this.styles;
    }

    Treat_Text(
        text: string,
    ):
        string
    {
        return this.treater(text);
    }
}
