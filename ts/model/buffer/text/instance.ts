import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
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

    private default_language_name: Languages.Name;
    private text: Text.Instance;
    private lines: Array<Line.Instance>;
    private line_path_type: Text.Line.Path_Type;

    constructor(
        {
            default_language_name,
            text,
        }: {
            default_language_name: Languages.Name,
            text: Text.Instance,
        },
    )
    {
        super();

        this.default_language_name = default_language_name;
        this.text = text;
        this.lines = [];
        this.line_path_type = Text.Line.Path_Type.ERRORLESS;

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
        Languages.Name
    {
        return this.default_language_name;
    }

    Default_Text_Direction():
        Languages.Direction
    {
        return Languages.Default_Direction(this.default_language_name);
    }

    Default_Text_Styles():
        any
    {
        return Languages.Current_Global_CSS_Styles(this.default_language_name);
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
}
