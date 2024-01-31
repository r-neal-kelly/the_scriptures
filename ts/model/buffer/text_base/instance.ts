import { Float } from "../../../types.js";
import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";
import * as Async from "../../../async.js";

import * as Language from "../../language.js";
import * as Languages from "../../languages.js";
import * as Font from "../../font.js";
import * as Data from "../../data.js";
import * as Text from "../../text.js";

interface Line_Instance_i
{
}

export abstract class Instance<
    Line_Instance extends Line_Instance_i,
> extends Async.Instance
{
    private default_language_name: Language.Name;
    private default_font_name: Font.Name;
    private underlying_font_size_px: Float;

    private text: Text.Instance;
    private lines: Array<Line_Instance>;

    constructor(
        {
            default_language_name,
            default_font_name,
            underlying_font_size_px,

            text,
        }: {
            default_language_name: Language.Name,
            default_font_name: Font.Name,
            underlying_font_size_px: Float,

            text: Text.Instance,
        },
    )
    {
        super();

        this.default_language_name = default_language_name;
        this.default_font_name = default_font_name;
        this.underlying_font_size_px = underlying_font_size_px;

        this.text = text;
        this.lines = [];

        this.Add_Dependencies(
            [
                Data.Singleton(),
            ],
        );
    }

    Default_Language_Name():
        Language.Name
    {
        return this.default_language_name;
    }

    Default_Language_Direction():
        Language.Direction
    {
        return Languages.Singleton().Direction(this.Default_Language_Name());
    }

    Default_Font_Name():
        Font.Name
    {
        return this.default_font_name;
    }

    Underlying_Font_Size_PX():
        Float
    {
        return this.underlying_font_size_px;
    }

    abstract Override_Font_Name(
        language_name: Language.Name,
    ): Font.Name;

    Text():
        Text.Instance
    {
        return this.text;
    }

    Line_Buffer_Count():
        Count
    {
        return Data.Singleton().Info().Average_Line_Count();
    }

    Line_Count():
        Count
    {
        return this.lines.length;
    }

    abstract Blank_Line(
        line_index: Index,
    ):
        Line_Instance;

    Line_At(
        line_index: Index,
    ):
        Line_Instance
    {
        Utils.Assert(
            line_index > -1,
            `line_index (${line_index}) must be greater than -1.`,
        );

        if (line_index < this.Line_Count()) {
            return this.lines[line_index];
        } else {
            return this.Blank_Line(line_index);
        }
    }

    protected Push_Line(
        line: Line_Instance,
    ):
        void
    {
        this.lines.push(line);
    }
}
