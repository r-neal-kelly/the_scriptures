import { Index } from "../../../types.js";

import * as Language from "../../language.js";
import * as Font from "../../font.js";
import * as Text from "../../text.js";

import * as Text_Base from "../text_base.js";
import * as Line from "./line.js";

export class Instance extends Text_Base.Instance<
    Line.Instance
>
{
    private override_font_name: (language_name: Language.Name) => Font.Name;

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

                text: text,
            },
        );

        this.override_font_name = override_font_name;

        if (allow_errors) {
            this.Text().Set_Path_Type(Text.Path.Type.DEFAULT);
        } else {
            this.Text().Set_Path_Type(Text.Path.Type.ERRORLESS);
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

    Blank_Line(
        line_index: Index,
    ):
        Line.Instance
    {
        return new Line.Instance(
            {
                buffer: this,
                index: line_index,
                text: null,
            },
        );
    }

    Allows_Errors():
        boolean
    {
        return this.Text().Path_Type() === Text.Path.Type.DEFAULT;
    }
}
