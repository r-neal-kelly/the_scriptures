import { Integer } from "../../../types.js";
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

    Value():
        Value
    {
        let path_type: Path.Type = this.Text().Path_Type();
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

    private Set_Path(
        path_type: Path.Type,
        value: Value,
    ):
        void
    {
        const path: Path.Instance =
            new Path.Instance(
                {
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
                const language_stack: Array<Language.Name> = [];
                const error_argument_stack: Array<Error_Argument_Frame> = [];

                let current_type: Parse_Type = Parse_Type.POINT;
                let current_style: Part.Style = Part.Style._NONE_;
                let current_start: Unicode.Iterator = new Unicode.Iterator(
                    {
                        text: row_value,
                    },
                );

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
                        let value: Value = maybe_valid_command_value;
                        let language: Language.Name | null = Current_Language();
                        let command: Part.Command.Instance = new Part.Command.Instance(
                            {
                                index: 0,
                                value: value,
                                language: null,
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

                        } else if (command.Is_Open_Error()) {
                            this.has_errorless_path = true;
                            if (command.Has_Argument()) {
                                value =
                                    Part.Command.Symbol.FIRST +
                                    command.Some_Parameter() +
                                    Part.Command.Symbol.DIVIDER;
                                error_argument_stack.push(
                                    new Error_Argument_Frame(
                                        {
                                            parameter: command.Some_Parameter(),
                                            argument: command.Some_Argument(),
                                            from_text: it.Points(),
                                            from_text_index: it.Index(),
                                        },
                                    ),
                                );
                                current_style |= Part.Style.ARGUMENT;
                            } else {
                                current_style |= Part.Style.ERROR;
                            }
                        } else if (command.Is_Close_Error()) {
                            current_style &= ~Part.Style.ERROR;

                        } else if (command.Is_Open_Hebrew()) {
                            language_stack.push(Language.Name.HEBREW);
                        } else if (command.Is_Open_Greek()) {
                            language_stack.push(Language.Name.GREEK);
                        } else if (command.Is_Open_Latin()) {
                            language_stack.push(Language.Name.LATIN);
                        } else if (command.Is_Open_Aramaic()) {
                            language_stack.push(Language.Name.ARAMAIC);
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
                                language: language,
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
                        error_argument_stack.length > 0 &&
                        it.Point() === Part.Command.Symbol.LAST
                    ) {
                        error_argument_stack.pop();
                        if (error_argument_stack.length === 0) {
                            current_style &= ~Part.Style.ARGUMENT;
                        }
                        current_style |= Part.Style.ERROR;

                        path.Update_Command(
                            row_value,
                            {
                                value: Part.Command.Symbol.LAST,
                                language: Current_Language(),
                            }
                        );

                        it = it.Next();
                        current_start = it;
                    } else {
                        const this_point: Value = it.Point();
                        const next_point: Value | null = it.Look_Forward_Point();
                        const next_maybe_valid_command: Value | null =
                            Part.Command.Maybe_Valid_Value_From(
                                it.Look_Forward_Points() || ``,
                            );

                        if (dictionary.Has_Letter(this_point)) {
                            path.Update_Letter(
                                row_value,
                                {
                                    value: this_point,
                                    style: current_style,
                                    language: Current_Language(),
                                },
                            );

                            current_type = Parse_Type.WORD;
                        } else if (dictionary.Has_Marker(this_point)) {
                            path.Update_Marker(
                                row_value,
                                {
                                    value: this_point,
                                    style: current_style,
                                    language: Current_Language(),
                                },
                            );

                            current_type = Parse_Type.BREAK;
                        } else {
                            path.Update_Point(
                                row_value,
                                {
                                    value: this_point,
                                    style: current_style,
                                    language: Current_Language(),
                                },
                            );

                            current_type = Parse_Type.POINT;

                            current_start = it.Next();
                        }

                        if (current_type === Parse_Type.WORD) {
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

                                path.Update_Word(
                                    row_value,
                                    {
                                        value: word,
                                        status: status,
                                        style: current_style,
                                        language: Current_Language(),
                                    },
                                );

                                current_start = it.Next();
                            }
                        } else if (current_type === Parse_Type.BREAK) {
                            if (
                                next_point == null ||
                                next_maybe_valid_command != null ||
                                !dictionary.Has_Marker(next_point)
                            ) {
                                const break_: Value = it.Text().slice(
                                    current_start.Index(),
                                    it.Look_Forward_Index(),
                                );
                                const boundary: Dictionary.Boundary =
                                    Break_Boundary(current_start, it);
                                const status: Part.Status = dictionary.Has_Break(break_, boundary) ?
                                    Part.Status.GOOD :
                                    dictionary.Has_Break_Error(break_, boundary) ?
                                        Part.Status.ERROR :
                                        Part.Status.UNKNOWN;

                                path.Update_Break(
                                    row_value,
                                    {
                                        value: break_,
                                        status: status,
                                        style: current_style,
                                        language: Current_Language(),
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

        let path_type: Path.Type = this.Text().Path_Type();
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Has_Column_Index(column_index);
    }

    Column_Count():
        Count
    {
        let path_type: Path.Type = this.Text().Path_Type();
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Column_Count();
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

        let path_type: Path.Type = this.Text().Path_Type();
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Column(column_index);
    }

    Has_Margin():
        boolean
    {
        let path_type: Path.Type = this.Text().Path_Type();
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Has_Margin();
    }

    Margin_Count():
        Count
    {
        let path_type: Path.Type = this.Text().Path_Type();
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Margin_Count();
    }

    Non_Margin_Count():
        Count
    {
        let path_type: Path.Type = this.Text().Path_Type();
        if (!this.paths.hasOwnProperty(path_type)) {
            path_type = Path.Type.DEFAULT;
        }

        return this.paths[path_type].Non_Margin_Count();
    }

    Is_Part_Of_Table():
        boolean
    {
        return !this.Has_Margin() && this.Column_Count() > 1;
    }

    Is_First_Part_Of_Table():
        boolean
    {
        return (
            this.Is_Part_Of_Table() &&
            (
                this.Index() === 0 ||
                !this.Text().Line(this.Index() - 1).Is_Part_Of_Table()
            )
        );
    }
}
