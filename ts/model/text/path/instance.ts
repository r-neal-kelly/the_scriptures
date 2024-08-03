import { Float } from "../../../types.js";
import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Language from "../../language.js";
import { Value } from "../value.js";
import * as Dictionary from "../dictionary.js";
import * as Part from "../part.js";
import * as Column from "../column.js";
import * as Line from "../line.js";

import { Type } from "./type.js";

export class Instance
{
    private line: Line.Instance;
    private type: Type;
    private value: Value;
    private columns: Array<Column.Instance>;
    private tabular_column_count: Count;
    private marginal_column_count: Count;
    private interlinear_column_count: Count;
    private has_reverse_interlinear_column: boolean;

    constructor(
        {
            line,
            type,
            value,
        }: {
            line: Line.Instance,
            type: Type,
            value: Value,
        },
    )
    {
        this.line = line;
        this.type = type;
        this.value = value;
        this.columns = [];
        this.tabular_column_count = 0;
        this.marginal_column_count = 0;
        this.interlinear_column_count = 0;
        this.has_reverse_interlinear_column = false;
    }

    Update_Empty():
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `Must not be finalized before updating.`,
        );
        Utils.Assert(
            this.columns.length === 0,
            `Must not have any other columns.`,
        );

        this.Push_Column(Column.Type.TABULAR);

        this.columns[this.columns.length - 1].Update_Empty();
    }

    Update_Point(
        row_value: Value,
        {
            value,
            style,
            size,
            language,
        }: {
            value: Value,
            style: Part.Style,
            size: Float | null,
            language: Language.Name | null,
        },
    ):
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `Must not be finalized before updating.`,
        );

        const micro_point: Part.Point.Instance = new Part.Point.Instance(
            {
                index: 0,
                value: value,
                style: style,
                size: size,
                language: language,
            },
        );
        const macro_point: Part.Point.Instance = new Part.Point.Instance(
            {
                index: 0,
                value: value,
                style: style,
                size: size,
                language: language,
            },
        );

        if (this.columns.length < 1) {
            this.Push_Column(Column.Type.TABULAR);
        }

        this.columns[this.columns.length - 1].Update_Point(row_value, micro_point, macro_point);
    }

    Update_Letter(
        row_value: Value,
        {
            value,
            style,
            size,
            language,
        }: {
            value: Value,
            style: Part.Style,
            size: Float | null,
            language: Language.Name | null,
        },
    ):
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `Must not be finalized before updating.`,
        );

        const micro_letter: Part.Letter.Instance = new Part.Letter.Instance(
            {
                index: 0,
                value: value,
                style: style,
                size: size,
                language: language,
            },
        );

        if (this.columns.length < 1) {
            this.Push_Column(Column.Type.TABULAR);
        }

        this.columns[this.columns.length - 1].Update_Letter(row_value, micro_letter);
    }

    Update_Marker(
        row_value: Value,
        {
            value,
            style,
            size,
            language,
        }: {
            value: Value,
            style: Part.Style,
            size: Float | null,
            language: Language.Name | null,
        },
    ):
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `Must not be finalized before updating.`,
        );

        const micro_marker: Part.Marker.Instance = new Part.Marker.Instance(
            {
                index: 0,
                value: value,
                style: style,
                size: size,
                language: language,
            },
        );

        if (this.columns.length < 1) {
            this.Push_Column(Column.Type.TABULAR);
        }

        this.columns[this.columns.length - 1].Update_Marker(row_value, micro_marker);
    }

    Update_Word(
        row_value: Value,
        {
            value,
            status,
            style,
            size,
            language,
        }: {
            value: Value,
            status: Part.Status,
            style: Part.Style,
            size: Float | null,
            language: Language.Name | null,
        },
    ):
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `Must not be finalized before updating.`,
        );

        const macro_word: Part.Word.Instance = new Part.Word.Instance(
            {
                index: 0,
                value: value,
                status: status,
                style: style,
                size: size,
                language: language,
            },
        );

        if (this.columns.length < 1) {
            this.Push_Column(Column.Type.TABULAR);
        }

        this.columns[this.columns.length - 1].Update_Word(row_value, macro_word);
    }

    Update_Break(
        row_value: Value,
        {
            value,
            status,
            style,
            size,
            language,
            boundary,
        }: {
            value: Value,
            status: Part.Status,
            style: Part.Style,
            size: Float | null,
            language: Language.Name | null,
            boundary: Dictionary.Boundary,
        },
    ):
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `Must not be finalized before updating.`,
        );

        const macro_break: Part.Break.Instance = new Part.Break.Instance(
            {
                index: 0,
                value: value,
                status: status,
                style: style,
                size: size,
                language: language,
                boundary: boundary,
            },
        );

        if (this.columns.length < 1) {
            this.Push_Column(Column.Type.TABULAR);
        }

        this.columns[this.columns.length - 1].Update_Break(row_value, macro_break);
    }

    Update_Command(
        row_value: Value,
        {
            value,
            size,
            language,
            is_argument,
        }: {
            value: Value,
            size: Float | null,
            language: Language.Name | null,
            is_argument: boolean,
        },
    ):
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `Must not be finalized before updating.`,
        );

        const micro_command: Part.Command.Instance = new Part.Command.Instance(
            {
                index: 0,
                value: value,
                size: size,
                language: language,
                is_argument: is_argument,
            },
        );
        const macro_command: Part.Command.Instance = new Part.Command.Instance(
            {
                index: 0,
                value: value,
                size: size,
                language: language,
                is_argument: is_argument,
            },
        );

        if (this.columns.length < 1 || macro_command.Is_Column()) {
            this.Push_Column(Column.Type.TABULAR);
        } else if (macro_command.Is_Margin()) {
            this.Push_Column(Column.Type.MARGINAL);
        } else if (macro_command.Is_Forward_Interlinear()) {
            this.Push_Column(Column.Type.INTERLINEAR);
        } else if (macro_command.Is_Reverse_Interlinear()) {
            this.Push_Column(Column.Type.INTERLINEAR);
            this.has_reverse_interlinear_column = true;
        }

        this.columns[this.columns.length - 1].Update_Command(row_value, micro_command, macro_command);
    }

    private Push_Column(
        column_type: Column.Type,
    ):
        void
    {
        if (column_type === Column.Type.INTERLINEAR) {
            this.interlinear_column_count += 1;
        } else if (column_type === Column.Type.MARGINAL) {
            this.marginal_column_count += 1;
        } else {
            this.tabular_column_count += 1;
        }

        this.columns.push(
            new Column.Instance(
                {
                    path: this,
                    type: column_type,
                    index: this.columns.length,
                },
            ),
        );
    }

    Is_Finalized():
        boolean
    {
        return Object.isFrozen(this.columns);
    }

    Finalize():
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `Is already finalized.`,
        );

        Object.freeze(this.columns);

        for (const column of this.columns) {
            column.Finalize();
        }
    }

    Line():
        Line.Instance
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.line;
    }

    Type():
        Type
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.type;
    }

    Value():
        Value
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.value;
    }

    Is_Blank():
        boolean
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        for (let idx = 0, end = this.Column_Count(); idx < end; idx += 1) {
            if (!this.Column(idx).Is_Blank()) {
                return false;
            }
        }

        return true;
    }

    Has_Column_Index(
        column_index: Index,
    ):
        boolean
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );
        Utils.Assert(
            column_index > -1,
            `column_index must be greater than -1.`,
        );

        return column_index < this.Column_Count();
    }

    Column_Count():
        Count
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.columns.length;
    }

    Column(
        column_index: Index,
    ):
        Column.Instance
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );
        Utils.Assert(
            this.Has_Column_Index(column_index),
            `Does not have column at index ${column_index}.`,
        );

        return this.columns[column_index];
    }

    Tabular_Column_Count():
        Count
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.tabular_column_count;
    }

    Marginal_Column_Count():
        Count
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.marginal_column_count;
    }

    Interlinear_Column_Count():
        Count
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.interlinear_column_count;
    }

    Has_Margin():
        boolean
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.Marginal_Column_Count() > 0;
    }

    Has_Interlineation():
        boolean
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.Interlinear_Column_Count() > 0;
    }

    Has_Forward_Interlineation():
        boolean
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.Has_Interlineation() && !this.has_reverse_interlinear_column;
    }

    Has_Reverse_Interlineation():
        boolean
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.Has_Interlineation() && this.has_reverse_interlinear_column;
    }

    Is_Centered():
        boolean
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return (
            this.Has_Interlineation() &&
            this.Column_Count() > 0 &&
            this.Column(0).Row_Count() > 0 &&
            this.Column(0).Row(0).Is_Centered()
        );
    }

    Is_Padded():
        boolean
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return (
            this.Has_Interlineation() &&
            this.Column_Count() > 0 &&
            this.Column(0).Row_Count() > 0 &&
            this.Column(0).Row(0).Is_Padded()
        );
    }

    Padding_Count():
        Count
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        if (this.Is_Padded()) {
            return this.Column(0).Row(0).Padding_Count();
        } else {
            return 0;
        }
    }
};
