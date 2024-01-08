import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Data from "../../data.js";
import * as Text from "../../text.js";

interface Buffer_Instance_i
{
}

interface Line_Instance_i<
    Buffer_Instance,
>
{
    Buffer():
        Buffer_Instance;
    Index():
        Index;
}

interface Row_Instance_i
{
}

export abstract class Instance<
    Buffer_Instance extends Buffer_Instance_i,
    Line_Instance extends Line_Instance_i<Buffer_Instance>,
    Row_Instance extends Row_Instance_i,
> extends Entity.Instance
{
    private line: Line_Instance;
    private index: Index;
    private text: Text.Column.Instance | null;
    private rows: Array<Row_Instance>;

    constructor(
        {
            line,
            index,
            text,
        }: {
            line: Line_Instance,
            index: Index,
            text: Text.Column.Instance | null,
        },
    )
    {
        super();

        this.line = line;
        this.index = index;
        this.text = text;
        this.rows = [];

        Utils.Assert(
            index > -1,
            `index must be greater than -1.`,
        );

        this.Add_Dependencies(
            [
                Data.Singleton(),
            ],
        );
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
    }

    Buffer():
        Buffer_Instance
    {
        return this.Line().Buffer();
    }

    Line():
        Line_Instance
    {
        return this.line;
    }

    Index():
        Index
    {
        return this.index;
    }

    Text():
        Text.Column.Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `column is blank.`,
        );

        return this.text as Text.Column.Instance;
    }

    Row_Buffer_Count():
        Count
    {
        return Data.Singleton().Info().Average_Row_Count(
            {
                line_index: this.Line().Index(),
                column_index: this.Index(),
            },
        );
    }

    Row_Count():
        Count
    {
        return this.rows.length;
    }

    abstract Blank_Row(
        row_index: Index,
    ):
        Row_Instance;

    Row_At(
        row_index: Index,
    ):
        Row_Instance
    {
        Utils.Assert(
            row_index > -1,
            `row_index (${row_index}) must be greater than -1.`,
        );

        if (row_index < this.Row_Count()) {
            return this.rows[row_index];
        } else {
            return this.Blank_Row(row_index);
        }
    }

    protected Push_Row(
        row: Row_Instance,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Blank(),
            `column is blank.`,
        );

        this.rows.push(row);
    }

    Is_Marginal():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `column is blank.`,
        );

        return this.Text().Is_Marginal();
    }

    Is_Inter_Marginal():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `column is blank.`,
        );

        return this.Text().Is_Inter_Marginal();
    }

    Is_Interlinear():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `column is blank.`,
        );

        return this.Text().Is_Interlinear();
    }

    Is_Inter_Interlinear():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `column is blank.`,
        );

        return this.Text().Is_Inter_Interlinear();
    }

    Is_Fully_Tabular():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `column is blank.`,
        );

        return this.Text().Is_Tabular();
    }
}
