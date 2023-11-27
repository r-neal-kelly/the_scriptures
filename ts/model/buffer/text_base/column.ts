import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Text from "../../text.js";

import { Default_Min_Counts } from "./default_min_counts.js";

interface Buffer_Instance_i
{
}

interface Line_Instance_i<
    Buffer_Instance,
>
{
    Buffer():
        Buffer_Instance;
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
    private line: Line_Instance | null;
    private index: Index | null;
    private text: Text.Column.Instance | null;
    private rows: Array<Row_Instance>;

    constructor(
        {
            line,
            index,
            text,
        }: {
            line: Line_Instance | null,
            index: Index | null,
            text: Text.Column.Instance | null,
        },
    )
    {
        super();

        this.line = line;
        this.index = index;
        this.text = text;
        this.rows = [];

        if (line == null) {
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
            Utils.Assert(
                text == null,
                `text must be null.`,
            );
        } else {
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );
            Utils.Assert(
                text != null,
                `text must not be null.`,
            );
        }
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
    }

    Buffer():
        Buffer_Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `column is blank.`,
        );

        return this.Line().Buffer();
    }

    Line():
        Line_Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `column is blank.`,
        );

        return this.line as Line_Instance;
    }

    Index():
        Index
    {
        Utils.Assert(
            !this.Is_Blank(),
            `column is blank.`,
        );

        return this.index as Index;
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

    Min_Row_Count():
        Count
    {
        return Default_Min_Counts.ROW;
    }

    Row_Count():
        Count
    {
        return this.rows.length;
    }

    abstract Blank_Row():
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
            return this.Blank_Row();
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
