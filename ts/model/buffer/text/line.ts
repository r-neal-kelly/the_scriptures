import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Text from "../../text.js";

import * as Text_Base from "../text_base.js";
import * as Buffer from "./instance.js";
import * as Column from "./column.js";

export class Instance extends Text_Base.Line.Instance<
    Buffer.Instance,
    Column.Instance
>
{
    private static blank_column: Column.Instance = new Column.Instance(
        {
            line: null,
            index: null,
            text: null,
        },
    );

    constructor(
        {
            buffer,
            index,
            text,
        }: {
            buffer: Buffer.Instance | null,
            index: Index | null,
            text: Text.Line.Instance | null,
        },
    )
    {
        super(
            {
                buffer: buffer,
                index: index,
                text: text,
            },
        );

        if (!this.Is_Blank()) {
            for (let idx = 0, end = this.Text().Column_Count(); idx < end; idx += 1) {
                this.Push_Column(
                    new Column.Instance(
                        {
                            line: this,
                            index: idx,
                            text: this.Text().Column(idx),
                        },
                    ),
                );
            }
        }
    }

    Blank_Column():
        Column.Instance
    {
        return Instance.blank_column;
    }
}
