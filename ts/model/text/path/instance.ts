import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Language from "../../language.js";
import { Value } from "../value.js";
import * as Dictionary from "../dictionary.js";
import * as Part from "../part.js";
import * as Column from "../column.js";

import { Type } from "./type.js";

export class Instance
{
    private type: Type;
    private value: Value;
    private columns: Array<Column.Instance>;
    private margin_count: Count;

    constructor(
        {
            type,
            value,
        }: {
            type: Type,
            value: Value,
        },
    )
    {
        this.type = type;
        this.value = value;
        this.columns = [];
        this.margin_count = 0;
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

        this.Push_Column(false);

        this.columns[this.columns.length - 1].Update_Empty();
    }

    Update_Point(
        row_value: Value,
        {
            value,
            style,
            language,
        }: {
            value: Value,
            style: Part.Style,
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
                language: language,
            },
        );
        const macro_point: Part.Point.Instance = new Part.Point.Instance(
            {
                index: 0,
                value: value,
                style: style,
                language: language,
            },
        );

        if (this.columns.length < 1) {
            this.Push_Column(false);
        }

        this.columns[this.columns.length - 1].Update_Point(row_value, micro_point, macro_point);
    }

    Update_Letter(
        row_value: Value,
        {
            value,
            style,
            language,
        }: {
            value: Value,
            style: Part.Style,
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
                language: language,
            },
        );

        if (this.columns.length < 1) {
            this.Push_Column(false);
        }

        this.columns[this.columns.length - 1].Update_Letter(row_value, micro_letter);
    }

    Update_Marker(
        row_value: Value,
        {
            value,
            style,
            language,
        }: {
            value: Value,
            style: Part.Style,
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
                language: language,
            },
        );

        if (this.columns.length < 1) {
            this.Push_Column(false);
        }

        this.columns[this.columns.length - 1].Update_Marker(row_value, micro_marker);
    }

    Update_Word(
        row_value: Value,
        {
            value,
            status,
            style,
            language,
        }: {
            value: Value,
            status: Part.Status,
            style: Part.Style,
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
                language: language,
            },
        );

        if (this.columns.length < 1) {
            this.Push_Column(false);
        }

        this.columns[this.columns.length - 1].Update_Word(row_value, macro_word);
    }

    Update_Break(
        row_value: Value,
        {
            value,
            status,
            style,
            language,
            boundary,
        }: {
            value: Value,
            status: Part.Status,
            style: Part.Style,
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
                language: language,
                boundary: boundary,
            },
        );

        if (this.columns.length < 1) {
            this.Push_Column(false);
        }

        this.columns[this.columns.length - 1].Update_Break(row_value, macro_break);
    }

    Update_Command(
        row_value: Value,
        {
            value,
            language,
        }: {
            value: Value,
            language: Language.Name | null,
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
                language: language,
            },
        );
        const macro_command: Part.Command.Instance = new Part.Command.Instance(
            {
                index: 0,
                value: value,
                language: language,
            },
        );

        if (this.columns.length < 1 || macro_command.Is_Column() || macro_command.Is_Margin()) {
            this.Push_Column(macro_command.Is_Margin());
        }

        this.columns[this.columns.length - 1].Update_Command(row_value, micro_command, macro_command);

        if (macro_command.Is_Margin()) {
            this.margin_count += 1;
        }
    }

    private Push_Column(
        is_margin: boolean,
    ):
        void
    {
        this.columns.push(
            new Column.Instance(
                {
                    index: this.columns.length,
                    is_margin: is_margin,
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

    Has_Margin():
        boolean
    {
        return this.margin_count > 0;
    }

    Margin_Count():
        Count
    {
        return this.margin_count;
    }

    Non_Margin_Count():
        Count
    {
        return this.Column_Count() - this.Margin_Count();
    }
};
