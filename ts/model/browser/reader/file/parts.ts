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
            parts: null,
            index: null,
            text: null,
        },
    );

    static Min_Count():
        Count
    {
        return File.Instance.Min_Part_Count();
    }

    private line: Line.Instance;
    private parts: Array<Part.Instance>;

    constructor(
        {
            line,
            text,
        }: {
            line: Line.Instance,
            text: Array<Text.Part.Instance>,
        },
    )
    {
        this.line = line;
        this.parts = [];

        let part_index: Index = 0;

        for (const part of text) {
            this.parts.push(
                new Part.Instance(
                    {
                        parts: this,
                        index: part_index++,
                        text: part,
                    },
                ),
            );
        }
    }

    Line():
        Line.Instance
    {
        return this.line;
    }

    Count():
        Count
    {
        return this.parts.length;
    }

    At(
        part_index: Index,
    ):
        Part.Instance
    {
        Utils.Assert(
            part_index > -1,
            `part_index (${part_index}) must be greater than -1.`,
        );

        if (part_index < this.Count()) {
            return this.parts[part_index];
        } else {
            return Instance.blank_part;
        }
    }

    Array():
        Array<Part.Instance>
    {
        return Array.from(this.parts);
    }
}
