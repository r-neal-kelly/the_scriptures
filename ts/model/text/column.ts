import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Utils from "../../utils.js";

import { Value } from "./value.js";
import * as Part from "./part.js";
import * as Row from "./row.js";

export class Instance
{
    private index: Index;
    private is_margin: boolean;
    private rows: Array<Row.Instance>;
    private last_command: Part.Command.Instance | null;

    constructor(
        {
            index,
            is_margin,
        }: {
            index: Index,
            is_margin: boolean,
        },
    )
    {
        this.index = index;
        this.is_margin = is_margin;
        this.rows = [];
        this.last_command = null;
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
                (
                    !this.last_command ||
                    (
                        !this.last_command.Is_Column() &&
                        !this.last_command.Is_Margin()
                    )
                )
            )
        ) {
            this.Push_Row(row_value);
        }

        this.Working_Row().Update_Command(micro_command, macro_command);

        this.last_command = macro_command;
    }

    private Push_Row(
        row_value: Value,
    ):
        void
    {
        this.rows.push(
            new Row.Instance(
                {
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

        this.last_command = null;
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

    Is_Margin():
        boolean
    {
        return this.is_margin;
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
