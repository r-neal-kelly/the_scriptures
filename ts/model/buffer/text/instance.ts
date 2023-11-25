import * as Language from "../../language.js";
import * as Font from "../../font.js";
import * as Text from "../../text.js";

import * as Text_Base from "../text_base.js";
import * as Line from "./line.js";

export class Instance extends Text_Base.Instance<
    Line.Instance
>
{
    private static blank_line: Line.Instance = new Line.Instance(
        {
            buffer: null,
            index: null,
            text: null,
        },
    );

    private override_font_name: (language_name: Language.Name) => Font.Name;

    private text: Text.Instance;

    constructor(
        {
            default_language_name,
            default_font_name,
            override_font_name,

            text,
            allow_errors,
        }: {
            default_language_name: Language.Name,
            default_font_name: Font.Name,
            override_font_name: (language_name: Language.Name) => Font.Name,

            text: Text.Instance,
            allow_errors: boolean,
        },
    )
    {
        super(
            {
                default_language_name: default_language_name,
                default_font_name: default_font_name,
            },
        );

        this.override_font_name = override_font_name;

        this.text = text;

        if (allow_errors) {
            this.text.Set_Path_Type(Text.Path.Type.DEFAULT);
        } else {
            this.text.Set_Path_Type(Text.Path.Type.ERRORLESS);
        }

        for (let idx = 0, end = text.Line_Count(); idx < end; idx += 1) {
            this.Push_Line(
                new Line.Instance(
                    {
                        buffer: this,
                        index: idx,
                        text: text.Line(idx),
                    },
                ),
            );
        }
    }

    Override_Font_Name(
        language_name: Language.Name,
    ):
        Font.Name
    {
        return this.override_font_name(language_name);
    }

    Blank_Line():
        Line.Instance
    {
        return Instance.blank_line;
    }

    Text():
        Text.Instance
    {
        return this.text;
    }

    Allows_Errors():
        boolean
    {
        return this.Text().Path_Type() === Text.Path.Type.DEFAULT;
    }
}
