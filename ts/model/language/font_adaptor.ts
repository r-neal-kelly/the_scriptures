import * as Utils from "../../utils.js";

import * as Font from "../font.js";
import * as Fonts from "../fonts.js";

export class Instance
{
    private static DEFAULT_TREATER: (text: string) => string = function (
        text: string,
    ):
        string
    {
        return text;
    }

    private font: Font.Instance;
    private short_font_name: string;
    private styles: { [css_property: string]: string };
    private treater: (text: string) => string;

    constructor(
        {
            font_name,
            short_font_name,
            styles,
            treater = Instance.DEFAULT_TREATER,
        }: {
            font_name: Font.Name,
            short_font_name: string,
            styles: { [css_property: string]: string },
            treater?: (text: string) => string,
        },
    )
    {
        Utils.Assert(
            !Object.isFrozen(styles),
            `can't add font-family to styles when its frozen`,
        );

        this.font = Fonts.Singleton().Font(font_name);
        this.short_font_name = short_font_name;
        this.styles = styles;
        this.treater = treater;

        this.styles[`font-family`] = `"${this.font.Family()}"`;
        if (!this.styles.hasOwnProperty(`font-size`)) {
            this.styles[`font-size`] = `1em`;
        }
        if (!this.styles.hasOwnProperty(`line-height`)) {
            this.styles[`line-height`] = `1`;
        }
        if (!this.styles.hasOwnProperty(`letter-spacing`)) {
            this.styles[`letter-spacing`] = `normal`;
        }
        if (!this.styles.hasOwnProperty(`word-spacing`)) {
            this.styles[`word-spacing`] = `normal`;
        }

        Object.freeze(this.styles);
    }

    Font():
        Font.Instance
    {
        return this.font;
    }

    Short_Font_Name():
        string
    {
        return this.short_font_name;
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
