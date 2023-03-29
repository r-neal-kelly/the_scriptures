import { Count } from "../../../../types.js";
import { Index } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Text from "../../../text.js";

import * as File from "./instance.js";
import * as Line from "./line.js";
import * as Segment from "./segment.js";

export class Instance
{
    private static blank_segment: Segment.Instance = new Segment.Instance(
        {
            segments: null,
            index: null,
            text: null,
        },
    );

    static Min_Count():
        Count
    {
        return File.Instance.Min_Segment_Count();
    }

    private line: Line.Instance;
    private segments: Array<Segment.Instance>;

    constructor(
        {
            line,
            text,
        }: {
            line: Line.Instance,
            text: Text.Line.Instance | null,
        },
    )
    {
        this.line = line;
        this.segments = [];

        if (text != null) {
            for (let idx = 0, end = text.Part_Segment_Count(); idx < end; idx += 1) {
                this.segments.push(
                    new Segment.Instance(
                        {
                            segments: this,
                            index: idx,
                            text: text.Part_Segment(idx),
                        },
                    ),
                );
            }
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
        return this.segments.length;
    }

    At(
        segment_index: Index,
    ):
        Segment.Instance
    {
        Utils.Assert(
            segment_index > -1,
            `segment_index (${segment_index}) must be greater than -1.`,
        );

        if (segment_index < this.Count()) {
            return this.segments[segment_index];
        } else {
            return Instance.blank_segment;
        }
    }
}
