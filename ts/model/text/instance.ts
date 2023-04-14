import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Dictionary from "./dictionary.js";
import { Value } from "./value.js";
import * as Line from "./line.js";

export class Instance
{
    private dictionary: Dictionary.Instance;
    private value: Value;
    private lines: Array<Line.Instance>;

    constructor(
        {
            dictionary,
            value,
        }: {
            dictionary: Dictionary.Instance,
            value: Value,
        },
    )
    {
        this.dictionary = dictionary;
        this.value = value;
        this.lines = [];

        const line_values: Array<string> = value.split(/\r?\n/g);
        for (let idx = 0, end = line_values.length; idx < end; idx += 1) {
            this.lines.push(
                new Line.Instance(
                    {
                        text: this,
                        index: idx,
                        value: line_values[idx],
                    },
                ),
            );
        }
    }

    Dictionary():
        Dictionary.Instance
    {
        return this.dictionary;
    }

    Value():
        Value
    {
        return this.value;
    }

    Line_Count():
        Count
    {
        return this.lines.length;
    }

    Has_Line(
        line: Line.Instance,
    ):
        boolean
    {
        return this.lines.indexOf(line) > -1;
    }

    Has_Line_Index(
        line_index: Index,
    ):
        boolean
    {
        return (
            line_index > -1 &&
            line_index < this.Line_Count()
        );
    }

    Line(
        line_index: Index,
    ):
        Line.Instance
    {
        Utils.Assert(
            this.Has_Line_Index(line_index),
            `Text does not have line at the index.`,
        );

        return this.lines[line_index];
    }

    // We need to be able to add, insert, remove, and set lines,
    // certainly for the sake of the editor, but the perhaps for the browser too.
}
