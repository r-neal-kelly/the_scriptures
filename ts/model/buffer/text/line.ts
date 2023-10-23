import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Language from "../../language.js";
import * as Text from "../../text.js";
import * as Buffer from "./instance.js";
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

    private buffer: Buffer.Instance | null;
    private index: Index | null;
    private text: Text.Line.Instance | null;
    private segments: Array<Segment.Instance>;

    constructor(
        {
            buffer,
            index,
            text,
        }: {
            buffer: Buffer.Instance | null,
            index: Index | null,
            text: Text.Line.Instance | null,
        },
    )
    {
        super();

        this.buffer = buffer;
        this.index = index;
        this.text = text;
        this.segments = [];

        if (text == null) {
            Utils.Assert(
                buffer == null,
                `buffer must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
        } else {
            Utils.Assert(
                buffer != null,
                `buffer must not be null.`,
            );
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );

            if (text.Value(this.Buffer().Line_Path_Type()) === ``) {
                const segment: Text.Segment.Instance = new Text.Segment.Instance(
                    {
                        segment_type: Text.Segment.Type.MACRO,
                        index: 0,
                    },
                );
                segment.Add_Item(
                    new Text.Part.Instance(
                        {
                            part_type: Text.Part.Type.POINT,
                            index: 0,
                            value: ` `,
                            status: Text.Part.Status.GOOD,
                            style: Text.Part.Style._NONE_,
                            language: null,
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
                const line_path_type: Text.Line.Path_Type = this.Buffer().Line_Path_Type();
                for (let idx = 0, end = text.Macro_Segment_Count(line_path_type); idx < end; idx += 1) {
                    this.segments.push(
                        new Segment.Instance(
                            {
                                line: this,
                                index: idx,
                                text: text.Macro_Segment(idx, line_path_type),
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

    Buffer():
        Buffer.Instance
    {
        Utils.Assert(
            this.buffer != null,
            `Doesn't have buffer.`,
        );

        return this.buffer as Buffer.Instance;
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

    Has_Text():
        boolean
    {
        return this.text != null;
    }

    Text():
        Text.Line.Instance
    {
        Utils.Assert(
            this.Has_Text(),
            `Doesn't have text.`,
        );

        return this.text as Text.Line.Instance;
    }

    Value():
        Text.Value
    {
        return this.Text().Value(this.Buffer().Line_Path_Type());
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
        return this.Text().Value(this.Buffer().Line_Path_Type()) === ``;
    }

    Is_Centered():
        boolean
    {
        return this.Text().Is_Centered(this.Buffer().Line_Path_Type());
    }

    Padding_Count():
        Count
    {
        if (this.Has_Text()) {
            return this.Text().Padding_Count(this.Buffer().Line_Path_Type());
        } else {
            return 0;
        }
    }

    Padding_Direction():
        Language.Direction
    {
        return this.Buffer().Default_Text_Direction();
    }

    Has_Styles():
        boolean
    {
        return this.Padding_Count() > 0;
    }

    Styles():
        string | { [index: string]: string; }
    {
        if (this.Has_Styles()) {
            const padding_value: string =
                `${this.Padding_Count() * this.Buffer().Indentation_Amount()}em`;
            const padding_direction: string =
                this.Padding_Direction() === Language.Direction.LEFT_TO_RIGHT ?
                    `left` :
                    `right`;

            return `
            padding-${padding_direction}: ${padding_value};
        `;
        } else {
            return ``;
        }
    }
}
