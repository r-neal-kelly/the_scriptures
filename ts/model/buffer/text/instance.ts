import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Font from "../../font.js";
import * as Language from "../../language.js";
import * as Languages from "../../languages.js";
import * as Text from "../../text.js";
import * as Line from "./line.js";

export class Instance extends Entity.Instance
{
    private static min_line_count: Count = 50;

    private static blank_line: Line.Instance = new Line.Instance(
        {
            buffer: null,
            index: null,
            text: null,
        },
    );

    static Min_Line_Count():
        Count
    {
        return Instance.min_line_count;
    }

    static Set_Min_Line_Count(
        min_line_count: Count,
    ):
        void
    {
        Utils.Assert(
            min_line_count >= 0,
            `min_line_count must be greater than or equal to 0.`,
        );

        Instance.min_line_count = min_line_count;
    }

    private default_language_name: Language.Name;
    private default_font_name: Font.Name;
    private language_font_name: (language_name: Language.Name) => Font.Name;
    private text: Text.Instance;
    private lines: Array<Line.Instance>;
    private line_path_type: Text.Line.Path_Type;

    constructor(
        {
            default_language_name,
            default_font_name,
            language_font_name,
            text,
            allow_errors,
        }: {
            default_language_name: Language.Name,
            default_font_name: Font.Name,
            language_font_name: (language_name: Language.Name) => Font.Name,
            text: Text.Instance,
            allow_errors: boolean,
        },
    )
    {
        super();

        this.default_language_name = default_language_name;
        this.default_font_name = default_font_name;
        this.language_font_name = language_font_name;
        this.text = text;
        this.lines = [];
        if (allow_errors) {
            this.line_path_type = Text.Line.Path_Type.DEFAULT;
        } else {
            this.line_path_type = Text.Line.Path_Type.ERRORLESS;
        }

        for (let idx = 0, end = text.Line_Count(); idx < end; idx += 1) {
            this.lines.push(
                new Line.Instance(
                    {
                        buffer: this,
                        index: idx,
                        text: text.Line(idx),
                    },
                ),
            );
        }

        this.Add_Dependencies(
            this.lines,
        );
    }

    Default_Language_Name():
        Language.Name
    {
        return this.default_language_name;
    }

    Default_Font_Name():
        Font.Name
    {
        return this.default_font_name;
    }

    Language_Font_Name(
        language_name: Language.Name,
    ):
        Font.Name
    {
        return this.language_font_name(language_name);
    }

    Default_Text_Direction():
        Language.Direction
    {
        return Languages.Singleton().Direction(this.default_language_name);
    }

    Default_Font_Styles():
        { [css_property: string]: string }
    {
        return Languages.Singleton().Font_Styles(
            this.Default_Language_Name(),
            this.Default_Font_Name(),
        );
    }

    Override_Font_Styles(
        language_name: Language.Name,
    ):
        { [css_property: string]: string }
    {
        return Languages.Singleton().Font_Styles(
            language_name,
            this.Language_Font_Name(language_name),
        );
    }

    Text():
        Text.Instance
    {
        return this.text;
    }

    Line_Count():
        Count
    {
        return this.lines.length;
    }

    Line_At(
        line_index: Index,
    ):
        Line.Instance
    {
        Utils.Assert(
            line_index > -1,
            `line_index (${line_index}) must be greater than -1.`,
        );

        if (line_index < this.Line_Count()) {
            return this.lines[line_index];
        } else {
            return Instance.blank_line;
        }
    }

    Line_Path_Type():
        Text.Line.Path_Type
    {
        return this.line_path_type;
    }

    Allows_Errors():
        boolean
    {
        return this.Line_Path_Type() === Text.Line.Path_Type.DEFAULT;
    }

    Indent_EM():
        Count
    {
        return 3;
    }

    Pad_EM(
        pad_count: Count,
    ):
        Count
    {
        if (pad_count > 0) {
            return this.Indent_EM() * pad_count;
        } else {
            return 0;
        }
    }
}
