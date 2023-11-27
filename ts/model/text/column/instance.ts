import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import { Value } from "../value.js";
import * as Part from "../part.js";
import * as Row from "../row.js";
import * as Path from "../path.js";

import { Type } from "./type.js";

export class Instance
{
    private path: Path.Instance;
    private type: Type;
    private index: Index;
    private rows: Array<Row.Instance>;
    private previous_part_is_column_like: boolean;

    constructor(
        {
            path,
            type,
            index,
        }: {
            path: Path.Instance,
            type: Type,
            index: Index,
        },
    )
    {
        this.path = path;
        this.type = type;
        this.index = index;
        this.rows = [];
        this.previous_part_is_column_like = false;
    }

    Update_Empty():
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `Must not be finalized before updating.`,
        );
        Utils.Assert(
            this.rows.length === 0,
            `Must not have any other rows.`,
        );

        this.Push_Row(``);
    }

    Update_Point(
        row_value: Value,
        micro_point: Part.Point.Instance,
        macro_point: Part.Point.Instance,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `Must not be finalized before updating.`,
        );

        if (this.rows.length < 1) {
            this.Push_Row(row_value);
        }

        this.Working_Row().Update_Point(micro_point, macro_point);

        this.previous_part_is_column_like = false;
    }

    Update_Letter(
        row_value: Value,
        micro_letter: Part.Letter.Instance,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `Must not be finalized before updating.`,
        );

        if (this.rows.length < 1) {
            this.Push_Row(row_value);
        }

        this.Working_Row().Update_Letter(micro_letter);

        this.previous_part_is_column_like = false;
    }

    Update_Marker(
        row_value: Value,
        micro_marker: Part.Marker.Instance,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `Must not be finalized before updating.`,
        );

        if (this.rows.length < 1) {
            this.Push_Row(row_value);
        }

        this.Working_Row().Update_Marker(micro_marker);

        this.previous_part_is_column_like = false;
    }

    Update_Word(
        row_value: Value,
        macro_word: Part.Word.Instance,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `Must not be finalized before updating.`,
        );

        if (this.rows.length < 1) {
            this.Push_Row(row_value);
        }

        this.Working_Row().Update_Word(macro_word);

        this.previous_part_is_column_like = false;
    }

    Update_Break(
        row_value: Value,
        macro_break: Part.Break.Instance,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `Must not be finalized before updating.`,
        );

        if (this.rows.length < 1) {
            this.Push_Row(row_value);
        }

        this.Working_Row().Update_Break(macro_break);

        this.previous_part_is_column_like = false;
    }

    Update_Command(
        row_value: Value,
        micro_command: Part.Command.Instance,
        macro_command: Part.Command.Instance,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `Must not be finalized before updating.`,
        );

        if (
            this.rows.length < 1 ||
            (
                macro_command.Is_Row() &&
                !this.previous_part_is_column_like
            )
        ) {
            this.Push_Row(row_value);
        }

        this.Working_Row().Update_Command(micro_command, macro_command);

        this.previous_part_is_column_like =
            macro_command.Is_Column() ||
            macro_command.Is_Margin() ||
            macro_command.Is_Interlinear();
    }

    private Push_Row(
        row_value: Value,
    ):
        void
    {
        this.rows.push(
            new Row.Instance(
                {
                    column: this,
                    index: this.rows.length,
                    value: row_value,
                },
            ),
        );
    }

    private Working_Row():
        Row.Instance
    {
        return this.rows[this.rows.length - 1];
    }

    Is_Finalized():
        boolean
    {
        return Object.isFrozen(this.rows);
    }

    Finalize():
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `Is already finalized.`,
        );

        Object.freeze(this.rows);

        for (const row of this.rows) {
            row.Finalize();
        }

        this.previous_part_is_column_like = false;
    }

    Path():
        Path.Instance
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.path;
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

    Is_Tabular():
        boolean
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.type === Type.TABULAR;
    }

    Is_Marginal():
        boolean
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.type === Type.MARGINAL;
    }

    Is_Inter_Marginal():
        boolean
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.Is_Tabular() && this.Path().Marginal_Column_Count() > 0;
    }

    Is_Interlinear():
        boolean
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.type === Type.INTERLINEAR;
    }

    Is_Inter_Interlinear():
        boolean
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.Is_Tabular() && this.Path().Interlinear_Column_Count() > 0;
    }

    Is_Fully_Tabular():
        boolean
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return (
            this.Is_Tabular() &&
            this.Path().Marginal_Column_Count() === 0 &&
            this.Path().Interlinear_Column_Count() === 0
        );
    }

    Index():
        Index
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.index;
    }

    Has_Row_Index(
        row_index: Index,
    ):
        boolean
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );
        Utils.Assert(
            row_index > -1,
            `row_index must be greater than -1.`,
        );

        return row_index < this.Row_Count();
    }

    Row_Count():
        Count
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );

        return this.rows.length;
    }

    Row(
        row_index: Index,
    ):
        Row.Instance
    {
        Utils.Assert(
            this.Is_Finalized(),
            `Must be finalized before being accessed.`,
        );
        Utils.Assert(
            this.Has_Row_Index(row_index),
            `Does not have row at index ${row_index}.`,
        );

        return this.rows[row_index];
    }
}
