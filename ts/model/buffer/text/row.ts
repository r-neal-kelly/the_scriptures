import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Language from "../../language.js";
import * as Text from "../../text.js";
import * as Buffer from "./instance.js";
import * as Column from "./column.js";
import * as Segment from "./segment.js";

export class Instance extends Entity.Instance
{
    private buffer: Buffer.Instance;
    private column: Column.Instance | null;
    private index: Index | null;
    private text: Text.Row.Instance | null;
    private segments: Array<Segment.Instance>;

    constructor(
        {
            buffer,
            column,
            index,
            text,
        }: {
            buffer: Buffer.Instance,
            column: Column.Instance | null,
            index: Index | null,
            text: Text.Row.Instance | null,
        },
    )
    {
        super();

        this.buffer = buffer;
        this.column = column;
        this.index = index;
        this.text = text;
        this.segments = [];

        if (text == null) {
            Utils.Assert(
                column == null,
                `column must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
        } else {
            Utils.Assert(
                column != null,
                `column must not be null.`,
            );
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );

            if (text.Value() === ``) {
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
                            buffer: this.buffer,
                            row: this,
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
                                buffer: this.buffer,
                                row: this,
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

    Buffer():
        Buffer.Instance
    {
        return this.buffer;
    }

    Column():
        Column.Instance
    {
        Utils.Assert(
            this.column != null,
            `Doesn't have column.`,
        );

        return this.column as Column.Instance;
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
        Text.Row.Instance
    {
        Utils.Assert(
            this.Has_Text(),
            `Doesn't have text.`,
        );

        return this.text as Text.Row.Instance;
    }

    Value():
        Text.Value
    {
        return this.Text().Value();
    }

    Min_Segment_Count():
        Count
    {
        return this.Buffer().Min_Segment_Count();
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
            return this.Buffer().Blank_Segment();
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

    Is_Centered():
        boolean
    {
        return this.Text().Can_Be_Centered() && this.Text().Is_Centered();
    }

    Is_Padded():
        boolean
    {
        return this.Text().Can_Be_Padded() && this.Text().Is_Padded();
    }

    Padding_Count():
        Count
    {
        if (this.Text().Can_Be_Padded()) {
            return this.Text().Padding_Count();
        } else {
            return 0;
        }
    }

    Padding_Direction():
        Language.Direction
    {
        return this.Buffer().Default_Language_Direction();
    }

    Has_Styles():
        boolean
    {
        return this.Has_Text();
    }

    Styles():
        string | { [index: string]: string; }
    {
        if (this.Has_Styles()) {
            if (this.Is_Padded()) {
                const padding_value: string =
                    `${this.Buffer().Pad_EM(this.Padding_Count())}em`;
                const padding_direction: string =
                    this.Padding_Direction() === Language.Direction.LEFT_TO_RIGHT ?
                        `left` :
                        `right`;

                return `
                    margin-${padding_direction}: ${padding_value};
                    border-${padding_direction}-width: 1px;
                `;
            } else {
                return ``;
            }
        } else {
            return ``;
        }
    }
}
