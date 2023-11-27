import { Index } from "../../../types.js";

import * as Text from "../../text.js";

import * as Text_Base from "../text_base.js";
import * as Buffer from "./instance.js";
import * as Line from "./line.js";
import * as Row from "./row.js";

export class Instance extends Text_Base.Column.Instance<
    Buffer.Instance,
    Line.Instance,
    Row.Instance
>
{
    private static blank_row: Row.Instance = new Row.Instance(
        {
            column: null,
            index: null,
            text: null,
        },
    );

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
        super(
            {
                line: line,
                index: index,
                text: text,
            },
        );

        if (!this.Is_Blank()) {
            for (let idx = 0, end = this.Text().Row_Count(); idx < end; idx += 1) {
                this.Push_Row(
                    new Row.Instance(
                        {
                            column: this,
                            index: idx,
                            text: this.Text().Row(idx),
                        },
                    ),
                );
            }
        }
    }

    Blank_Row():
        Row.Instance
    {
        return Instance.blank_row;
    }
}
