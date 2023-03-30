import { Count } from "../../../../types.js";
import { Index } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Text from "../../../text.js";

import * as File from "./instance.js";
import * as Line from "./line.js";
import * as Part from "./part.js";

export class Instance
{
    private static blank_part: Part.Instance = new Part.Instance(
        {
            segment: null,
            index: null,
            text: null,
        },
    );

    static Min_Part_Count():
        Count
    {
        return File.Instance.Min_Part_Count();
    }

    private line: Line.Instance | null;
    private index: Index | null;
    private text: Text.Segment.Instance | null;
    private parts: Array<Part.Instance>;

    constructor(
        {
            line,
            index,
            text,
        }: {
            line: Line.Instance | null,
            index: Index | null,
            text: Text.Segment.Instance | null,
        },
    )
    {
        this.line = line;
        this.index = index;
        this.text = text;
        this.parts = [];

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

            for (let idx = 0, end = text.Part_Count(); idx < end; idx += 1) {
                this.parts.push(
                    new Part.Instance(
                        {
                            segment: this,
                            index: idx,
                            text: text.Part(idx),
                        },
                    ),
                );
            }
        }
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
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

    Text():
        Text.Segment.Instance
    {
        Utils.Assert(
            this.text != null,
            `Doesn't have text.`,
        );

        return this.text as Text.Segment.Instance;
    }

    Part_Count():
        Count
    {
        return this.parts.length;
    }

    Part_At(
        part_index: Index,
    ):
        Part.Instance
    {
        Utils.Assert(
            part_index > -1,
            `part_index (${part_index}) must be greater than -1.`,
        );

        if (part_index < this.Part_Count()) {
            return this.parts[part_index];
        } else {
            return Instance.blank_part;
        }
    }
}
