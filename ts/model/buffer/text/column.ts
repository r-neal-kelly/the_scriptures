import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Text from "../../text.js";
import * as Buffer from "./instance.js";
import * as Line from "./line.js";
import * as Row from "./row.js";

export class Instance extends Entity.Instance
{
    private buffer: Buffer.Instance;
    private line: Line.Instance | null;
    private index: Index | null;
    private text: Text.Column.Instance | null;
    private rows: Array<Row.Instance>;

    constructor(
        {
            buffer,
            line,
            index,
            text,
        }: {
            buffer: Buffer.Instance,
            line: Line.Instance | null,
            index: Index | null,
            text: Text.Column.Instance | null,
        },
    )
    {
        super();

        this.buffer = buffer;
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
                            buffer: this.buffer,
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

    Buffer():
        Buffer.Instance
    {
        return this.buffer;
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

    Min_Row_Count():
        Count
    {
        return this.Buffer().Min_Row_Count();
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
            return this.Buffer().Blank_Row();
        }
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
    }

    Is_Marginal():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `this column is blank`,
        );

        return this.Text().Is_Marginal();
    }

    Is_Inter_Marginal():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `this column is blank`,
        );

        return this.Text().Is_Inter_Marginal();
    }

    Is_Interlinear():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `this column is blank`,
        );

        return this.Text().Is_Interlinear();
    }

    Is_Inter_Interlinear():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `this column is blank`,
        );

        return this.Text().Is_Inter_Interlinear();
    }

    Has_Styles():
        boolean
    {
        return this.Has_Text();
    }

    Styles():
        string | { [index: string]: string; }
    {
        if (this.Has_Styles()) {
            const text: Text.Column.Instance = this.Text();
            if (
                text.Is_Interlinear() ||
                text.Is_Inter_Interlinear()
            ) {
                return `
                    grid-template-rows: repeat(${text.Row_Count()}, 1fr);
                `;
            } else {
                return `
                    grid-template-rows: repeat(${text.Row_Count()}, min-content);
                `;
            }
        } else {
            return ``;
        }
    }
}
