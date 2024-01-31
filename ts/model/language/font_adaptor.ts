import { Float } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Font from "../font.js";
import * as Fonts from "../fonts.js";
import { Script_Position } from "../script_position.js";

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
    private fallback_fonts: Array<Font.Instance>;
    private font_size_multiplier: Float;
    private line_height_multiplier: Float;
    private styles: { [css_property: string]: string };
    private treater: (text: string) => string;

    constructor(
        {
            font_name,
            short_font_name,
            fallback_font_names,
            font_size_multiplier,
            line_height_multiplier,
            styles,
            treater = Instance.DEFAULT_TREATER,
        }: {
            font_name: Font.Name,
            short_font_name: string,
            fallback_font_names: Array<Font.Name>,
            font_size_multiplier: Float,
            line_height_multiplier: Float,
            styles: { [css_property: string]: string },
            treater?: (text: string) => string,
        },
    )
    {
        Utils.Assert(
            font_size_multiplier > 0,
            `font_size_multiplier must be greater than 0`,
        );
        Utils.Assert(
            line_height_multiplier > 0,
            `line_height_multiplier must be greater than 0`,
        );
        Utils.Assert(
            styles[`font-family`] == null,
            `styles should not have 'font-family', use font_names instead`,
        );
        Utils.Assert(
            styles[`font-size`] == null,
            `styles should not have 'font-size', use font_size_multiplier instead`,
        );
        Utils.Assert(
            styles[`line-height`] == null,
            `styles should not have 'line-height', use line_height_multiplier instead`,
        );

        const fonts: Fonts.Instance = Fonts.Singleton();

        this.font = fonts.Font(font_name);
        this.short_font_name = short_font_name;
        this.fallback_fonts = fallback_font_names.map(font_name => fonts.Font(font_name));
        this.font_size_multiplier = font_size_multiplier;
        this.line_height_multiplier = line_height_multiplier;
        this.styles = Object.assign(Object.create(null), styles);
        this.treater = treater;

        const fallback_font_families: string =
            this.fallback_fonts.map(font => `"${font.Family()}"`).join(`, `);

        this.styles[`font-family`] = fallback_font_families !== `` ?
            `"${this.font.Family()}", ${fallback_font_families}, sans-serif` :
            `"${this.font.Family()}", sans-serif`;
        this.styles[`font-size`] = `${this.font_size_multiplier}em`;
        this.styles[`line-height`] = `${this.line_height_multiplier}em`;
        if (this.styles[`vertical-align`] == null) {
            this.styles[`vertical-align`] = `baseline`;
        }
        if (this.styles[`letter-spacing`] == null) {
            this.styles[`letter-spacing`] = `normal`;
        }
        if (this.styles[`word-spacing`] == null) {
            this.styles[`word-spacing`] = `normal`;
        }

        Object.freeze(this.fallback_fonts);
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

    Fallback_Fonts():
        Array<Font.Instance>
    {
        return Array.from(this.fallback_fonts);
    }

    Styles(
        script_position: Script_Position,
    ):
        { [css_property: string]: string }
    {
        const styles: { [css_property: string]: string } =
            Object.assign(Object.create(null), this.styles);

        if (script_position === Script_Position.SUPER) {
            styles[`font-size`] =
                `${this.font_size_multiplier * Font.Consts.SUPERSCRIPT_FONT_SIZE_MULTIPLIER}em`;
            styles[`line-height`] =
                `${this.line_height_multiplier * Font.Consts.SUPERSCRIPT_LINE_HEIGHT_MULTIPLIER}em`;
            styles[`vertical-align`] =
                `super`;
        } else if (script_position === Script_Position.SUB) {
            styles[`font-size`] =
                `${this.font_size_multiplier * Font.Consts.SUBSCRIPT_FONT_SIZE_MULTIPLIER}em`;
            styles[`line-height`] =
                `${this.line_height_multiplier * Font.Consts.SUBSCRIPT_LINE_HEIGHT_MULTIPLIER}em`;
            styles[`vertical-align`] =
                `sub`;
        }

        return styles;
    }

    Treat_Text(
        text: string,
    ):
        string
    {
        return this.treater(text);
    }
}
