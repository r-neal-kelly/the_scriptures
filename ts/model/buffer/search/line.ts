import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Search from "../../search.js";

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

    private result: Search.Result.Instance | null;

    constructor(
        {
            buffer,
            index,
            result,
        }: {
            buffer: Buffer.Instance | null,
            index: Index | null,
            result: Search.Result.Instance | null,
        },
    )
    {
        super(
            {
                buffer: buffer,
                index: index,
                text: result ?
                    result.Line() :
                    null,
            },
        );

        this.result = result;

        if (buffer == null) {
            Utils.Assert(
                result == null,
                `result must be null.`,
            );
        } else {
            Utils.Assert(
                result != null,
                `result must not be null.`,
            );
        }

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

    Result():
        Search.Result.Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `line is blank.`,
        );

        return this.result as Search.Result.Instance;
    }
}
