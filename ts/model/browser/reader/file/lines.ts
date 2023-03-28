import { Count } from "../../../../types.js";
import { Index } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Text from "../../../text.js";

import * as File from "./instance.js";
import * as Line from "./line.js";

export class Instance
{
    private static blank_line: Line.Instance = new Line.Instance(
        {
            lines: null,
            index: null,
            text: null,
        },
    );

    static Min_Count():
        Count
    {
        return File.Instance.Min_Line_Count();
    }

    private file: File.Instance;
    private lines: Array<Line.Instance>;

    constructor(
        {
            file,
            text,
        }: {
            file: File.Instance,
            text: Array<Text.Line.Instance>,
        },
    )
    {
        this.file = file;
        this.lines = [];

        let line_index: Index = 0;

        for (const line of text) {
            this.lines.push(
                new Line.Instance(
                    {
                        lines: this,
                        index: line_index++,
                        text: line,
                    },
                ),
            );
        }
    }

    File():
        File.Instance
    {
        return this.file;
    }

    Count():
        Count
    {
        return this.lines.length;
    }

    At(
        line_index: Index,
    ):
        Line.Instance
    {
        Utils.Assert(
            line_index > -1,
            `line_index (${line_index}) must be greater than -1.`,
        );

        if (line_index < this.Count()) {
            return this.lines[line_index];
        } else {
            return Instance.blank_line;
        }
    }

    Array():
        Array<Line.Instance>
    {
        return Array.from(this.lines);
    }
}
