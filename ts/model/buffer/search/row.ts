import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Language from "../../language.js";
import * as Text from "../../text.js";
import * as Search from "../../search.js";
import * as Column from "./column.js";
import * as Segment from "./segment.js";

export class Instance extends Entity.Instance
{
    private static min_segment_count: Count = 70;

    private static blank_segment: Segment.Instance = new Segment.Instance(
        {
            row: null,
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

    private column: Column.Instance | null;
    private index: Index | null;
    private segments: Array<Segment.Instance>;

    constructor(
        {
            column,
            index,
        }: {
            column: Column.Instance | null,
            index: Index | null,
        },
    )
    {
        super();

        this.column = column;
        this.index = index;
        this.segments = [];

        if (column == null) {
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
        } else {
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );

            if (this.Value() === ``) {
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
                            row: this,
                            index: 0,
                            text: segment,
                        },
                    ),
                );
            } else {
                const text: Text.Row.Instance = this.Text();
                for (let idx = 0, end = text.Macro_Segment_Count(); idx < end; idx += 1) {
                    this.segments.push(
                        new Segment.Instance(
                            {
                                row: this,
                                index: idx,
                                text: text.Macro_Segment(idx),
                            },
                        ),
                    );
                }

                const result: Search.Result.Instance = this.Result();
                const column_index: Index = this.Column().Index();
                const row_index: Index = this.Index();
                for (
                    let match_idx = 0, match_end = result.Match_Count(column_index, row_index);
                    match_idx < match_end;
                    match_idx += 1
                ) {
                    const match: Search.Result.Match =
                        result.Match(column_index, row_index, match_idx);
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
                        const segment_item_indices: Array<Text.Segment.Item_Index> =
                            text.Macro_Part_Segment_Item_Indices(part_idx);
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
                                }: Text.Segment.Item_Index =
                                    segment_item_indices[segment_item_idx];
                                const text_segment: Text.Segment.Instance =
                                    text.Macro_Segment(segment_index);
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
                                }: Text.Segment.Item_Index =
                                    segment_item_indices[segment_item_idx];
                                const text_segment: Text.Segment.Instance =
                                    text.Macro_Segment(segment_index);
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
                                }: Text.Segment.Item_Index =
                                    segment_item_indices[segment_item_idx];
                                const text_segment: Text.Segment.Instance =
                                    text.Macro_Segment(segment_index);
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
                                }: Text.Segment.Item_Index =
                                    segment_item_indices[segment_item_idx];
                                const text_segment: Text.Segment.Instance =
                                    text.Macro_Segment(segment_index);
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

    Has_Column():
        boolean
    {
        return this.column != null;
    }

    Column():
        Column.Instance
    {
        Utils.Assert(
            this.Has_Column(),
            `Doesn't have column.`,
        );

        return this.column as Column.Instance;
    }

    Has_Index():
        boolean
    {
        return this.index != null;
    }

    Index():
        Index
    {
        Utils.Assert(
            this.Has_Index(),
            `Doesn't have an index.`,
        );

        return this.index as Index;
    }

    Has_Text():
        boolean
    {
        return !this.Is_Blank();
    }

    Text():
        Text.Row.Instance
    {
        Utils.Assert(
            this.Has_Text(),
            `Doesn't have text.`,
        );

        return this.Column().Text().Row(this.Index());
    }

    Has_Result():
        boolean
    {
        return !this.Is_Blank();
    }

    Result():
        Search.Result.Instance
    {
        Utils.Assert(
            this.Has_Result(),
            `Doesn't have result.`,
        );

        return this.Column().Result();
    }

    Has_Value():
        boolean
    {
        return !this.Is_Blank();
    }

    Value():
        Text.Value
    {
        Utils.Assert(
            this.Has_Value(),
            `Doesn't have value.`,
        );

        return this.Text().Value();
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
        return !this.Has_Column();
    }

    Is_New_Line():
        boolean
    {
        return this.Value() === ``;
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
        return this.Column().Line().Buffer().Default_Language_Direction();
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
                    `${this.Column().Line().Buffer().Pad_EM(this.Padding_Count())}em`;
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
