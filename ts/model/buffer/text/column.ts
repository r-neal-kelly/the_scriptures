import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Text from "../../text.js";
import * as Line from "./line.js";
import * as Row from "./row.js";

export class Instance extends Entity.Instance
{
    private static min_row_count: Count = 1;

    private static blank_row: Row.Instance = new Row.Instance(
        {
            column: null,
            index: null,
            text: null,
        },
    );

    static Min_Row_Count():
        Count
    {
        return Instance.min_row_count;
    }

    static Set_Min_Row_Count(
        min_row_count: Count,
    ):
        void
    {
        Utils.Assert(
            min_row_count >= 0,
            `min_row_count must be greater than or equal to 0.`,
        );

        Instance.min_row_count = min_row_count;
    }

    private line: Line.Instance | null;
    private index: Index | null;
    private text: Text.Column.Instance | null;
    private rows: Array<Row.Instance>;

    constructor(
        {
            line,
            index,
            text,
        }: {
            line: Line.Instance | null,
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

        if (text == null) {
            Utils.Assert(
                line == null,
                `line must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
        } else {
            Utils.Assert(
                line != null,
                `line must not be null.`,
            );
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );

            for (let idx = 0, end = text.Row_Count(); idx < end; idx += 1) {
                this.rows.push(
                    new Row.Instance(
                        {
                            column: this,
                            index: idx,
                            text: text.Row(idx),
                        },
                    ),
                );
            }
        }

        this.Add_Dependencies(
            this.rows,
        );
    }

    Line():
        Line.Instance
    {
        Utils.Assert(
            this.line != null,
            `Doesn't have line.`,
        );

        return this.line as Line.Instance;
    }

    Index():
        Index
    {
        Utils.Assert(
            this.index != null,
            `Doesn't have an index.`,
        );

        return this.index as Index;
    }

    Has_Text():
        boolean
    {
        return this.text != null;
    }

    Text():
        Text.Column.Instance
    {
        Utils.Assert(
            this.Has_Text(),
            `Doesn't have text.`,
        );

        return this.text as Text.Column.Instance;
    }

    Row_Count():
        Count
    {
        return this.rows.length;
    }

    Row_At(
        row_index: Index,
    ):
        Row.Instance
    {
        Utils.Assert(
            row_index > -1,
            `row_index (${row_index}) must be greater than -1.`,
        );

        if (row_index < this.Row_Count()) {
            return this.rows[row_index];
        } else {
            return Instance.blank_row;
        }
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
    }
}
