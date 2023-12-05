import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Text from "../../text.js";
import * as Search from "../../search.js";

import * as Text_Base from "../text_base.js";
import * as Buffer from "./instance.js";
import * as Line from "./line.js";
import * as Column from "./column.js";
import * as Segment from "./segment.js";

export class Instance extends Text_Base.Row.Instance<
    Buffer.Instance,
    Line.Instance,
    Column.Instance,
    Segment.Instance
>
{
    constructor(
        {
            column,
            index,
            text,
        }: {
            column: Column.Instance,
            index: Index,
            text: Text.Row.Instance | null,
        },
    )
    {
        super(
            {
                column: column,
                index: index,
                text: text,
            },
        );

        if (!this.Is_Blank()) {
            if (this.Text().Value() === ``) {
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
                this.Push_Segment(
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
                    this.Push_Segment(
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
    }

    Blank_Segment(
        segment_index: Index,
    ):
        Segment.Instance
    {
        return new Segment.Instance(
            {
                row: this,
                index: segment_index,
                text: null,
            },
        );
    }

    Result():
        Search.Result.Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `row is blank.`,
        );

        return this.Column().Result();
    }
}
