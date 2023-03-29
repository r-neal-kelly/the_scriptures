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
            text: Text.Instance,
        },
    )
    {
        this.file = file;
        this.lines = [];

        for (let idx = 0, end = text.Line_Count(); idx < end; idx += 1) {
            this.lines.push(
                new Line.Instance(
                    {
                        lines: this,
                        index: idx,
                        text: text.Line(idx),
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
}
