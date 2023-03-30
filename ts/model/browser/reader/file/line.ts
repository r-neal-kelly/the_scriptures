import { Count } from "../../../../types.js";
import { Index } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Text from "../../../text.js";

import * as File from "./instance.js";
import * as Segment from "./segment.js";

export class Instance
{
    private static blank_segment: Segment.Instance = new Segment.Instance(
        {
            line: null,
            index: null,
            text: null,
        },
    );

    static Min_Segment_Count():
        Count
    {
        return File.Instance.Min_Segment_Count();
    }

    private file: File.Instance | null;
    private index: Index | null;
    private text: Text.Line.Instance | null;
    private segments: Array<Segment.Instance>;

    constructor(
        {
            file,
            index,
            text,
        }: {
            file: File.Instance | null,
            index: Index | null,
            text: Text.Line.Instance | null,
        },
    )
    {
        this.file = file;
        this.index = index;
        this.text = text;
        this.segments = [];

        if (text == null) {
            Utils.Assert(
                file == null,
                `file must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
        } else {
            Utils.Assert(
                file != null,
                `file must not be null.`,
            );
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );

            for (let idx = 0, end = text.Part_Segment_Count(); idx < end; idx += 1) {
                this.segments.push(
                    new Segment.Instance(
                        {
                            line: this,
                            index: idx,
                            text: text.Part_Segment(idx),
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

    File():
        File.Instance
    {
        Utils.Assert(
            this.file != null,
            `Doesn't have file.`,
        );

        return this.file as File.Instance;
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
        Text.Line.Instance
    {
        Utils.Assert(
            this.text != null,
            `Doesn't have text.`,
        );

        return this.text as Text.Line.Instance;
    }

    Segment_Count():
        Count
    {
        return this.segments.length;
    }

    Segment_At(
        segment_index: Index,
    ):
        Segment.Instance
    {
        Utils.Assert(
            segment_index > -1,
            `segment_index (${segment_index}) must be greater than -1.`,
        );

        if (segment_index < this.Segment_Count()) {
            return this.segments[segment_index];
        } else {
            return Instance.blank_segment;
        }
    }
}
