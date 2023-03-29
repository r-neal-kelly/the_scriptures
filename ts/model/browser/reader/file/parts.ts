import { Count } from "../../../../types.js";
import { Index } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Text from "../../../text.js";

import * as File from "./instance.js";
import * as Segment from "./segment.js";
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

    private segment: Segment.Instance;
    private parts: Array<Part.Instance>;

    constructor(
        {
            segment,
            text,
        }: {
            segment: Segment.Instance,
            text: Text.Segment.Instance | null,
        },
    )
    {
        this.segment = segment;
        this.parts = [];

        if (text != null) {
            for (let idx = 0, end = text.Part_Count(); idx < end; idx += 1) {
                this.parts.push(
                    new Part.Instance(
                        {
                            parts: this,
                            index: idx,
                            text: text.Part(idx),
                        },
                    ),
                );
            }
        }
    }

    Segment():
        Segment.Instance
    {
        return this.segment;
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
}
