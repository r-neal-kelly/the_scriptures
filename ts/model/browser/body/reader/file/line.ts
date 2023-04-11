import { Count } from "../../../../../types.js";
import { Index } from "../../../../../types.js";

import * as Utils from "../../../../../utils.js";

import * as Text from "../../../../text.js";

import * as Entity from "../../../../entity.js";
import * as File from "./instance.js";
import * as Segment from "./segment.js";

export class Instance extends Entity.Instance
{
    private static min_segment_count: Count = 70;

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
        return Instance.min_segment_count;
    }

    static Set_Min_Segment_Count(
        min_segment_count: Count,
    ):
        void
    {
        Utils.Assert(
            min_segment_count >= 0,
            `min_segment_count must be greater than or equal to 0.`,
        );

        Instance.min_segment_count = min_segment_count;
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
        super();

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

            if (text.Value() === ``) {
                const segment: Text.Segment.Instance = new Text.Segment.Instance(
                    {
                        segment_type: Text.Segment.Type.MACRO,
                    },
                );
                segment.Add_Item(
                    new Text.Part.Instance(
                        {
                            part_type: Text.Part.Type.POINT,
                            value: ` `,
                            status: Text.Part.Status.GOOD,
                            style: Text.Part.Style._NONE_,
                        },
                    ),
                );
                this.segments.push(
                    new Segment.Instance(
                        {
                            line: this,
                            index: 0,
                            text: segment,
                        },
                    ),
                );
            } else {
                for (let idx = 0, end = text.Macro_Segment_Count(); idx < end; idx += 1) {
                    this.segments.push(
                        new Segment.Instance(
                            {
                                line: this,
                                index: idx,
                                text: text.Macro_Segment(idx),
                            },
                        ),
                    );
                }
            }
        }

        this.Add_Dependencies(
            this.segments,
        );
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

    Is_Blank():
        boolean
    {
        return this.text == null;
    }

    Is_New_Line():
        boolean
    {
        return this.Text().Value() === ``;
    }
}
