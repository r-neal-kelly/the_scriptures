import { Index } from "../../../types.js";

import * as Language from "../../language.js";
import * as Languages from "../../languages.js";
import * as Font from "../../font.js";
import * as Search from "../../search.js";

import * as Text_Base from "../text_base.js";
import * as Line from "./line.js";

export class Instance extends Text_Base.Instance<
    Line.Instance
>
{
    private is_showing_commands: boolean;

    constructor(
        {
            default_language_name,

            results,
            is_showing_commands,
        }: {
            default_language_name: Language.Name,

            results: Array<Search.Result.Instance>,
            is_showing_commands: boolean,
        },
    )
    {
        super(
            {
                default_language_name:
                    default_language_name,
                default_font_name:
                    Languages.Singleton().Default_Global_Font_Name(default_language_name),
            },
        );

        this.is_showing_commands = is_showing_commands;

        for (let idx = 0, end = results.length; idx < end; idx += 1) {
            this.Push_Line(
                new Line.Instance(
                    {
                        buffer: this,
                        index: idx,
                        result: results[idx],
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
        return Languages.Singleton().Default_Global_Font_Name(language_name);
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
                result: null,
            },
        );
    }

    Is_Showing_Commands():
        boolean
    {
        return this.is_showing_commands;
    }

    Toggle_Showing_Commands():
        void
    {
        this.is_showing_commands = !this.is_showing_commands;
    }
}
