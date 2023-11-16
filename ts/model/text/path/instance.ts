import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import { Value } from "../value.js";
import * as Item from "../item.js";
import * as Part from "../part.js";
import * as Split from "../split.js";
import * as Segment from "../segment.js";

import { Type } from "./type.js";

type Part_Index_To_Segment_Item_Indices = {
    [part_index: Index]: Array<Segment.Item_Index>,
};

export class Instance
{
    private type: Type;
    private value: Value; // we maybe shouldn't store this, but simply construct it on demand. the items themselves ensure that the original source string is kept in memory, because they are slices.

    private is_centered: boolean;
    private padding_count: Count;

    private micro_parts: Array<Part.Instance>;
    private macro_parts: Array<Part.Instance>;

    private micro_segments: Array<Segment.Instance>;
    private macro_segments: Array<Segment.Instance>;

    private micro_part_index_to_segment_item_indices: Part_Index_To_Segment_Item_Indices;
    private macro_part_index_to_segment_item_indices: Part_Index_To_Segment_Item_Indices;

    private working_micro_segment: Segment.Instance;
    private working_macro_segment: Segment.Instance;

    constructor(
        {
            type,
            value,
        }: {
            type: Type,
            value: Value,
        },
    )
    {
        this.type = type;
        this.value = value;

        this.is_centered = Part.Command.Is_Centered(this.value);
        this.padding_count = Part.Command.Padding_Count(this.value);

        this.micro_parts = [];
        this.macro_parts = [];

        this.micro_segments = [];
        this.macro_segments = [];

        this.micro_part_index_to_segment_item_indices = {};
        this.macro_part_index_to_segment_item_indices = {};

        this.working_micro_segment = new Segment.Instance(
            {
                segment_type: Segment.Type.MICRO,
                index: this.micro_segments.length,
            },
        );
        this.working_macro_segment = new Segment.Instance(
            {
                segment_type: Segment.Type.MACRO,
                index: this.macro_segments.length,
            },
        );
    }

    Update_Micro(
        micro_part: Part.Instance,
    ):
        void
    {
        this.micro_parts.push(micro_part);
        this.Update_Micro_Segments(micro_part);
    }

    Update_Macro(
        macro_part: Part.Instance,
    ):
        void
    {
        this.macro_parts.push(macro_part);
        if (macro_part.Is_Command()) {
            const command: Part.Command.Instance = macro_part as Part.Command.Instance;
            if (command.Is_Open_Left_To_Right()) {
                this.Update_Macro_Segments(command);
                this.macro_segments.push(this.working_macro_segment);
                this.working_macro_segment = new Segment.Instance(
                    {
                        segment_type: Segment.Type.MACRO_LEFT_TO_RIGHT,
                        index: this.macro_segments.length,
                    },
                );
            } else if (command.Is_Open_Right_To_Left()) {
                this.Update_Macro_Segments(command);
                this.macro_segments.push(this.working_macro_segment);
                this.working_macro_segment = new Segment.Instance(
                    {
                        segment_type: Segment.Type.MACRO_RIGHT_TO_LEFT,
                        index: this.macro_segments.length,
                    },
                );
            } else if (command.Is_Close_Left_To_Right() || command.Is_Close_Right_To_Left()) {
                this.macro_segments.push(this.working_macro_segment);
                this.working_macro_segment = new Segment.Instance(
                    {
                        segment_type: Segment.Type.MACRO,
                        index: this.macro_segments.length,
                    },
                );
                this.Update_Macro_Segments(command);
            } else {
                this.Update_Macro_Segments(command);
            }
        } else if (macro_part.Is_Break()) {
            const splits: Array<Split.Instance> = Split.From(macro_part as Part.Break.Instance);
            for (const split of splits) {
                this.Update_Macro_Segments(split);
            }
        } else {
            this.Update_Macro_Segments(macro_part);
        }
    }

    private Update_Micro_Segments(
        item: Item.Instance,
    ):
        void
    {
        if (!this.working_micro_segment.Try_Add_Item(item)) {
            this.micro_segments.push(this.working_micro_segment);
            this.working_micro_segment = new Segment.Instance(
                {
                    segment_type: Segment.Type.MICRO,
                    index: this.micro_segments.length,
                },
            );
            this.working_micro_segment.Add_Item(item);
        }

        const part_index: Index = item.Part_Index();
        const segment_item_index: Segment.Item_Index = {
            segment_index: this.working_micro_segment.Index(),
            item_index: this.working_micro_segment.Item_Count() - 1,
        };
        Object.freeze(segment_item_index);
        if (this.micro_part_index_to_segment_item_indices[part_index] == null) {
            this.micro_part_index_to_segment_item_indices[part_index] = [];
        }
        this.micro_part_index_to_segment_item_indices[part_index].push(segment_item_index);
    }

    private Update_Macro_Segments(
        item: Item.Instance,
    ):
        void
    {
        if (!this.working_macro_segment.Try_Add_Item(item)) {
            this.macro_segments.push(this.working_macro_segment);
            this.working_macro_segment = new Segment.Instance(
                {
                    segment_type: Segment.Type.MACRO,
                    index: this.macro_segments.length,
                },
            );
            this.working_macro_segment.Add_Item(item);
        }

        const part_index: Index = item.Part_Index();
        const segment_item_index: Segment.Item_Index = {
            segment_index: this.working_macro_segment.Index(),
            item_index: this.working_macro_segment.Item_Count() - 1,
        };
        Object.freeze(segment_item_index);
        if (this.macro_part_index_to_segment_item_indices[part_index] == null) {
            this.macro_part_index_to_segment_item_indices[part_index] = [];
        }
        this.macro_part_index_to_segment_item_indices[part_index].push(segment_item_index);
    }

    Finalize():
        void
    {
        if (this.working_micro_segment.Item_Count() > 0) {
            this.micro_segments.push(this.working_micro_segment);
            this.working_micro_segment = new Segment.Instance(
                {
                    segment_type: Segment.Type.MICRO,
                    index: 0,
                },
            );
        }
        Object.freeze(this.micro_parts);
        Object.freeze(this.micro_segments);
        Object.freeze(this.micro_part_index_to_segment_item_indices);
        Object.freeze(this.working_micro_segment);

        if (this.working_macro_segment.Item_Count() > 0) {
            this.macro_segments.push(this.working_macro_segment);
            this.working_macro_segment = new Segment.Instance(
                {
                    segment_type: Segment.Type.MACRO,
                    index: 0,
                },
            );
        }
        Object.freeze(this.macro_parts);
        Object.freeze(this.macro_segments);
        Object.freeze(this.macro_part_index_to_segment_item_indices);
        Object.freeze(this.working_macro_segment);
    }

    Type():
        Type
    {
        return this.type;
    }

    Value():
        Value
    {
        return this.value;
    }

    Is_Centered():
        boolean
    {
        return this.is_centered;
    }

    Is_Padded():
        boolean
    {
        return this.padding_count > 0;
    }

    Padding_Count():
        Count
    {
        return this.padding_count;
    }

    Has_Micro_Part(
        micro_part_index: Index,
    ):
        boolean
    {
        Utils.Assert(
            micro_part_index > -1,
            `micro_part_index must be greater than -1.`,
        );

        return micro_part_index < this.Micro_Part_Count();
    }

    Micro_Part_Count():
        Count
    {
        return this.micro_parts.length;
    }

    Micro_Part(
        micro_part_index: Index,
    ):
        Part.Instance
    {
        Utils.Assert(
            this.Has_Micro_Part(micro_part_index),
            `Does not have micro_part at index ${micro_part_index}.`,
        );

        return this.micro_parts[micro_part_index];
    }

    Has_Macro_Part(
        macro_part_index: Index,
    ):
        boolean
    {
        Utils.Assert(
            macro_part_index > -1,
            `macro_part_index must be greater than -1.`,
        );

        return macro_part_index < this.Macro_Part_Count();
    }

    Macro_Part_Count():
        Count
    {
        return this.macro_parts.length;
    }

    Macro_Part(
        macro_part_index: Index,
    ):
        Part.Instance
    {
        Utils.Assert(
            this.Has_Macro_Part(macro_part_index),
            `Does not have macro_part at index ${macro_part_index}.`,
        );

        return this.macro_parts[macro_part_index];
    }

    Micro_Segment_Count():
        Count
    {
        return this.micro_segments.length;
    }

    Micro_Segment(
        micro_segment_index: Index,
    ):
        Segment.Instance
    {
        Utils.Assert(
            micro_segment_index > -1,
            `micro_segment_index must be greater than -1.`,
        );
        Utils.Assert(
            micro_segment_index < this.Micro_Segment_Count(),
            `micro_segment_index must be less than micro_segment_count.`,
        );

        return this.micro_segments[micro_segment_index];
    }

    Micro_Part_Segment_Item_Indices(
        micro_part_index: Index,
    ):
        Array<Segment.Item_Index>
    {
        Utils.Assert(
            this.micro_part_index_to_segment_item_indices.hasOwnProperty(micro_part_index),
            `Invalid index: ${micro_part_index}.`,
        );

        const segment_item_indices: Array<Segment.Item_Index> =
            this.micro_part_index_to_segment_item_indices[micro_part_index];
        if (!Object.isFrozen(segment_item_indices)) {
            Object.freeze(segment_item_indices);
        }

        return segment_item_indices;
    }

    Macro_Segment_Count():
        Count
    {
        return this.macro_segments.length;
    }

    Macro_Segment(
        macro_segment_index: Index,
    ):
        Segment.Instance
    {
        Utils.Assert(
            macro_segment_index > -1,
            `macro_segment_index must be greater than -1.`,
        );
        Utils.Assert(
            macro_segment_index < this.Macro_Segment_Count(),
            `macro_segment_index must be less than macro_segment_count.`,
        );

        return this.macro_segments[macro_segment_index];
    }

    Macro_Part_Segment_Item_Indices(
        macro_part_index: Index,
    ):
        Array<Segment.Item_Index>
    {
        Utils.Assert(
            this.macro_part_index_to_segment_item_indices.hasOwnProperty(macro_part_index),
            `Invalid index: ${macro_part_index}.`,
        );

        const segment_item_indices: Array<Segment.Item_Index> =
            this.macro_part_index_to_segment_item_indices[macro_part_index];
        if (!Object.isFrozen(segment_item_indices)) {
            Object.freeze(segment_item_indices);
        }

        return segment_item_indices;
    }
};
