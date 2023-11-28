import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Language from "../../language.js";
import * as Languages from "../../languages.js";
import * as Font from "../../font.js";

import { Default_Min_Counts } from "./default_min_counts.js";

interface Line_Instance_i
{
}

export abstract class Instance<
    Line_Instance extends Line_Instance_i,
> extends Entity.Instance
{
    private default_language_name: Language.Name;
    private default_font_name: Font.Name;

    private lines: Array<Line_Instance>;

    constructor(
        {
            default_language_name,
            default_font_name,
        }: {
            default_language_name: Language.Name,
            default_font_name: Font.Name,
        },
    )
    {
        super();

        this.default_language_name = default_language_name;
        this.default_font_name = default_font_name;

        this.lines = [];
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

    abstract Override_Font_Name(
        language_name: Language.Name,
    ): Font.Name;

    Min_Line_Count():
        Count
    {
        return Default_Min_Counts.LINE;
    }

    Line_Count():
        Count
    {
        return this.lines.length;
    }

    abstract Blank_Line():
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
            return this.Blank_Line();
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