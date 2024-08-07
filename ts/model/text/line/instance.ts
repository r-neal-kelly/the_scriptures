import { Integer } from "../../../types.js";
import { Float } from "../../../types.js";
import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";
import * as Unicode from "../../../unicode.js";

import * as Language from "../../language.js";
import * as Text from "../instance.js";
import { Value } from "../value.js";
import * as Dictionary from "../dictionary.js";
import * as Part from "../part.js";
import * as Column from "../column.js";
import * as Path from "../path.js";

enum Parse_Type
{
    WORD,
    BREAK,
    POINT,
}

class Fix_Argument_Frame
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

    Path():
        Path.Instance
    {
        let path_type: Path.Type = this.Text().Path_Type();
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        Utils.Assert(
            this.paths[path_type] != null,
            `Path does not exist yet.`,
        );

        return this.paths[path_type];
    }

    Value():
        Value
    {
        return this.Path().Value();
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

    private Set_Path(
        path_type: Path.Type,
        value: Value,
    ):
        void
    {
        const path: Path.Instance =
            new Path.Instance(
                {
                    line: this,
                    type: path_type,
                    value: value,
                },
            );

        if (value === ``) {
            path.Update_Empty();
        } else {
            const dictionary: Dictionary.Instance =
                this.Text().Dictionary();
            const row_values: Array<string> =
                Part.Command.Partition_Into_Row_Values(value);

            for (const row_value of row_values) {
                const first_non_command_index: Index | null =
                    Part.Command.First_Non_Command_Index(row_value);
                const last_non_command_index: Index | null =
                    Part.Command.Last_Non_Command_Index(row_value);
                const size_stack: Array<Float | null> = [];
                const language_stack: Array<Language.Name> = [];
                const fix_argument_stack: Array<Fix_Argument_Frame> = [];

                let current_type: Parse_Type = Parse_Type.POINT;
                let current_style: Part.Style = Part.Style._NONE_;
                let currently_force_good: boolean = false;
                let current_start: Unicode.Iterator = new Unicode.Iterator(
                    {
                        text: row_value,
                    },
                );

                function Current_Size():
                    Float | null
                {
                    return size_stack.length > 0 ?
                        size_stack[size_stack.length - 1] :
                        null;
                }

                function Current_Language():
                    Language.Name | null
                {
                    return language_stack.length > 0 ?
                        language_stack[language_stack.length - 1] :
                        null;
                }

                function Break_Boundary(
                    first: Unicode.Iterator,
                    last: Unicode.Iterator,
                ):
                    Dictionary.Boundary
                {
                    if (fix_argument_stack.length > 0) {
                        const fix_argument_frame: Fix_Argument_Frame =
                            fix_argument_stack[fix_argument_stack.length - 1];
                        if (
                            first.Index() === fix_argument_frame.First_Non_Command_Index() &&
                            (
                                first_non_command_index != null ?
                                    last.Index() < first_non_command_index :
                                    true
                            )
                        ) {
                            return Dictionary.Boundary.START;
                        } else if (
                            last.Index() === fix_argument_frame.Last_Non_Command_Index() &&
                            (
                                last_non_command_index != null ?
                                    fix_argument_frame.Closing_Command_Index() > last_non_command_index :
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
                        let value: Value = maybe_valid_command_value;
                        let size: Float | null = Current_Size();
                        let language: Language.Name | null = Current_Language();
                        let command: Part.Command.Instance = new Part.Command.Instance(
                            {
                                index: 0,
                                value: value,
                                size: null,
                                language: null,
                                is_argument: false,
                            },
                        );

                        if (command.Is_Open_Italic()) {
                            current_style |= Part.Style.ITALIC;
                        } else if (command.Is_Close_Italic()) {
                            current_style &= ~Part.Style.ITALIC;

                        } else if (command.Is_Open_Bold()) {
                            current_style |= Part.Style.BOLD;
                        } else if (command.Is_Close_Bold()) {
                            current_style &= ~Part.Style.BOLD;

                        } else if (command.Is_Open_Underline()) {
                            current_style |= Part.Style.UNDERLINE;
                        } else if (command.Is_Close_Underline()) {
                            current_style &= ~Part.Style.UNDERLINE;

                        } else if (command.Is_Open_Small_Caps()) {
                            current_style |= Part.Style.SMALL_CAPS;
                        } else if (command.Is_Close_Small_Caps()) {
                            current_style &= ~Part.Style.SMALL_CAPS;

                        } else if (command.Is_Open_Superscript()) {
                            current_style |= Part.Style.SUPERSCRIPT;
                        } else if (command.Is_Close_Superscript()) {
                            current_style &= ~Part.Style.SUPERSCRIPT;

                        } else if (command.Is_Open_Subscript()) {
                            current_style |= Part.Style.SUBSCRIPT;
                        } else if (command.Is_Close_Subscript()) {
                            current_style &= ~Part.Style.SUBSCRIPT;

                        } else if (command.Is_Open_Good()) {
                            currently_force_good = true;
                        } else if (command.Is_Close_Good()) {
                            currently_force_good = false;

                        } else if (command.Is_Open_Fix()) {
                            this.has_errorless_path = true;
                            if (command.Has_Argument()) {
                                value =
                                    Part.Command.Symbol.FIRST +
                                    command.Some_Parameter() +
                                    Part.Command.Symbol.DIVIDER;
                                fix_argument_stack.push(
                                    new Fix_Argument_Frame(
                                        {
                                            parameter: command.Some_Parameter(),
                                            argument: command.Some_Argument() as string,
                                            from_text: it.Points(),
                                            from_text_index: it.Index(),
                                        },
                                    ),
                                );
                                current_style |= Part.Style.ARGUMENT;
                            } else {
                                current_style |= Part.Style.ERROR;
                            }
                        } else if (command.Is_Close_Fix()) {
                            current_style &= ~Part.Style.ERROR;

                        } else if (command.Is_Open_Size()) {
                            size_stack.push(command.Size_Argument());
                            size = Current_Size();
                        } else if (command.Is_Close_Size()) {
                            if (size_stack.length > 0) {
                                size_stack.pop();
                            }

                        } else if (command.Is_Open_Hebrew()) {
                            language_stack.push(Language.Name.HEBREW);
                        } else if (command.Is_Open_Greek()) {
                            language_stack.push(Language.Name.GREEK);
                        } else if (command.Is_Open_Latin()) {
                            language_stack.push(Language.Name.LATIN);
                        } else if (command.Is_Open_Aramaic()) {
                            language_stack.push(Language.Name.ARAMAIC);
                        } else if (command.Is_Open_Geez()) {
                            language_stack.push(Language.Name.GEEZ);
                        } else if (command.Is_Open_Arabic()) {
                            language_stack.push(Language.Name.ARABIC);
                        } else if (command.Is_Open_German()) {
                            language_stack.push(Language.Name.GERMAN);
                        } else if (command.Is_Open_French()) {
                            language_stack.push(Language.Name.FRENCH);
                        } else if (command.Is_Open_Italian()) {
                            language_stack.push(Language.Name.ITALIAN);
                        } else if (command.Is_Open_Dutch()) {
                            language_stack.push(Language.Name.DUTCH);
                        } else if (command.Is_Open_English()) {
                            language_stack.push(Language.Name.ENGLISH);
                        } else if (command.Is_Close_Language()) {
                            if (language_stack.length > 0) {
                                language_stack.pop();
                            }
                            language = Current_Language();

                        }

                        path.Update_Command(
                            row_value,
                            {
                                value: value,
                                size: size,
                                language: language,
                                is_argument: (current_style & Part.Style.ARGUMENT) != 0
                            },
                        );

                        it = new Unicode.Iterator(
                            {
                                text: it.Text(),
                                index: it.Index() + value.length,
                            },
                        );
                        current_start = it;
                    } else if (
                        fix_argument_stack.length > 0 &&
                        it.Point() === Part.Command.Symbol.LAST
                    ) {
                        fix_argument_stack.pop();
                        if (fix_argument_stack.length === 0) {
                            current_style &= ~Part.Style.ARGUMENT;
                        }
                        current_style |= Part.Style.ERROR;

                        path.Update_Command(
                            row_value,
                            {
                                value: Part.Command.Symbol.LAST,
                                size: Current_Size(),
                                language: Current_Language(),
                                is_argument: false,
                            }
                        );

                        it = it.Next();
                        current_start = it;
                    } else {
                        const current_size: Float | null = Current_Size();
                        const current_language: Language.Name | null = Current_Language();
                        const this_point: Value = it.Point();
                        const next_point: Value | null = it.Look_Forward_Point();
                        const next_maybe_valid_command: Value | null =
                            Part.Command.Maybe_Valid_Value_From(
                                it.Look_Forward_Points() || ``,
                            );

                        if (dictionary.Has_Letter(this_point, current_language)) {
                            path.Update_Letter(
                                row_value,
                                {
                                    value: this_point,
                                    style: current_style,
                                    size: current_size,
                                    language: current_language,
                                },
                            );

                            current_type = Parse_Type.WORD;
                        } else if (dictionary.Has_Marker(this_point, current_language)) {
                            path.Update_Marker(
                                row_value,
                                {
                                    value: this_point,
                                    style: current_style,
                                    size: current_size,
                                    language: current_language,
                                },
                            );

                            current_type = Parse_Type.BREAK;
                        } else {
                            path.Update_Point(
                                row_value,
                                {
                                    value: this_point,
                                    style: current_style,
                                    size: current_size,
                                    language: current_language,
                                },
                            );

                            current_type = Parse_Type.POINT;

                            current_start = it.Next();
                        }

                        if (current_type === Parse_Type.WORD) {
                            if (
                                next_point == null ||
                                next_maybe_valid_command != null ||
                                !dictionary.Has_Letter(next_point, current_language)
                            ) {
                                const word: Value = it.Text().slice(
                                    current_start.Index(),
                                    it.Look_Forward_Index(),
                                );
                                const status: Part.Status = currently_force_good ?
                                    Part.Status.GOOD :
                                    dictionary.Has_Word(word, current_language) ?
                                        Part.Status.GOOD :
                                        dictionary.Has_Word_Error(word, current_language) ?
                                            Part.Status.ERROR :
                                            Part.Status.UNKNOWN;

                                path.Update_Word(
                                    row_value,
                                    {
                                        value: word,
                                        status: status,
                                        style: current_style,
                                        size: current_size,
                                        language: current_language,
                                    },
                                );

                                current_start = it.Next();
                            }
                        } else if (current_type === Parse_Type.BREAK) {
                            if (
                                next_point == null ||
                                next_maybe_valid_command != null ||
                                !dictionary.Has_Marker(next_point, current_language)
                            ) {
                                const break_: Value = it.Text().slice(
                                    current_start.Index(),
                                    it.Look_Forward_Index(),
                                );
                                const boundary: Dictionary.Boundary =
                                    Break_Boundary(current_start, it);
                                const status: Part.Status = currently_force_good ?
                                    Part.Status.GOOD :
                                    dictionary.Has_Break(break_, boundary, current_language) ?
                                        Part.Status.GOOD :
                                        dictionary.Has_Break_Error(break_, boundary, current_language) ?
                                            Part.Status.ERROR :
                                            Part.Status.UNKNOWN;

                                path.Update_Break(
                                    row_value,
                                    {
                                        value: break_,
                                        status: status,
                                        style: current_style,
                                        size: current_size,
                                        language: current_language,
                                        boundary: boundary,
                                    },
                                );

                                current_start = it.Next();
                            }
                        }

                        it = it.Next();
                    }
                }
            }
        }

        path.Finalize();
        this.paths[path_type] = path;
    }

    Has_Column_Index(
        column_index: Index,
    ):
        boolean
    {
        Utils.Assert(
            column_index > -1,
            `column_index must be greater than -1.`,
        );

        return this.Path().Has_Column_Index(column_index);
    }

    Column_Count():
        Count
    {
        return this.Path().Column_Count();
    }

    Column(
        column_index: Index,
    ):
        Column.Instance
    {
        Utils.Assert(
            this.Has_Column_Index(column_index),
            `Does not have column at index ${column_index}.`,
        );

        return this.Path().Column(column_index);
    }

    Column_Percents():
        Array<Count>
    {
        Utils.Assert(
            this.Is_Row_Of_Table(),
            `must be a row of table to have column_percents`,
        );

        return this.Text().Line_Column_Percents(this.Index());
    }

    Tabular_Column_Count():
        Count
    {
        return this.Path().Tabular_Column_Count();
    }

    Marginal_Column_Count():
        Count
    {
        return this.Path().Marginal_Column_Count();
    }

    Interlinear_Column_Count():
        Count
    {
        return this.Path().Interlinear_Column_Count();
    }

    Has_Margin():
        boolean
    {
        return this.Path().Has_Margin();
    }

    Has_Interlineation():
        boolean
    {
        return this.Path().Has_Interlineation();
    }

    Has_Forward_Interlineation():
        boolean
    {
        return this.Path().Has_Forward_Interlineation();
    }

    Has_Reverse_Interlineation():
        boolean
    {
        return this.Path().Has_Reverse_Interlineation();
    }

    Is_Row_Of_Table():
        boolean
    {
        return (
            !this.Has_Margin() &&
            !this.Has_Interlineation() &&
            this.Column_Count() > 1
        );
    }

    Is_First_Row_Of_Table():
        boolean
    {
        return (
            this.Is_Row_Of_Table() &&
            (
                this.Index() === 0 ||
                !this.Text().Line(this.Index() - 1).Is_Row_Of_Table()
            )
        );
    }

    Is_Centered():
        boolean
    {
        return this.Path().Is_Centered();
    }

    Is_Padded():
        boolean
    {
        return this.Path().Is_Padded();
    }

    Padding_Count():
        Count
    {
        return this.Path().Padding_Count();
    }

    Is_Blank():
        boolean
    {
        return this.Path().Is_Blank();
    }
}
