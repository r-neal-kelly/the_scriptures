import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Font from "../../font.js";
import * as Language from "../../language.js";
import * as Languages from "../../languages.js";

export abstract class Instance<
    Line_Instance,
    Column_Instance,
    Row_Instance,
    Segment_Instance,
    Item_Instance,
> extends Entity.Instance
{
    private min_line_count: Count;
    private min_column_count: Count;
    private min_row_count: Count;
    private min_segment_count: Count;
    private min_item_count: Count;

    private blank_line: Line_Instance | null;
    private blank_column: Column_Instance | null;
    private blank_row: Row_Instance | null;
    private blank_segment: Segment_Instance | null;
    private blank_item: Item_Instance | null;

    private default_language_name: Language.Name;

    private lines: Array<Line_Instance>;

    constructor(
        {
            min_line_count,
            min_column_count,
            min_row_count,
            min_segment_count,
            min_item_count,

            default_language_name,
        }: {
            min_line_count: Count,
            min_column_count: Count,
            min_row_count: Count,
            min_segment_count: Count,
            min_item_count: Count,

            default_language_name: Language.Name,
        },
    )
    {
        super();

        this.min_line_count = min_line_count;
        this.min_column_count = min_column_count;
        this.min_row_count = min_row_count;
        this.min_segment_count = min_segment_count;
        this.min_item_count = min_item_count;

        this.blank_line = null;
        this.blank_column = null;
        this.blank_row = null;
        this.blank_segment = null;
        this.blank_item = null;

        this.default_language_name = default_language_name;

        this.lines = [];
    }

    Min_Line_Count():
        Count
    {
        return this.min_line_count;
    }

    Set_Min_Line_Count(
        min_line_count: Count,
    ):
        void
    {
        Utils.Assert(
            min_line_count >= 0,
            `min_line_count must be greater than or equal to 0.`,
        );

        this.min_line_count = min_line_count;
    }

    Min_Column_Count():
        Count
    {
        return this.min_column_count;
    }

    Set_Min_Column_Count(
        min_column_count: Count,
    ):
        void
    {
        Utils.Assert(
            min_column_count >= 0,
            `min_column_count must be greater than or equal to 0.`,
        );

        this.min_column_count = min_column_count;
    }

    Min_Row_Count():
        Count
    {
        return this.min_row_count;
    }

    Set_Min_Row_Count(
        min_row_count: Count,
    ):
        void
    {
        Utils.Assert(
            min_row_count >= 0,
            `min_row_count must be greater than or equal to 0.`,
        );

        this.min_row_count = min_row_count;
    }

    Min_Segment_Count():
        Count
    {
        return this.min_segment_count;
    }

    Set_Min_Segment_Count(
        min_segment_count: Count,
    ):
        void
    {
        Utils.Assert(
            min_segment_count >= 0,
            `min_segment_count must be greater than or equal to 0.`,
        );

        this.min_segment_count = min_segment_count;
    }

    Min_Item_Count():
        Count
    {
        return this.min_item_count;
    }

    Set_Min_Item_Count(
        min_item_count: Count,
    ):
        void
    {
        Utils.Assert(
            min_item_count >= 0,
            `min_item_count must be greater than or equal to 0.`,
        );

        this.min_item_count = min_item_count;
    }

    protected Set_Blanks(
        {
            blank_line,
            blank_column,
            blank_row,
            blank_segment,
            blank_item,
        }: {
            blank_line: Line_Instance,
            blank_column: Column_Instance,
            blank_row: Row_Instance,
            blank_segment: Segment_Instance,
            blank_item: Item_Instance,
        },
    ):
        void
    {
        this.blank_line = blank_line;
        this.blank_column = blank_column;
        this.blank_row = blank_row;
        this.blank_segment = blank_segment;
        this.blank_item = blank_item;
    }

    Blank_Line():
        Line_Instance
    {
        Utils.Assert(
            this.blank_line != null,
            `blank_line was never set`,
        );

        return this.blank_line as Line_Instance;
    }

    Blank_Column():
        Column_Instance
    {
        Utils.Assert(
            this.blank_column != null,
            `blank_column was never set`,
        );

        return this.blank_column as Column_Instance;
    }

    Blank_Row():
        Row_Instance
    {
        Utils.Assert(
            this.blank_row != null,
            `blank_row was never set`,
        );

        return this.blank_row as Row_Instance;
    }

    Blank_Segment():
        Segment_Instance
    {
        Utils.Assert(
            this.blank_segment != null,
            `blank_segment was never set`,
        );

        return this.blank_segment as Segment_Instance;
    }

    Blank_Item():
        Item_Instance
    {
        Utils.Assert(
            this.blank_item != null,
            `blank_item was never set`,
        );

        return this.blank_item as Item_Instance;
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
        return Languages.Singleton().Default_Global_Font_Name(this.Default_Language_Name());
    }

    Default_Font_Styles():
        any
    {
        return Languages.Singleton().Default_Global_Font_Styles(this.Default_Language_Name());
    }

    Line_Count():
        Count
    {
        return this.lines.length;
    }

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

    Classes():
        Array<string>
    {
        const classes: Array<string> = [];

        classes.push(`Text`);
        if (this.Default_Language_Direction() === Language.Direction.LEFT_TO_RIGHT) {
            classes.push(`Left_To_Right`);
        } else {
            classes.push(`Right_To_Left`);
        }

        return classes;
    }

    Styles():
        string | { [css_property: string]: string; }
    {
        return this.Default_Font_Styles();
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
