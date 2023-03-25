import { Index } from "../../types.js";

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

        let line_index: Index = 0;
        for (const value_line of value.split(/\r?\n/g)) {
            this.lines.push(
                new Line.Instance(
                    {
                        text: this,
                        index: line_index++,
                        value: value_line,
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

    Lines():
        Array<Line.Instance>
    {
        return Array.from(this.lines);
    }
}
