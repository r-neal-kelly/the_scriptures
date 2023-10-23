import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Language from "../../language.js";
import * as Text from "../../text.js";
import * as Search from "../../search.js";
import * as Buffer from "./instance.js";
import * as Segment from "./segment.js";

const LINE_PATH_TYPE: Text.Line.Path_Type =
    Text.Line.Path_Type.DEFAULT;

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
    private result: Search.Result.Instance | null;
    private segments: Array<Segment.Instance>;

    constructor(
        {
            buffer,
            index,
            result,
        }: {
            buffer: Buffer.Instance | null,
            index: Index | null,
            result: Search.Result.Instance | null,
        },
    )
    {
        super();

        this.buffer = buffer;
        this.index = index;
        this.result = result;
        this.segments = [];

        if (result == null) {
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

            if (result.Line().Value(LINE_PATH_TYPE) === ``) {
                const segment: Text.Segment.Instance = new Text.Segment.Instance(
                    {
                        segment_type: Text.Segment.Type.MICRO,
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
                for (let idx = 0, end = result.Line().Macro_Segment_Count(LINE_PATH_TYPE); idx < end; idx += 1) {
                    this.segments.push(
                        new Segment.Instance(
                            {
                                line: this,
                                index: idx,
                                text: result.Line().Macro_Segment(idx, LINE_PATH_TYPE),
                            },
                        ),
                    );
                }

                for (
                    let match_idx = 0, match_end = result.Match_Count();
                    match_idx < match_end;
                    match_idx += 1
                ) {
                    const match: Search.Result.Match =
                        result.Match(match_idx);
                    const first_part_index: Index =
                        match.First_Part_Index();
                    const first_part_first_unit_index: Index =
                        match.First_Part_First_Unit_Index();
                    const last_part_end_unit_index: Index =
                        match.Last_Part_End_Unit_Index();
                    const last_part_index: Index =
                        match.Last_Part_Index();
                    const end_part_index: Index =
                        match.End_Part_Index();

                    for (
                        let part_idx = first_part_index, part_end = end_part_index;
                        part_idx < part_end;
                        part_idx += 1
                    ) {
                        const segment_item_indices: Array<Text.Line.Segment_Item_Index> =
                            result.Line().Macro_Part_Segment_Item_Indices(part_idx, LINE_PATH_TYPE);
                        if (
                            part_idx === first_part_index &&
                            part_idx === last_part_index
                        ) {
                            let found_first_unit: boolean = false;
                            for (
                                let segment_item_idx = 0, segment_item_end = segment_item_indices.length;
                                segment_item_idx < segment_item_end;
                                segment_item_idx += 1
                            ) {
                                const {
                                    segment_index,
                                    item_index,
                                }: Text.Line.Segment_Item_Index =
                                    segment_item_indices[segment_item_idx];
                                const text_segment: Text.Segment.Instance =
                                    result.Line().Macro_Segment(segment_index, LINE_PATH_TYPE);
                                const text_item: Text.Item.Instance =
                                    text_segment.Item(item_index);
                                if (text_item.Is_Part()) {
                                    Utils.Assert(
                                        segment_item_end === 1,
                                        `A part item in segment was found split between segments!`,
                                    );
                                    this.Segment_At(segment_index).Item_At(item_index).Highlight(
                                        {
                                            first_unit_index:
                                                first_part_first_unit_index,
                                            end_unit_index:
                                                last_part_end_unit_index,
                                        },
                                    );
                                } else {
                                    const text_split: Text.Split.Instance =
                                        text_item as Text.Split.Instance;
                                    const text_split_end_unit_index: Index =
                                        text_split.End_Unit_Index();
                                    if (!found_first_unit) {
                                        if (first_part_first_unit_index < text_split_end_unit_index) {
                                            found_first_unit = true;
                                            if (last_part_end_unit_index <= text_split_end_unit_index) {
                                                this.Segment_At(segment_index).Item_At(item_index).Highlight(
                                                    {
                                                        first_unit_index:
                                                            first_part_first_unit_index - text_split.First_Unit_Index(),
                                                        end_unit_index:
                                                            last_part_end_unit_index - text_split.First_Unit_Index(),
                                                    },
                                                );
                                                break;
                                            } else {
                                                this.Segment_At(segment_index).Item_At(item_index).Highlight(
                                                    {
                                                        first_unit_index:
                                                            first_part_first_unit_index - text_split.First_Unit_Index(),
                                                        end_unit_index:
                                                            text_split.Value().length,
                                                    },
                                                );
                                            }
                                        }
                                    } else {
                                        if (last_part_end_unit_index <= text_split_end_unit_index) {
                                            this.Segment_At(segment_index).Item_At(item_index).Highlight(
                                                {
                                                    first_unit_index:
                                                        0,
                                                    end_unit_index:
                                                        last_part_end_unit_index - text_split.First_Unit_Index(),
                                                },
                                            );
                                            break;
                                        } else {
                                            this.Segment_At(segment_index).Item_At(item_index).Highlight(
                                                {
                                                    first_unit_index:
                                                        0,
                                                    end_unit_index:
                                                        text_split.Value().length,
                                                },
                                            );
                                        }
                                    }
                                }
                            }
                        } else if (
                            part_idx === first_part_index
                        ) {
                            let found_first_unit: boolean = false;
                            for (
                                let segment_item_idx = 0, segment_item_end = segment_item_indices.length;
                                segment_item_idx < segment_item_end;
                                segment_item_idx += 1
                            ) {
                                const {
                                    segment_index,
                                    item_index,
                                }: Text.Line.Segment_Item_Index =
                                    segment_item_indices[segment_item_idx];
                                const text_segment: Text.Segment.Instance =
                                    result.Line().Macro_Segment(segment_index, LINE_PATH_TYPE);
                                const text_item: Text.Item.Instance =
                                    text_segment.Item(item_index);
                                if (text_item.Is_Part()) {
                                    Utils.Assert(
                                        segment_item_end === 1,
                                        `A part item in segment was found split between segments!`,
                                    );
                                    this.Segment_At(segment_index).Item_At(item_index).Highlight(
                                        {
                                            first_unit_index:
                                                first_part_first_unit_index,
                                            end_unit_index:
                                                text_item.Value().length,
                                        },
                                    );
                                } else {
                                    const text_split: Text.Split.Instance =
                                        text_item as Text.Split.Instance;
                                    const text_split_end_unit_index: Index =
                                        text_split.End_Unit_Index();
                                    if (!found_first_unit) {
                                        if (first_part_first_unit_index < text_split_end_unit_index) {
                                            found_first_unit = true;
                                            this.Segment_At(segment_index).Item_At(item_index).Highlight(
                                                {
                                                    first_unit_index:
                                                        first_part_first_unit_index - text_split.First_Unit_Index(),
                                                    end_unit_index:
                                                        text_split.Value().length,
                                                },
                                            );
                                        }
                                    } else {
                                        this.Segment_At(segment_index).Item_At(item_index).Highlight(
                                            {
                                                first_unit_index:
                                                    0,
                                                end_unit_index:
                                                    text_split.Value().length,
                                            },
                                        );
                                    }
                                }
                            }
                        } else if (
                            part_idx === last_part_index
                        ) {
                            for (
                                let segment_item_idx = 0, segment_item_end = segment_item_indices.length;
                                segment_item_idx < segment_item_end;
                                segment_item_idx += 1
                            ) {
                                const {
                                    segment_index,
                                    item_index,
                                }: Text.Line.Segment_Item_Index =
                                    segment_item_indices[segment_item_idx];
                                const text_segment: Text.Segment.Instance =
                                    result.Line().Macro_Segment(segment_index, LINE_PATH_TYPE);
                                const text_item: Text.Item.Instance =
                                    text_segment.Item(item_index);
                                if (text_item.Is_Part()) {
                                    Utils.Assert(
                                        segment_item_end === 1,
                                        `A part item in segment was found split between segments!`,
                                    );
                                    this.Segment_At(segment_index).Item_At(item_index).Highlight(
                                        {
                                            first_unit_index:
                                                0,
                                            end_unit_index:
                                                last_part_end_unit_index,
                                        },
                                    );
                                } else {
                                    const text_split: Text.Split.Instance =
                                        text_item as Text.Split.Instance;
                                    const text_split_end_unit_index: Index =
                                        text_split.End_Unit_Index();
                                    if (last_part_end_unit_index <= text_split_end_unit_index) {
                                        this.Segment_At(segment_index).Item_At(item_index).Highlight(
                                            {
                                                first_unit_index:
                                                    0,
                                                end_unit_index:
                                                    last_part_end_unit_index - text_split.First_Unit_Index(),
                                            },
                                        );
                                        break;
                                    } else {
                                        this.Segment_At(segment_index).Item_At(item_index).Highlight(
                                            {
                                                first_unit_index:
                                                    0,
                                                end_unit_index:
                                                    text_split.Value().length,
                                            },
                                        );
                                    }
                                }
                            }
                        } else {
                            for (
                                let segment_item_idx = 0, segment_item_end = segment_item_indices.length;
                                segment_item_idx < segment_item_end;
                                segment_item_idx += 1
                            ) {
                                const {
                                    segment_index,
                                    item_index,
                                }: Text.Line.Segment_Item_Index =
                                    segment_item_indices[segment_item_idx];
                                const text_segment: Text.Segment.Instance =
                                    result.Line().Macro_Segment(segment_index, LINE_PATH_TYPE);
                                const text_item: Text.Item.Instance =
                                    text_segment.Item(item_index);
                                this.Segment_At(segment_index).Item_At(item_index).Highlight(
                                    {
                                        first_unit_index:
                                            0,
                                        end_unit_index:
                                            text_item.Value().length,
                                    },
                                );
                            }
                        }
                    }
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

    Has_Result():
        boolean
    {
        return this.result != null;
    }

    Result():
        Search.Result.Instance
    {
        Utils.Assert(
            this.Has_Result(),
            `Doesn't have result.`,
        );

        return this.result as Search.Result.Instance;
    }

    Value():
        Text.Value
    {
        return this.Result().Line().Value(LINE_PATH_TYPE);
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
        return this.result == null;
    }

    Is_New_Line():
        boolean
    {
        return this.Result().Line().Value(LINE_PATH_TYPE) === ``;
    }

    Is_Centered():
        boolean
    {
        return this.Result().Line().Is_Centered(LINE_PATH_TYPE);
    }

    Is_Padded():
        boolean
    {
        return this.Result().Line().Is_Padded(LINE_PATH_TYPE);
    }

    Padding_Count():
        Count
    {
        if (this.Has_Result()) {
            return this.Result().Line().Padding_Count(LINE_PATH_TYPE);
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
    }
}
