import * as Font from "../../font.js";
import * as Language from "../../language.js";
import * as Languages from "../../languages.js";
import * as Text from "../../text.js";
import * as Text_Base from "../text_base.js";
import * as Line from "./line.js";
import * as Column from "./column.js";
import * as Row from "./row.js";
import * as Segment from "./segment.js";
import * as Item from "./item.js";

export class Instance extends Text_Base.Instance<
    Line.Instance,
    Column.Instance,
    Row.Instance,
    Segment.Instance,
    Item.Instance
>
{
    private default_font_name: Font.Name;
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
                min_line_count: 50,
                min_column_count: 1,
                min_row_count: 1,
                min_segment_count: 70,
                min_item_count: 2,

                default_language_name,
            },
        );

        this.default_font_name = default_font_name;
        this.override_font_name = override_font_name;

        this.text = text;

        this.Set_Blanks(
            {
                blank_line: new Line.Instance(
                    {
                        buffer: this,
                        index: null,
                        text: null,
                    },
                ),
                blank_column: new Column.Instance(
                    {
                        buffer: this,
                        line: null,
                        index: null,
                        text: null,
                    },
                ),
                blank_row: new Row.Instance(
                    {
                        buffer: this,
                        column: null,
                        index: null,
                        text: null,
                    },
                ),
                blank_segment: new Segment.Instance(
                    {
                        buffer: this,
                        row: null,
                        index: null,
                        text: null,
                    },
                ),
                blank_item: new Item.Instance(
                    {
                        buffer: this,
                        segment: null,
                        index: null,
                        text: null,
                    },
                ),
            },
        );

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

    override Default_Font_Name():
        Font.Name
    {
        return this.default_font_name;
    }

    override Default_Font_Styles():
        { [css_property: string]: string }
    {
        return Languages.Singleton().Font_Styles(
            this.Default_Language_Name(),
            this.Default_Font_Name(),
        );
    }

    Override_Font_Name(
        language_name: Language.Name,
    ):
        Font.Name
    {
        return this.override_font_name(language_name);
    }

    Override_Font_Styles(
        language_name: Language.Name,
    ):
        { [css_property: string]: string }
    {
        return Languages.Singleton().Font_Styles(
            language_name,
            this.Override_Font_Name(language_name),
        );
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
