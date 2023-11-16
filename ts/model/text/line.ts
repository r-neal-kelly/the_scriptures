import { Integer } from "../../types.js";
import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Unicode from "../../unicode.js";

import * as Language from "../language.js";
import * as Text from "./instance.js";
import { Value } from "./value.js";
import * as Dictionary from "./dictionary.js";
import * as Part from "./part.js";
import * as Segment from "./segment.js";
import * as Path from "./path.js";

export class Instance
{
    private text: Text.Instance;
    private index: Index;
    private paths: { [path_type: Integer]: Path.Instance };
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
        path_type: Path.Type,
    ):
        Value
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
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

        this.Set_Path(Path.Type.DEFAULT, value);
        if (this.has_errorless_path) {
            this.Set_Path(Path.Type.ERRORLESS, Part.Command.Resolve_Errors(value, false));
        }
    }

    Is_Centered(
        path_type: Path.Type,
    ):
        boolean
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Is_Centered();
    }

    Is_Padded(
        path_type: Path.Type,
    ):
        boolean
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Is_Padded();
    }

    Padding_Count(
        path_type: Path.Type,
    ):
        Count
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Padding_Count();
    }

    // I think that we should do both the default and errorless path at the same time
    // so that we can reuse parts. The errorless path would essentially just resolve
    // the argument in the command, and create all the parts for that and push those
    // to the errorless path, skipping what's in the tag, where as the default would
    // just look at them normally and add everything.
    // It would be more efficient if we create a validator for the command language
    // and ensure that there are no error commands within error commands which doesn't
    // make much sense anyway, for their intended purpose. It would make it easier
    // to just use the same string instead of having multiple strings in memory,
    // one with and one without errors.
    private Set_Path(
        path_type: Path.Type,
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

        this.paths[path_type] = new Path.Instance(
            {
                type: path_type,
                value: value,
            },
        );

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
                        language: current_language.length > 0 ?
                            current_language[current_language.length - 1] :
                            null,
                    },
                );
                let macro_command: Part.Command.Instance = new Part.Command.Instance(
                    {
                        index: this.paths[path_type].Macro_Part_Count(),
                        value: maybe_valid_command_value,
                        language: current_language.length > 0 ?
                            current_language[current_language.length - 1] :
                            null,
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
                                language: current_language.length > 0 ?
                                    current_language[current_language.length - 1] :
                                    null,
                            },
                        );
                        macro_command = new Part.Command.Instance(
                            {
                                index: this.paths[path_type].Macro_Part_Count(),
                                value: new_value,
                                language: current_language.length > 0 ?
                                    current_language[current_language.length - 1] :
                                    null,
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

                } else if (macro_command.Is_Open_Hebrew()) {
                    current_language.push(Language.Name.HEBREW);
                } else if (macro_command.Is_Open_Greek()) {
                    current_language.push(Language.Name.GREEK);
                } else if (macro_command.Is_Open_Latin()) {
                    current_language.push(Language.Name.LATIN);
                } else if (macro_command.Is_Open_Aramaic()) {
                    current_language.push(Language.Name.ARAMAIC);
                } else if (macro_command.Is_Open_Arabic()) {
                    current_language.push(Language.Name.ARABIC);
                } else if (macro_command.Is_Open_German()) {
                    current_language.push(Language.Name.GERMAN);
                } else if (macro_command.Is_Open_French()) {
                    current_language.push(Language.Name.FRENCH);
                } else if (macro_command.Is_Open_Italian()) {
                    current_language.push(Language.Name.ITALIAN);
                } else if (macro_command.Is_Open_Dutch()) {
                    current_language.push(Language.Name.DUTCH);
                } else if (macro_command.Is_Open_English()) {
                    current_language.push(Language.Name.ENGLISH);
                } else if (macro_command.Is_Close_Language()) {
                    if (current_language.length > 0) {
                        current_language.pop();
                    }
                    const language: Language.Name | null = current_language.length > 0 ?
                        current_language[current_language.length - 1] :
                        null;
                    micro_command.Set_Language(language);
                    macro_command.Set_Language(language);

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
                        language: current_language.length > 0 ?
                            current_language[current_language.length - 1] :
                            null,
                    },
                );
                const macro_command: Part.Command.Instance = new Part.Command.Instance(
                    {
                        index: this.paths[path_type].Macro_Part_Count(),
                        value: Part.Command.Symbol.LAST,
                        language: current_language.length > 0 ?
                            current_language[current_language.length - 1] :
                            null,
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
        path_type: Path.Type,
    ):
        boolean
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Has_Micro_Part(micro_part_index);
    }

    Micro_Part_Count(
        path_type: Path.Type,
    ):
        Count
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Micro_Part_Count();
    }

    Micro_Part(
        micro_part_index: Index,
        path_type: Path.Type,
    ):
        Part.Instance
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Micro_Part(micro_part_index);
    }

    Has_Macro_Part(
        macro_part_index: Index,
        path_type: Path.Type,
    ):
        boolean
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Has_Macro_Part(macro_part_index);
    }

    Macro_Part_Count(
        path_type: Path.Type,
    ):
        Count
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Macro_Part_Count();
    }

    Macro_Part(
        macro_part_index: Index,
        path_type: Path.Type,
    ):
        Part.Instance
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Macro_Part(macro_part_index);
    }

    Micro_Segment_Count(
        path_type: Path.Type,
    ):
        Count
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Micro_Segment_Count();
    }

    Micro_Segment(
        micro_segment_index: Index,
        path_type: Path.Type,
    ):
        Segment.Instance
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Micro_Segment(micro_segment_index);
    }

    Micro_Part_Segment_Item_Indices(
        micro_part_index: Index,
        path_type: Path.Type,
    ):
        Array<Segment.Item_Index>
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Micro_Part_Segment_Item_Indices(micro_part_index);
    }

    Macro_Segment_Count(
        path_type: Path.Type,
    ):
        Count
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Macro_Segment_Count();
    }

    Macro_Segment(
        macro_segment_index: Index,
        path_type: Path.Type,
    ):
        Segment.Instance
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Macro_Segment(macro_segment_index);
    }

    Macro_Part_Segment_Item_Indices(
        macro_part_index: Index,
        path_type: Path.Type,
    ):
        Array<Segment.Item_Index>
    {
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Macro_Part_Segment_Item_Indices(macro_part_index);
    }
}
