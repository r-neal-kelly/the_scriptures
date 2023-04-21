import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Text from "../../text.js";
import * as Search from "../../search.js";
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

            if (result.Line().Value() === ``) {
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
                for (let idx = 0, end = result.Line().Macro_Segment_Count(); idx < end; idx += 1) {
                    this.segments.push(
                        new Segment.Instance(
                            {
                                line: this,
                                index: idx,
                                text: result.Line().Macro_Segment(idx),
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
                    const last_part_index: Index =
                        match.Last_Part_Index();

                    // Each item in each segment can at most be made into
                    // three divisions of highlight and non-highlights.
                    // Most of the time it should just be one division,
                    // but if it's a highlight at the end of an item,
                    // then it needs to be split in two, and likewise
                    // for when the highlight is as the front of an item.
                    // On occasion a highlight will be in the middle of
                    // an item, in which case there needs to be two
                    // non-highlights on either side. I think that should
                    // be sufficient. Keep in mind that the matches
                    // give the unit and not the point indices for these things.
                    // They naturally fall on the unicode point boundaries, but
                    // it need to be kept in mind.

                    {
                        const first_part_first_Unit_index: Index =
                            match.First_Part_First_Unit_Index();
                        const first_segment_item_indices: Array<Text.Line.Segment_Item_Index> =
                            result.Line().Macro_Part_Segment_Item_Indices(first_part_index);
                        for (
                            let segment_item_idx = 0, segment_item_end = first_segment_item_indices.length;
                            segment_item_idx < segment_item_end;
                            segment_item_idx += 1
                        ) {
                            const {
                                segment_index,
                                item_index,
                            }: Text.Line.Segment_Item_Index =
                                first_segment_item_indices[segment_item_idx];

                        }
                    }

                    for (
                        let part_idx = first_part_index + 1, part_end = last_part_index;
                        part_idx < part_end;
                        part_idx += 1
                    ) {
                        const segment_item_indices: Array<Text.Line.Segment_Item_Index> =
                            result.Line().Macro_Part_Segment_Item_Indices(part_idx);
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
                            // Highlight whole item.
                        }
                    }

                    {
                        const last_part_end_Unit_index: Index =
                            match.Last_Part_End_Unit_Index();
                        const last_segment_item_indices: Array<Text.Line.Segment_Item_Index> =
                            result.Line().Macro_Part_Segment_Item_Indices(last_part_index);
                        for (
                            let segment_item_idx = 0, segment_item_end = last_segment_item_indices.length;
                            segment_item_idx < segment_item_end;
                            segment_item_idx += 1
                        ) {
                            const {
                                segment_index,
                                item_index,
                            }: Text.Line.Segment_Item_Index =
                                last_segment_item_indices[segment_item_idx];
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

    Result():
        Search.Result.Instance
    {
        Utils.Assert(
            this.result != null,
            `Doesn't have result.`,
        );

        return this.result as Search.Result.Instance;
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
        return this.Result().Line().Value() === ``;
    }
}
