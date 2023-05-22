import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Unicode from "../../unicode.js";

import * as Text from "./instance.js";
import { Value } from "./value.js";
import * as Dictionary from "./dictionary.js";
import * as Item from "./item.js";
import * as Part from "./part.js";
import * as Split from "./split.js";
import * as Segment from "./segment.js";

export type Segment_Item_Index = {
    segment_index: Index,
    item_index: Index,
};

type Part_Index_To_Segment_Item_Indices = {
    [part_index: Index]: Array<Segment_Item_Index>,
};

export class Instance
{
    private text: Text.Instance;
    private index: Index;
    private value: Value;
    private micro_parts: Array<Part.Instance>;
    private macro_parts: Array<Part.Instance>;
    private micro_segments: Array<Segment.Instance>;
    private macro_segments: Array<Segment.Instance>;
    private micro_part_index_to_segment_item_indices: Part_Index_To_Segment_Item_Indices;
    private macro_part_index_to_segment_item_indices: Part_Index_To_Segment_Item_Indices;
    private is_centered: boolean;
    private is_indented: boolean;

    constructor(
        {
            text,
            index,
            value,
        }: {
            text: Text.Instance,
            index: Index,
            value: Value,
        },
    )
    {
        this.text = text;
        this.index = index;
        this.value = ``;
        this.micro_parts = [];
        this.macro_parts = [];
        this.micro_segments = [];
        this.macro_segments = [];
        this.micro_part_index_to_segment_item_indices = {};
        this.macro_part_index_to_segment_item_indices = {};
        this.is_centered = false;
        this.is_indented = false;

        this.Set_Value(value);
    }

    Text():
        Text.Instance
    {
        return this.text;
    }

    Index():
        Index
    {
        return this.index;
    }

    Value():
        Value
    {
        return this.value;
    }

    Set_Value(
        value: Value,
    ):
        void
    {
        Utils.Assert(
            !/\r?\n/.test(value),
            `A line cannot have any line-breaks.`,
        );

        this.value = value;
        this.micro_parts = [];
        this.macro_parts = [];
        this.micro_segments = [];
        this.macro_segments = [];
        this.micro_part_index_to_segment_item_indices = {};
        this.macro_part_index_to_segment_item_indices = {};
        this.is_centered =
            this.value.slice(
                0,
                Part.Command.Known_Value.CENTER.length,
            ) === Part.Command.Known_Value.CENTER;
        this.is_indented =
            this.value.slice(
                0,
                Part.Command.Known_Value.INDENT.length,
            ) === Part.Command.Known_Value.INDENT;

        enum Current_Type
        {
            WORD,
            BREAK,
            POINT,
        }

        const dictionary: Dictionary.Instance = this.Text().Dictionary();

        let current_style: Part.Style = Part.Style._NONE_;
        let current_type: Current_Type = Current_Type.POINT;
        let current_start: Unicode.Iterator = new Unicode.Iterator(
            {
                text: this.value,
            },
        );

        let first_non_command_index: Index | null = null;
        const last_non_command_index: Index | null =
            Part.Command.Last_Non_Value_Index(this.value);

        let current_micro_segment: Segment.Instance = new Segment.Instance(
            {
                segment_type: Segment.Type.MICRO,
                index: this.micro_segments.length,
            },
        );
        let current_macro_segment: Segment.Instance = new Segment.Instance(
            {
                segment_type: Segment.Type.MACRO,
                index: this.macro_segments.length,
            },
        );
        const Update_Micro_Segments: (
            item: Item.Instance,
        ) => void = function (
            this: Instance,
            item: Item.Instance,
        ):
            void
        {
            if (!current_micro_segment.Try_Add_Item(item)) {
                this.micro_segments.push(current_micro_segment);
                current_micro_segment = new Segment.Instance(
                    {
                        segment_type: Segment.Type.MICRO,
                        index: this.micro_segments.length,
                    },
                );
                current_micro_segment.Add_Item(item);
            }
            const part_index: Index = item.Part_Index();
            const segment_item_index: Segment_Item_Index = {
                segment_index: current_micro_segment.Index(),
                item_index: current_micro_segment.Item_Count() - 1,
            };
            Object.freeze(segment_item_index);
            if (this.micro_part_index_to_segment_item_indices[part_index] == null) {
                this.micro_part_index_to_segment_item_indices[part_index] = [];
            }
            this.micro_part_index_to_segment_item_indices[part_index].push(segment_item_index);
        }.bind(this);
        const Update_Macro_Segments: (
            item: Item.Instance,
        ) => void = function (
            this: Instance,
            item: Item.Instance,
        ):
            void
        {
            if (!current_macro_segment.Try_Add_Item(item)) {
                this.macro_segments.push(current_macro_segment);
                current_macro_segment = new Segment.Instance(
                    {
                        segment_type: Segment.Type.MACRO,
                        index: this.macro_segments.length,
                    },
                );
                current_macro_segment.Add_Item(item);
            }
            const part_index: Index = item.Part_Index();
            const segment_item_index: Segment_Item_Index = {
                segment_index: current_macro_segment.Index(),
                item_index: current_macro_segment.Item_Count() - 1,
            };
            Object.freeze(segment_item_index);
            if (this.macro_part_index_to_segment_item_indices[part_index] == null) {
                this.macro_part_index_to_segment_item_indices[part_index] = [];
            }
            this.macro_part_index_to_segment_item_indices[part_index].push(segment_item_index);
        }.bind(this);
        const Update_Macro_Segments_With_Command: (
            command: Part.Command.Instance,
        ) => void = function (
            this: Instance,
            command: Part.Command.Instance,
        ):
            void
        {
            if (
                command.Value() === Part.Command.Known_Value.OPEN_LEFT_TO_RIGHT
            ) {
                Update_Macro_Segments(command);
                this.macro_segments.push(current_macro_segment);
                current_macro_segment = new Segment.Instance(
                    {
                        segment_type: Segment.Type.MACRO_LEFT_TO_RIGHT,
                        index: this.macro_segments.length,
                    },
                );
            } else if (
                command.Value() === Part.Command.Known_Value.OPEN_RIGHT_TO_LEFT
            ) {
                Update_Macro_Segments(command);
                this.macro_segments.push(current_macro_segment);
                current_macro_segment = new Segment.Instance(
                    {
                        segment_type: Segment.Type.MACRO_RIGHT_TO_LEFT,
                        index: this.macro_segments.length,
                    },
                );
            } else if (
                command.Value() === Part.Command.Known_Value.CLOSE_LEFT_TO_RIGHT ||
                command.Value() === Part.Command.Known_Value.CLOSE_RIGHT_TO_LEFT
            ) {
                this.macro_segments.push(current_macro_segment);
                current_macro_segment = new Segment.Instance(
                    {
                        segment_type: Segment.Type.MACRO,
                        index: this.macro_segments.length,
                    },
                );
                Update_Macro_Segments(command);
            } else {
                Update_Macro_Segments(command);
            }
        }.bind(this);

        for (let it = current_start; !it.Is_At_End();) {
            const maybe_valid_command: Value | null =
                Part.Command.Maybe_Valid_Value_From(it.Points());

            if (maybe_valid_command != null) {
                const micro_command: Part.Command.Instance = new Part.Command.Instance(
                    {
                        index: this.micro_parts.length,
                        value: maybe_valid_command,
                    },
                );
                const macro_command: Part.Command.Instance = new Part.Command.Instance(
                    {
                        index: this.macro_parts.length,
                        value: maybe_valid_command,
                    },
                );
                if (macro_command.Is_Open_Italic()) {
                    current_style |= Part.Style.ITALIC;
                } else if (macro_command.Is_Close_Italic()) {
                    current_style &= ~Part.Style.ITALIC;

                } else if (macro_command.Is_Open_Bold()) {
                    current_style |= Part.Style.BOLD;
                } else if (macro_command.Is_Close_Bold()) {
                    current_style &= ~Part.Style.BOLD;

                } else if (macro_command.Is_Open_Underline()) {
                    current_style |= Part.Style.UNDERLINE;
                } else if (macro_command.Is_Close_Underline()) {
                    current_style &= ~Part.Style.UNDERLINE;

                } else if (macro_command.Is_Open_Small_Caps()) {
                    current_style |= Part.Style.SMALL_CAPS;
                } else if (macro_command.Is_Close_Small_Caps()) {
                    current_style &= ~Part.Style.SMALL_CAPS;

                } else if (macro_command.Is_Open_Error()) {
                    current_style |= Part.Style.ERROR;
                } else if (macro_command.Is_Close_Error()) {
                    current_style &= ~Part.Style.ERROR;
                }

                this.micro_parts.push(micro_command);
                this.macro_parts.push(macro_command);
                Update_Micro_Segments(micro_command);
                Update_Macro_Segments_With_Command(macro_command);

                it = new Unicode.Iterator(
                    {
                        text: it.Text(),
                        index: it.Index() + maybe_valid_command.length,
                    },
                );

                current_start = it;
            } else {
                const this_point: Value = it.Point();
                const next_point: Value | null = it.Look_Forward_Point();
                const next_maybe_valid_command: Value | null = Part.Command.Maybe_Valid_Value_From(
                    it.Look_Forward_Points() || ``,
                );

                if (dictionary.Has_Letter(this_point)) {
                    const point: Part.Letter.Instance = new Part.Letter.Instance(
                        {
                            index: this.micro_parts.length,
                            value: this_point,
                            style: current_style,
                        },
                    );

                    this.micro_parts.push(point);
                    Update_Micro_Segments(point);

                    current_type = Current_Type.WORD;
                } else if (dictionary.Has_Marker(this_point)) {
                    const point: Part.Marker.Instance = new Part.Marker.Instance(
                        {
                            index: this.micro_parts.length,
                            value: this_point,
                            style: current_style,
                        },
                    );

                    this.micro_parts.push(point);
                    Update_Micro_Segments(point);

                    current_type = Current_Type.BREAK;
                } else {
                    const micro_point: Part.Point.Instance = new Part.Point.Instance(
                        {
                            index: this.micro_parts.length,
                            value: this_point,
                            style: current_style,
                        },
                    );
                    const macro_point: Part.Point.Instance = new Part.Point.Instance(
                        {
                            index: this.macro_parts.length,
                            value: this_point,
                            style: current_style,
                        },
                    );

                    this.micro_parts.push(micro_point);
                    Update_Micro_Segments(micro_point);

                    current_type = Current_Type.POINT;

                    if (first_non_command_index == null) {
                        first_non_command_index = it.Index();
                    }

                    this.macro_parts.push(macro_point);
                    Update_Macro_Segments(macro_point);

                    current_start = it.Next();
                }

                if (current_type === Current_Type.WORD) {
                    if (
                        next_point == null ||
                        next_maybe_valid_command != null ||
                        !dictionary.Has_Letter(next_point)
                    ) {
                        if (first_non_command_index == null) {
                            first_non_command_index = it.Index();
                        }

                        const word: Value = it.Text().slice(
                            current_start.Index(),
                            it.Look_Forward_Index(),
                        );
                        const status: Part.Status = dictionary.Has_Word(word) ?
                            Part.Status.GOOD :
                            dictionary.Has_Word_Error(word) ?
                                Part.Status.ERROR :
                                Part.Status.UNKNOWN;

                        const part: Part.Word.Instance = new Part.Word.Instance(
                            {
                                index: this.macro_parts.length,
                                value: word,
                                status: status,
                                style: current_style,
                            },
                        );

                        this.macro_parts.push(part);
                        Update_Macro_Segments(part);

                        current_start = it.Next();
                    }
                } else if (current_type === Current_Type.BREAK) {
                    if (
                        next_point == null ||
                        next_maybe_valid_command != null ||
                        !dictionary.Has_Marker(next_point)
                    ) {
                        if (first_non_command_index == null) {
                            first_non_command_index = it.Index();
                        }

                        const break_: Value = it.Text().slice(
                            current_start.Index(),
                            it.Look_Forward_Index(),
                        );
                        const boundary: Dictionary.Boundary = it.Index() === first_non_command_index ?
                            Dictionary.Boundary.START :
                            it.Index() === last_non_command_index ?
                                Dictionary.Boundary.END :
                                Dictionary.Boundary.MIDDLE;
                        const status: Part.Status = dictionary.Has_Break(break_, boundary) ?
                            Part.Status.GOOD :
                            dictionary.Has_Break_Error(break_, boundary) ?
                                Part.Status.ERROR :
                                Part.Status.UNKNOWN;

                        const part: Part.Break.Instance = new Part.Break.Instance(
                            {
                                index: this.macro_parts.length,
                                value: break_,
                                status: status,
                                style: current_style,
                            },
                        );

                        this.macro_parts.push(part);
                        const splits: Array<Split.Instance> = Split.From(part);
                        for (const split of splits) {
                            Update_Macro_Segments(split);
                        }

                        current_start = it.Next();
                    }
                }

                it = it.Next();
            }
        }

        if (current_micro_segment.Item_Count() > 0) {
            this.micro_segments.push(current_micro_segment);
        }
        if (current_macro_segment.Item_Count() > 0) {
            this.macro_segments.push(current_macro_segment);
        }
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

    Micro_Part_Segment_Item_Indices(
        micro_part_index: Index,
    ):
        Array<Segment_Item_Index>
    {
        Utils.Assert(
            this.Has_Micro_Part(micro_part_index),
            `Does not have micro_part at index ${micro_part_index}.`,
        );

        const segment_item_indices: Array<Segment_Item_Index> =
            this.micro_part_index_to_segment_item_indices[micro_part_index];
        if (!Object.isFrozen(segment_item_indices)) {
            Object.freeze(segment_item_indices);
        }

        return segment_item_indices;
    }

    Macro_Part_Segment_Item_Indices(
        macro_part_index: Index,
    ):
        Array<Segment_Item_Index>
    {
        Utils.Assert(
            this.Has_Macro_Part(macro_part_index),
            `Does not have macro_part at index ${macro_part_index}.`,
        );

        const segment_item_indices: Array<Segment_Item_Index> =
            this.macro_part_index_to_segment_item_indices[macro_part_index];
        if (!Object.isFrozen(segment_item_indices)) {
            Object.freeze(segment_item_indices);
        }

        return segment_item_indices;
    }

    Is_Centered():
        boolean
    {
        return this.is_centered;
    }

    Is_Indented():
        boolean
    {
        return this.is_indented;
    }
}
