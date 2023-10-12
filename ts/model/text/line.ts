import { Integer } from "../../types.js";
import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Unicode from "../../unicode.js";

import * as Language from "../language.js";
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

export enum Path_Type
{
    DEFAULT,
    ERRORLESS,
};

class Path
{
    private value: Value;

    private is_centered: boolean;
    private is_indented: boolean;

    private micro_parts: Array<Part.Instance>;
    private macro_parts: Array<Part.Instance>;

    private micro_segments: Array<Segment.Instance>;
    private macro_segments: Array<Segment.Instance>;

    private micro_part_index_to_segment_item_indices: Part_Index_To_Segment_Item_Indices;
    private macro_part_index_to_segment_item_indices: Part_Index_To_Segment_Item_Indices;

    private working_micro_segment: Segment.Instance;
    private working_macro_segment: Segment.Instance;

    constructor(
        value: Value,
    )
    {
        this.value = value;

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
            this.Update_Macro_Segments_With_Command(macro_part as Part.Command.Instance);
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
        const segment_item_index: Segment_Item_Index = {
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
        const segment_item_index: Segment_Item_Index = {
            segment_index: this.working_macro_segment.Index(),
            item_index: this.working_macro_segment.Item_Count() - 1,
        };
        Object.freeze(segment_item_index);
        if (this.macro_part_index_to_segment_item_indices[part_index] == null) {
            this.macro_part_index_to_segment_item_indices[part_index] = [];
        }
        this.macro_part_index_to_segment_item_indices[part_index].push(segment_item_index);
    }

    private Update_Macro_Segments_With_Command(
        command: Part.Command.Instance,
    ):
        void
    {
        if (
            command.Value() === Part.Command.Known_Value.OPEN_LEFT_TO_RIGHT
        ) {
            this.Update_Macro_Segments(command);
            this.macro_segments.push(this.working_macro_segment);
            this.working_macro_segment = new Segment.Instance(
                {
                    segment_type: Segment.Type.MACRO_LEFT_TO_RIGHT,
                    index: this.macro_segments.length,
                },
            );
        } else if (
            command.Value() === Part.Command.Known_Value.OPEN_RIGHT_TO_LEFT
        ) {
            this.Update_Macro_Segments(command);
            this.macro_segments.push(this.working_macro_segment);
            this.working_macro_segment = new Segment.Instance(
                {
                    segment_type: Segment.Type.MACRO_RIGHT_TO_LEFT,
                    index: this.macro_segments.length,
                },
            );
        } else if (
            command.Value() === Part.Command.Known_Value.CLOSE_LEFT_TO_RIGHT ||
            command.Value() === Part.Command.Known_Value.CLOSE_RIGHT_TO_LEFT
        ) {
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

    Is_Indented():
        boolean
    {
        return this.is_indented;
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
        Array<Segment_Item_Index>
    {
        Utils.Assert(
            this.micro_part_index_to_segment_item_indices.hasOwnProperty(micro_part_index),
            `Invalid index: ${micro_part_index}.`,
        );

        const segment_item_indices: Array<Segment_Item_Index> =
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
        Array<Segment_Item_Index>
    {
        Utils.Assert(
            this.macro_part_index_to_segment_item_indices.hasOwnProperty(macro_part_index),
            `Invalid index: ${macro_part_index}.`,
        );

        const segment_item_indices: Array<Segment_Item_Index> =
            this.macro_part_index_to_segment_item_indices[macro_part_index];
        if (!Object.isFrozen(segment_item_indices)) {
            Object.freeze(segment_item_indices);
        }

        return segment_item_indices;
    }
};

export class Instance
{
    private text: Text.Instance;
    private index: Index;
    private paths: { [path_type: Integer]: Path };
    private has_errorless_path: boolean;

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
        this.paths = {};
        this.has_errorless_path = false;

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

    Value(
        path_type: Path_Type,
    ):
        Value
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path_Type.DEFAULT;
        }

        return this.paths[path_type].Value();
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

        this.paths = {};
        this.has_errorless_path = false;

        this.Set_Path(Path_Type.DEFAULT, value);
        if (this.has_errorless_path) {
            this.Set_Path(Path_Type.ERRORLESS, Part.Command.Resolve_Errors(value, false));
        }
    }

    Is_Centered(
        path_type: Path_Type,
    ):
        boolean
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path_Type.DEFAULT;
        }

        return this.paths[path_type].Is_Centered();
    }

    Is_Indented(
        path_type: Path_Type,
    ):
        boolean
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path_Type.DEFAULT;
        }

        return this.paths[path_type].Is_Indented();
    }

    private Set_Path(
        path_type: Path_Type,
        value: Value,
    ):
        void
    {
        enum Current_Type
        {
            WORD,
            BREAK,
            POINT,
        }

        const dictionary: Dictionary.Instance = this.Text().Dictionary();

        this.paths[path_type] = new Path(value);

        let current_style: Part.Style = Part.Style._NONE_;
        let current_language: Array<Language.Name> = [];
        let current_type: Current_Type = Current_Type.POINT;
        let current_start: Unicode.Iterator = new Unicode.Iterator(
            {
                text: this.paths[path_type].Value(),
            },
        );

        const first_non_command_index: Index | null =
            Part.Command.First_Non_Command_Index(this.paths[path_type].Value());
        const last_non_command_index: Index | null =
            Part.Command.Last_Non_Command_Index(this.paths[path_type].Value());

        class Error_Argument_Frame
        {
            private first_non_command_index: Index | null;
            private last_non_command_index: Index | null;
            private closing_command_index: Index;

            constructor(
                {
                    parameter,
                    argument,
                    from_text,
                    from_text_index,
                }: {
                    parameter: Value,
                    argument: Value,
                    from_text: Value,
                    from_text_index: Index,
                }
            )
            {
                this.first_non_command_index =
                    Part.Command.First_Non_Command_Index(argument);
                if (this.first_non_command_index != null) {
                    this.first_non_command_index =
                        from_text_index +
                        Part.Command.Symbol.FIRST.length +
                        parameter.length +
                        Part.Command.Symbol.DIVIDER.length +
                        this.first_non_command_index;
                }

                this.last_non_command_index =
                    Part.Command.Last_Non_Command_Index(argument);
                if (this.last_non_command_index != null) {
                    this.last_non_command_index =
                        from_text_index +
                        Part.Command.Symbol.FIRST.length +
                        parameter.length +
                        Part.Command.Symbol.DIVIDER.length +
                        this.last_non_command_index;
                }

                this.closing_command_index =
                    Part.Command.Closing_Command_Index_From_Opening_Command(from_text) || -1;
                if (this.closing_command_index !== -1) {
                    this.closing_command_index =
                        from_text_index +
                        this.closing_command_index;
                } else {
                    this.closing_command_index = from_text_index + from_text.length;
                }
            }

            First_Non_Command_Index():
                Index | null
            {
                return this.first_non_command_index;
            }

            Last_Non_Command_Index():
                Index | null
            {
                return this.last_non_command_index;
            }

            Closing_Command_Index():
                Index
            {
                return this.closing_command_index;
            }
        };
        const error_argument_stack: Array<Error_Argument_Frame> = [];

        function Break_Boundary(
            first: Unicode.Iterator,
            last: Unicode.Iterator,
        ):
            Dictionary.Boundary
        {
            if (error_argument_stack.length > 0) {
                const error_argument_frame: Error_Argument_Frame =
                    error_argument_stack[error_argument_stack.length - 1];
                if (
                    first.Index() === error_argument_frame.First_Non_Command_Index() &&
                    (
                        first_non_command_index != null ?
                            last.Index() < first_non_command_index :
                            true
                    )
                ) {
                    return Dictionary.Boundary.START;
                } else if (
                    last.Index() === error_argument_frame.Last_Non_Command_Index() &&
                    (
                        last_non_command_index != null ?
                            error_argument_frame.Closing_Command_Index() > last_non_command_index :
                            true
                    )
                ) {
                    return Dictionary.Boundary.END;
                } else {
                    return Dictionary.Boundary.MIDDLE;
                }
            } else {
                if (first.Index() === first_non_command_index) {
                    return Dictionary.Boundary.START;
                } else if (last.Index() === last_non_command_index) {
                    return Dictionary.Boundary.END;
                } else {
                    return Dictionary.Boundary.MIDDLE;
                }
            }
        }

        for (let it = current_start; !it.Is_At_End();) {
            const maybe_valid_command_value: Value | null =
                Part.Command.Maybe_Valid_Value_From(it.Points());

            if (maybe_valid_command_value != null) {
                let micro_command: Part.Command.Instance = new Part.Command.Instance(
                    {
                        index: this.paths[path_type].Micro_Part_Count(),
                        value: maybe_valid_command_value,
                    },
                );
                let macro_command: Part.Command.Instance = new Part.Command.Instance(
                    {
                        index: this.paths[path_type].Macro_Part_Count(),
                        value: maybe_valid_command_value,
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
                    this.has_errorless_path = true;

                    if (macro_command.Has_Argument()) {
                        const new_value: Value =
                            Part.Command.Symbol.FIRST +
                            macro_command.Some_Parameter() +
                            Part.Command.Symbol.DIVIDER;

                        error_argument_stack.push(
                            new Error_Argument_Frame(
                                {
                                    parameter: macro_command.Some_Parameter(),
                                    argument: macro_command.Some_Argument(),
                                    from_text: it.Points(),
                                    from_text_index: it.Index(),
                                },
                            ),
                        );

                        micro_command = new Part.Command.Instance(
                            {
                                index: this.paths[path_type].Micro_Part_Count(),
                                value: new_value,
                            },
                        );
                        macro_command = new Part.Command.Instance(
                            {
                                index: this.paths[path_type].Macro_Part_Count(),
                                value: new_value,
                            },
                        );
                        micro_command.Set_Status(Part.Status.GOOD);
                        macro_command.Set_Status(Part.Status.GOOD);

                        current_style |= Part.Style.ARGUMENT;
                    } else {
                        current_style |= Part.Style.ERROR;
                    }

                } else if (macro_command.Is_Close_Error()) {
                    current_style &= ~Part.Style.ERROR;

                } else if (macro_command.Is_Open_English()) {
                    current_language.push(Language.Name.ENGLISH);
                } else if (macro_command.Is_Open_Hebrew()) {
                    current_language.push(Language.Name.HEBREW);
                } else if (macro_command.Is_Open_Greek()) {
                    current_language.push(Language.Name.GREEK);
                } else if (macro_command.Is_Open_Latin()) {
                    current_language.push(Language.Name.LATIN);
                } else if (macro_command.Is_Open_German()) {
                    current_language.push(Language.Name.GERMAN);
                } else if (macro_command.Is_Open_French()) {
                    current_language.push(Language.Name.FRENCH);
                } else if (macro_command.Is_Close_Language()) {
                    if (current_language.length > 0) {
                        current_language.pop();
                    }

                }

                this.paths[path_type].Update_Micro(micro_command);
                this.paths[path_type].Update_Macro(macro_command);

                it = new Unicode.Iterator(
                    {
                        text: it.Text(),
                        index: it.Index() + macro_command.Value().length,
                    },
                );

                current_start = it;
            } else if (
                error_argument_stack.length > 0 &&
                it.Point() === Part.Command.Symbol.LAST
            ) {
                error_argument_stack.pop();

                if (error_argument_stack.length === 0) {
                    current_style &= ~Part.Style.ARGUMENT;
                }

                const micro_command: Part.Command.Instance = new Part.Command.Instance(
                    {
                        index: this.paths[path_type].Micro_Part_Count(),
                        value: Part.Command.Symbol.LAST,
                    },
                );
                const macro_command: Part.Command.Instance = new Part.Command.Instance(
                    {
                        index: this.paths[path_type].Macro_Part_Count(),
                        value: Part.Command.Symbol.LAST,
                    },
                );
                micro_command.Set_Status(Part.Status.GOOD);
                macro_command.Set_Status(Part.Status.GOOD);

                current_style |= Part.Style.ERROR;

                this.paths[path_type].Update_Micro(micro_command);
                this.paths[path_type].Update_Macro(macro_command);

                it = it.Next();

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
                            index: this.paths[path_type].Micro_Part_Count(),
                            value: this_point,
                            style: current_style,
                            language: current_language.length > 0 ?
                                current_language[current_language.length - 1] :
                                null,
                        },
                    );

                    this.paths[path_type].Update_Micro(point);

                    current_type = Current_Type.WORD;
                } else if (dictionary.Has_Marker(this_point)) {
                    const point: Part.Marker.Instance = new Part.Marker.Instance(
                        {
                            index: this.paths[path_type].Micro_Part_Count(),
                            value: this_point,
                            style: current_style,
                            language: current_language.length > 0 ?
                                current_language[current_language.length - 1] :
                                null,
                        },
                    );

                    this.paths[path_type].Update_Micro(point);

                    current_type = Current_Type.BREAK;
                } else {
                    const micro_point: Part.Point.Instance = new Part.Point.Instance(
                        {
                            index: this.paths[path_type].Micro_Part_Count(),
                            value: this_point,
                            style: current_style,
                            language: current_language.length > 0 ?
                                current_language[current_language.length - 1] :
                                null,
                        },
                    );
                    const macro_point: Part.Point.Instance = new Part.Point.Instance(
                        {
                            index: this.paths[path_type].Macro_Part_Count(),
                            value: this_point,
                            style: current_style,
                            language: current_language.length > 0 ?
                                current_language[current_language.length - 1] :
                                null,
                        },
                    );

                    this.paths[path_type].Update_Micro(micro_point);

                    current_type = Current_Type.POINT;

                    this.paths[path_type].Update_Macro(macro_point);

                    current_start = it.Next();
                }

                if (current_type === Current_Type.WORD) {
                    if (
                        next_point == null ||
                        next_maybe_valid_command != null ||
                        !dictionary.Has_Letter(next_point)
                    ) {
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
                                index: this.paths[path_type].Macro_Part_Count(),
                                value: word,
                                status: status,
                                style: current_style,
                                language: current_language.length > 0 ?
                                    current_language[current_language.length - 1] :
                                    null,
                            },
                        );

                        this.paths[path_type].Update_Macro(part);

                        current_start = it.Next();
                    }
                } else if (current_type === Current_Type.BREAK) {
                    if (
                        next_point == null ||
                        next_maybe_valid_command != null ||
                        !dictionary.Has_Marker(next_point)
                    ) {
                        const break_: Value = it.Text().slice(
                            current_start.Index(),
                            it.Look_Forward_Index(),
                        );
                        const boundary: Dictionary.Boundary = Break_Boundary(current_start, it);
                        const status: Part.Status = dictionary.Has_Break(break_, boundary) ?
                            Part.Status.GOOD :
                            dictionary.Has_Break_Error(break_, boundary) ?
                                Part.Status.ERROR :
                                Part.Status.UNKNOWN;

                        const part: Part.Break.Instance = new Part.Break.Instance(
                            {
                                index: this.paths[path_type].Macro_Part_Count(),
                                value: break_,
                                status: status,
                                style: current_style,
                                language: current_language.length > 0 ?
                                    current_language[current_language.length - 1] :
                                    null,
                                boundary: boundary,
                            },
                        );

                        this.paths[path_type].Update_Macro(part);

                        current_start = it.Next();
                    }
                }

                it = it.Next();
            }
        }

        this.paths[path_type].Finalize();
    }

    Has_Micro_Part(
        micro_part_index: Index,
        path_type: Path_Type,
    ):
        boolean
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path_Type.DEFAULT;
        }

        return this.paths[path_type].Has_Micro_Part(micro_part_index);
    }

    Micro_Part_Count(
        path_type: Path_Type,
    ):
        Count
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path_Type.DEFAULT;
        }

        return this.paths[path_type].Micro_Part_Count();
    }

    Micro_Part(
        micro_part_index: Index,
        path_type: Path_Type,
    ):
        Part.Instance
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path_Type.DEFAULT;
        }

        return this.paths[path_type].Micro_Part(micro_part_index);
    }

    Has_Macro_Part(
        macro_part_index: Index,
        path_type: Path_Type,
    ):
        boolean
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path_Type.DEFAULT;
        }

        return this.paths[path_type].Has_Macro_Part(macro_part_index);
    }

    Macro_Part_Count(
        path_type: Path_Type,
    ):
        Count
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path_Type.DEFAULT;
        }

        return this.paths[path_type].Macro_Part_Count();
    }

    Macro_Part(
        macro_part_index: Index,
        path_type: Path_Type,
    ):
        Part.Instance
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path_Type.DEFAULT;
        }

        return this.paths[path_type].Macro_Part(macro_part_index);
    }

    Micro_Segment_Count(
        path_type: Path_Type,
    ):
        Count
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path_Type.DEFAULT;
        }

        return this.paths[path_type].Micro_Segment_Count();
    }

    Micro_Segment(
        micro_segment_index: Index,
        path_type: Path_Type,
    ):
        Segment.Instance
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path_Type.DEFAULT;
        }

        return this.paths[path_type].Micro_Segment(micro_segment_index);
    }

    Micro_Part_Segment_Item_Indices(
        micro_part_index: Index,
        path_type: Path_Type,
    ):
        Array<Segment_Item_Index>
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path_Type.DEFAULT;
        }

        return this.paths[path_type].Micro_Part_Segment_Item_Indices(micro_part_index);
    }

    Macro_Segment_Count(
        path_type: Path_Type,
    ):
        Count
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path_Type.DEFAULT;
        }

        return this.paths[path_type].Macro_Segment_Count();
    }

    Macro_Segment(
        macro_segment_index: Index,
        path_type: Path_Type,
    ):
        Segment.Instance
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path_Type.DEFAULT;
        }

        return this.paths[path_type].Macro_Segment(macro_segment_index);
    }

    Macro_Part_Segment_Item_Indices(
        macro_part_index: Index,
        path_type: Path_Type,
    ):
        Array<Segment_Item_Index>
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path_Type.DEFAULT;
        }

        return this.paths[path_type].Macro_Part_Segment_Item_Indices(macro_part_index);
    }
}
