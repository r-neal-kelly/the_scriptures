import { Count } from "../../../../types.js";
import { Index } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as File from "./instance.js";
import * as Line from "./line.js";

export class Instance
{
    private file: File.Instance;
    private lines: Array<Line.Instance>;

    constructor(
        {
            file,
            text,
        }: {
            file: File.Instance,
            text: string,
        },
    )
    {
        this.file = file;
        this.lines = [];

        this.lines.push(
            new Line.Instance(
                {
                    lines: this,
                    text: file.Data().Title(),
                },
            ),
        );
        this.lines.push(
            new Line.Instance(
                {
                    lines: this,
                    text: ``,
                },
            ),
        );
        for (const line_text of text.split(/\r?\n/g)) {
            this.lines.push(
                new Line.Instance(
                    {
                        lines: this,
                        text: line_text,
                    },
                ),
            );
        }
        this.lines.push(
            new Line.Instance(
                {
                    lines: this,
                    text: ``,
                },
            ),
        );
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
            `line_index must be greater than -1.`,
        );
        Utils.Assert(
            line_index < this.Count(),
            `line_index must be less than line_count.`,
        );

        return this.lines[line_index];
    }

    Array():
        Array<Line.Instance>
    {
        return Array.from(this.lines);
    }
}
