import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";
import * as Unicode from "../../../unicode.js";

import * as Language from "../../language.js";
import { Value } from "../value.js";
import * as Part from "./instance.js";
import { Type } from "./type.js";
import { Status } from "./status.js";
import { Style } from "./style.js";

export enum Symbol
{
    FIRST = `⸨`,
    LAST = `⸩`,
    CLOSE = `/`,
    DIVIDER = `:`,
}

export function Is_Symbol(
    point: Value,
):
    boolean
{
    return (
        point === Symbol.FIRST ||
        point === Symbol.LAST ||
        point === Symbol.CLOSE ||
        point === Symbol.DIVIDER
    );
}

export enum Parameter
{
    ERROR = `err`,
    LANGUAGE = `lang`,
    IMAGE = `img`,
    INLINE_IMAGE = `inl-img`,
}

type Parameter_And_Argument = {
    parameter: Value,
    argument: Value,
};

export function Is_Known_Parameter(
    value: Value,
):
    boolean
{
    return (
        value === Parameter.ERROR ||
        value === Parameter.LANGUAGE ||
        value === Parameter.IMAGE ||
        value === Parameter.INLINE_IMAGE
    );
}

export function Is_Known_Open_Parameter(
    value: Value,
):
    boolean
{
    return (
        value.length > 2 &&
        value[0] === Symbol.FIRST &&
        value[value.length - 1] === Symbol.DIVIDER &&
        Is_Known_Parameter(value.slice(1, value.length - 1))
    );
}

export function Is_Known_Close_Parameter(
    value: Value,
):
    boolean
{
    return value === Symbol.LAST;
}

export enum Known_Value
{
    COLUMN = `⸨col⸩`,
    ROW = `⸨row⸩`,
    MARGIN = `⸨marg⸩`,
    INTERLINEAR = `⸨intl⸩`,
    REVERSE_INTERLINEAR = `⸨rev-intl⸩`,

    CENTER = `⸨cen⸩`,
    INDENT = `⸨in⸩`,
    PAD = `⸨pad⸩`,

    OPEN_ITALIC = `⸨i⸩`,
    CLOSE_ITALIC = `⸨/i⸩`,

    OPEN_BOLD = `⸨b⸩`,
    CLOSE_BOLD = `⸨/b⸩`,

    OPEN_UNDERLINE = `⸨u⸩`,
    CLOSE_UNDERLINE = `⸨/u⸩`,

    OPEN_SMALL_CAPS = `⸨sc⸩`,
    CLOSE_SMALL_CAPS = `⸨/sc⸩`,

    // We can probably just put this in the style bitbools,
    // and the buffer item can just check if it should get a
    // value or not depending on whether or not additions are
    // being allowed in the render. We'd want to rename the bitbool.
    OPEN_ADDITION = `⸨add⸩`,
    CLOSE_ADDITION = `⸨/add⸩`,

    OPEN_ERROR = `⸨err⸩`,
    CLOSE_ERROR = `⸨/err⸩`,

    OPEN_LEFT_TO_RIGHT = `⸨ltr⸩`,
    CLOSE_LEFT_TO_RIGHT = `⸨/ltr⸩`,

    OPEN_RIGHT_TO_LEFT = `⸨rtl⸩`,
    CLOSE_RIGHT_TO_LEFT = `⸨/rtl⸩`,

    CLOSE_LANGUAGE = `⸨/lang⸩`,
}

export function Is_Valid_Value(
    value: Value,
):
    boolean
{
    return (
        value.length > 2 &&
        value[0] === `⸨` &&
        value[value.length - 1] === `⸩`
    );
}

function Interior_Value(
    value: Value,
):
    Value
{
    return value.replace(/^⸨\/?/, ``).replace(/⸩$/, ``);
}

function Interior_Parameter_And_Argument(
    value: Value,
):
    Parameter_And_Argument | null
{
    const interior_value: Value =
        Interior_Value(value);
    const interior_divider_index: Index =
        interior_value.indexOf(Symbol.DIVIDER);
    if (interior_divider_index > -1) {
        const interior_parameter: Value =
            interior_value.slice(0, interior_divider_index);
        if (interior_parameter.length > 0) {
            const interior_argument: Value =
                interior_value.slice(interior_divider_index + Symbol.DIVIDER.length);

            return {
                parameter: interior_parameter,
                argument: interior_argument,
            };
        } else {
            return null;
        }
    } else {
        return null;
    }
}

export function Is_Known_Value(
    value: Value,
):
    boolean
{
    if (
        value === Known_Value.COLUMN ||
        value === Known_Value.ROW ||
        value === Known_Value.MARGIN ||
        value === Known_Value.INTERLINEAR ||
        value === Known_Value.REVERSE_INTERLINEAR ||

        value === Known_Value.CENTER ||
        value === Known_Value.INDENT ||
        value === Known_Value.PAD ||

        value === Known_Value.OPEN_ITALIC ||
        value === Known_Value.CLOSE_ITALIC ||

        value === Known_Value.OPEN_BOLD ||
        value === Known_Value.CLOSE_BOLD ||

        value === Known_Value.OPEN_UNDERLINE ||
        value === Known_Value.CLOSE_UNDERLINE ||

        value === Known_Value.OPEN_SMALL_CAPS ||
        value === Known_Value.CLOSE_SMALL_CAPS ||

        value === Known_Value.OPEN_ADDITION ||
        value === Known_Value.CLOSE_ADDITION ||

        value === Known_Value.OPEN_ERROR ||
        value === Known_Value.CLOSE_ERROR ||

        value === Known_Value.OPEN_LEFT_TO_RIGHT ||
        value === Known_Value.CLOSE_LEFT_TO_RIGHT ||

        value === Known_Value.OPEN_RIGHT_TO_LEFT ||
        value === Known_Value.CLOSE_RIGHT_TO_LEFT ||

        value === Known_Value.CLOSE_LANGUAGE
    ) {
        return true;

    } else if (
        Is_Known_Open_Parameter(value) ||
        Is_Known_Close_Parameter(value)
    ) {
        return true;

    } else {
        const parameter_and_argument: Parameter_And_Argument | null =
            Interior_Parameter_And_Argument(value);

        if (parameter_and_argument != null) {
            if (parameter_and_argument.parameter === Parameter.LANGUAGE) {
                return (
                    parameter_and_argument.argument === Language.Name.HEBREW ||
                    parameter_and_argument.argument === Language.Name.GREEK ||
                    parameter_and_argument.argument === Language.Name.LATIN ||
                    parameter_and_argument.argument === Language.Name.ARAMAIC ||
                    parameter_and_argument.argument === Language.Name.ARABIC ||
                    parameter_and_argument.argument === Language.Name.GERMAN ||
                    parameter_and_argument.argument === Language.Name.FRENCH ||
                    parameter_and_argument.argument === Language.Name.ITALIAN ||
                    parameter_and_argument.argument === Language.Name.DUTCH ||
                    parameter_and_argument.argument === Language.Name.ENGLISH
                );

            } else if (parameter_and_argument.parameter === Parameter.ERROR) {
                return true;

            } else if (parameter_and_argument.parameter === Parameter.IMAGE) {
                return parameter_and_argument.argument != null;

            } else if (parameter_and_argument.parameter === Parameter.INLINE_IMAGE) {
                return parameter_and_argument.argument != null;

            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}

export function Maybe_Valid_Value_From(
    text: string,
):
    string | null
{
    let it: Unicode.Iterator = new Unicode.Iterator(
        {
            text: text,
        },
    );

    if (!it.Is_At_End() && it.Point() === Symbol.FIRST) {
        let depth: Count = 1;

        it = it.Next();
        for (; !it.Is_At_End() && depth > 0; it = it.Next()) {
            const point: string = it.Point();
            if (point === Symbol.FIRST) {
                depth += 1;
            } else if (point === Symbol.LAST) {
                depth -= 1;
            }
        }

        if (depth < 1) {
            return text.slice(0, it.Index());
        } else {
            return null;
        }
    } else {
        return null;
    }
}

function Test_Maybe_Valid_Value_From():
    void
{
    Utils.Assert(Maybe_Valid_Value_From(``) === null);
    Utils.Assert(Maybe_Valid_Value_From(`⸩`) === null);
    Utils.Assert(Maybe_Valid_Value_From(`⸨⸩`) === `⸨⸩`);
    Utils.Assert(Maybe_Valid_Value_From(`⸩⸨⸩`) === null);
    Utils.Assert(Maybe_Valid_Value_From(`⸨⸩⸨⸩`) === `⸨⸩`);
    Utils.Assert(Maybe_Valid_Value_From(`⸩⸨⸩⸨⸩`) === null);
    Utils.Assert(Maybe_Valid_Value_From(`⸩⸩⸨⸩⸨⸩`) === null);
    Utils.Assert(Maybe_Valid_Value_From(`⸨⸩⸩⸨⸩⸨⸩`) === `⸨⸩`);
    Utils.Assert(Maybe_Valid_Value_From(`⸨⸨⸩⸩⸨⸩⸨⸩`) === `⸨⸨⸩⸩`);
    Utils.Assert(Maybe_Valid_Value_From(`0⸨⸨⸩⸩⸨⸩⸨⸩`) === null);
    Utils.Assert(Maybe_Valid_Value_From(`⸨anything ⸨can be⸩ in here⸩⸨⸩⸨⸩`) === `⸨anything ⸨can be⸩ in here⸩`);
    Utils.Assert(Maybe_Valid_Value_From(`⸨anything ⸨can be⸩ in here⸨⸩⸨⸩`) === null);
}

export function First_Non_Command_Index(
    text: string,
):
    Index | null
{
    let it: Unicode.Iterator = new Unicode.Iterator(
        {
            text: text,
            index: 0,
        },
    );

    if (!it.Is_At_End()) {
        while (!it.Is_At_End() && it.Point() === Symbol.FIRST) {
            let candidate: Unicode.Iterator = it;
            let depth: Count = 1;

            it = it.Next();
            for (; !it.Is_At_End() && depth > 0; it = it.Next()) {
                const point: string = it.Point();
                if (point === Symbol.FIRST) {
                    depth += 1;
                } else if (point === Symbol.LAST) {
                    depth -= 1;
                }
            }

            if (depth > 0) {
                return candidate.Index();
            } else if (it.Is_At_End()) {
                return null;
            }
        }

        return it.Index();
    } else {
        return null;
    }
}

function Test_First_Non_Command_Index():
    void
{
    Utils.Assert(First_Non_Command_Index(``) === null);
    Utils.Assert(First_Non_Command_Index(`⸩`) === 0);
    Utils.Assert(First_Non_Command_Index(`⸨⸩`) === null);
    Utils.Assert(First_Non_Command_Index(`⸩⸨⸩`) === 0);
    Utils.Assert(First_Non_Command_Index(`⸨⸩⸨⸩`) === null);
    Utils.Assert(First_Non_Command_Index(`⸩⸨⸩⸨⸩`) === 0);
    Utils.Assert(First_Non_Command_Index(`⸩⸩⸨⸩⸨⸩`) === 0);
    Utils.Assert(First_Non_Command_Index(`⸨⸩⸩⸨⸩⸨⸩`) === 2);
    Utils.Assert(First_Non_Command_Index(`⸨⸨⸩⸩⸨⸩⸨⸩`) === null);
    Utils.Assert(First_Non_Command_Index(`0⸨⸨⸩⸩⸨⸩⸨⸩`) === 0);
    Utils.Assert(First_Non_Command_Index(`⸨⸨⸩⸩⸨⸩6⸨⸩`) === 6);
    Utils.Assert(First_Non_Command_Index(`⸨anything ⸨can⸩ be in here⸩⸨⸩29⸨⸩`) === 29);
    Utils.Assert(First_Non_Command_Index(`⸨err:^ ⸩* ⸨/err⸩`) === 8);
}

export function Last_Non_Command_Index(
    text: string,
):
    Index | null
{
    let it: Unicode.Iterator = new Unicode.Iterator(
        {
            text: text,
            index: text.length,
        },
    );

    if (!it.Is_At_Start()) {
        it = it.Previous();

        while (!it.Is_At_Start() && it.Point() === Symbol.LAST) {
            let candidate: Unicode.Iterator = it;
            let depth: Count = 1;

            do {
                it = it.Previous();

                const point: string = it.Point();
                if (point === Symbol.FIRST) {
                    depth -= 1;
                } else if (point === Symbol.LAST) {
                    depth += 1;
                }
            } while (!it.Is_At_Start() && depth > 0);

            if (depth > 0) {
                return candidate.Index();
            } else if (it.Is_At_Start()) {
                return null;
            } else {
                it = it.Previous();
            }
        }

        return it.Index();
    } else {
        return null;
    }
}

function Test_Last_Non_Command_Index():
    void
{
    Utils.Assert(Last_Non_Command_Index(``) === null);
    Utils.Assert(Last_Non_Command_Index(`⸩`) === 0);
    Utils.Assert(Last_Non_Command_Index(`⸨⸩`) === null);
    Utils.Assert(Last_Non_Command_Index(`⸩⸨⸩`) === 0);
    Utils.Assert(Last_Non_Command_Index(`⸨⸩⸨⸩`) === null);
    Utils.Assert(Last_Non_Command_Index(`⸩⸨⸩⸨⸩`) === 0);
    Utils.Assert(Last_Non_Command_Index(`⸩⸩⸨⸩⸨⸩`) === 1);
    Utils.Assert(Last_Non_Command_Index(`⸨⸩⸩⸨⸩⸨⸩`) === 2);
    Utils.Assert(Last_Non_Command_Index(`⸨⸨⸩⸩⸨⸩⸨⸩`) === null);
    Utils.Assert(Last_Non_Command_Index(`0⸨⸨⸩⸩⸨⸩⸨⸩`) === 0);
    Utils.Assert(Last_Non_Command_Index(`0⸨⸨⸩⸩⸨⸩7⸨⸩`) === 7);
    Utils.Assert(Last_Non_Command_Index(`0⸨⸨⸩⸩⸨⸩7⸨anything ⸨can be⸩ in here⸩`) === 7);
}

export function Closing_Command_Index_From_Opening_Command(
    from_opening_command: string,
):
    Index | null
{
    let it: Unicode.Iterator = new Unicode.Iterator(
        {
            text: from_opening_command,
        },
    );

    let command: Value | null = Maybe_Valid_Value_From(from_opening_command);
    if (command != null) {
        if (command.length > 1 && command[1] != Symbol.CLOSE) {
            it = new Unicode.Iterator(
                {
                    text: from_opening_command,
                    index: it.Index() + command.length,
                },
            );

            let depth: Count = 1;
            let index: Index | null = null;
            while (!it.Is_At_End() && depth > 0) {
                command = Maybe_Valid_Value_From(it.Points());
                if (command != null) {
                    if (command.length > 1 && command[1] != Symbol.CLOSE) {
                        depth += 1;
                    } else {
                        depth -= 1;
                    }

                    if (depth < 1) {
                        index = it.Index();
                    } else {
                        it = new Unicode.Iterator(
                            {
                                text: from_opening_command,
                                index: it.Index() + command.length,
                            },
                        );
                    }
                } else {
                    it = it.Next();
                }
            }

            if (index != null) {
                return index;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } else {
        return null;
    }
}

function Test_Closing_Command_Index_From_Opening_Command():
    void
{
    Utils.Assert(Closing_Command_Index_From_Opening_Command(`⸨⸩⸨/⸩`) === 2);
    Utils.Assert(Closing_Command_Index_From_Opening_Command(`⸨⸩⸨⸩⸨/⸩⸨/⸩`) === 7);
    Utils.Assert(Closing_Command_Index_From_Opening_Command(`⸨⸩⸨⸩⸨/⸩⸨⸩⸨/⸩⸨/⸩`) === 12);
    Utils.Assert(Closing_Command_Index_From_Opening_Command(`⸨⸩⸨⸩⸨⸩⸨/⸩⸨/⸩⸨/⸩`) === 12);
    Utils.Assert(Closing_Command_Index_From_Opening_Command(`⸨⸩a⸨⸩b⸨⸩c⸨/⸩d⸨/⸩e⸨/⸩f`) === 17);
    Utils.Assert(Closing_Command_Index_From_Opening_Command(`⸨1⸩a⸨2⸩b⸨3⸩c⸨/3⸩d⸨/2⸩e⸨/1⸩f`) === 22);
}

export function Partition_Into_Row_Values(
    text: string,
):
    Array<string>
{
    const results: Array<string> = [];

    let current_start: Unicode.Iterator = new Unicode.Iterator(
        {
            text: text,
        },
    );
    let has_column_or_margin_or_interlinear: boolean = false;
    let has_row: boolean = false;
    let has_other: boolean = false;

    for (let it = current_start; !it.Is_At_End();) {
        const maybe_valid_command_value: Value | null =
            Maybe_Valid_Value_From(it.Points());
        if (maybe_valid_command_value != null) {
            const command: Instance = new Instance(
                {
                    index: 0,
                    value: maybe_valid_command_value,
                    language: null,
                },
            );
            if (command.Is_Column() || command.Is_Margin() || command.Is_Interlinear()) {
                if (has_column_or_margin_or_interlinear || has_row || has_other) {
                    results.push(text.slice(current_start.Index(), it.Index()));
                    current_start = it;
                    has_column_or_margin_or_interlinear = false;
                    has_row = false;
                    has_other = false;
                }
                has_column_or_margin_or_interlinear = true;
            } else if (command.Is_Row()) {
                if (has_row || has_other) {
                    results.push(text.slice(current_start.Index(), it.Index()));
                    current_start = it;
                    has_column_or_margin_or_interlinear = false;
                    has_row = false;
                    has_other = false;
                }
                has_row = true;
            } else {
                has_other = true;
            }
            it = new Unicode.Iterator(
                {
                    text: it.Text(),
                    index: it.Index() + command.Value().length,
                },
            );
        } else {
            has_other = true;

            it = it.Next();
        }
    }
    if (!current_start.Is_At_End()) {
        results.push(text.slice(current_start.Index(), text.length));
    }

    return results;
}

export function Resolve_Errors(
    text: string,
    remove_unresolvable_errors: boolean,
):
    string
{
    function From(
        text: string,
    ):
        {
            full: string,
            interior: string,
        }
    {
        const opening_command: string =
            Maybe_Valid_Value_From(it.Points()) as string;
        Utils.Assert(
            opening_command != null,
        );

        const closing_command_index: Index | null =
            Closing_Command_Index_From_Opening_Command(text);
        if (closing_command_index != null) {
            const closing_command: string =
                Maybe_Valid_Value_From(text.slice(closing_command_index)) as string;
            Utils.Assert(
                closing_command != null,
            );

            return {
                full: text.slice(0, closing_command_index + closing_command.length),
                interior: text.slice(opening_command.length, closing_command_index),
            };
        } else {
            return {
                full: text,
                interior: text.slice(opening_command.length),
            };
        }
    }

    let result: string = ``;

    let it: Unicode.Iterator = new Unicode.Iterator(
        {
            text: text,
        },
    );
    while (!it.Is_At_End()) {
        const maybe_command: string | null = Maybe_Valid_Value_From(it.Points());
        if (maybe_command) {
            const command: Instance = new Instance(
                {
                    index: 0,
                    value: maybe_command,
                    language: null,
                },
            );
            if (command.Is_Open_Error()) {
                if (command.Has_Argument()) {
                    const { full } = From(it.Points());
                    result += Resolve_Errors(command.Some_Argument(), remove_unresolvable_errors);
                    it = new Unicode.Iterator(
                        {
                            text: it.Text(),
                            index: it.Index() + full.length,
                        },
                    );
                } else {
                    if (remove_unresolvable_errors) {
                        const { full, interior } = From(it.Points());
                        result += Resolve_Errors(interior, remove_unresolvable_errors);
                        it = new Unicode.Iterator(
                            {
                                text: it.Text(),
                                index: it.Index() + full.length,
                            },
                        );
                    } else {
                        result += command.Value();
                        it = new Unicode.Iterator(
                            {
                                text: it.Text(),
                                index: it.Index() + command.Value().length,
                            },
                        );
                    }
                }
            } else {
                if (
                    !command.Is_Close_Error() ||
                    !remove_unresolvable_errors
                ) {
                    result += command.Value();
                }
                it = new Unicode.Iterator(
                    {
                        text: it.Text(),
                        index: it.Index() + command.Value().length,
                    },
                );
            }
        } else {
            result += it.Point();
            it = it.Next();
        }
    }

    return result;
}

export function Is_Centered(
    text: string,
):
    boolean
{
    return (
        text.slice(
            0,
            Known_Value.CENTER.length,
        ) === Known_Value.CENTER
    );
}

export function Padding_Count(
    text: string,
):
    Count
{
    let count: Count = 0;
    while (
        text.slice(
            0,
            Known_Value.PAD.length,
        ) === Known_Value.PAD
    ) {
        count += 1;
        text = text.slice(Known_Value.PAD.length);
    }

    return count;
}

export class Instance extends Part.Instance
{
    private parameter: Value | null;
    private argument: Value | null;

    constructor(
        {
            index,
            value,
            language,
        }: {
            index: Index,
            value: Value,
            language: Language.Name | null,
        },
    )
    {
        super(
            {
                part_type: Type.COMMAND,
                index: index,
                value: value,
                status: Is_Known_Value(value) ?
                    Status.GOOD :
                    Is_Valid_Value(value) ?
                        Status.UNKNOWN :
                        Status.ERROR,
                style: Style._NONE_,
                language: language,
            }
        );

        const parameter_and_argument: Parameter_And_Argument | null =
            Interior_Parameter_And_Argument(value);
        if (parameter_and_argument != null) {
            this.parameter = parameter_and_argument.parameter;
            this.argument = parameter_and_argument.argument;
        } else {
            this.parameter = null;
            this.argument = null;
        }
    }

    override Has_Image_Value():
        boolean
    {
        return (this.Is_Image() || this.Is_Inline_Image()) && this.Has_Argument();
    }

    override Is_Image_Value_Inline():
        boolean
    {
        return this.Is_Inline_Image() && this.Has_Argument();
    }

    override Image_Value():
        Value
    {
        Utils.Assert(
            this.Has_Image_Value(),
            `Does not have an image value.`,
        );

        return Utils.Resolve_Path(this.Some_Argument());
    }

    Has_Parameter():
        boolean
    {
        return this.parameter != null;
    }

    Parameter():
        Value | null
    {
        return this.parameter;
    }

    Some_Parameter():
        Value
    {
        Utils.Assert(
            this.Has_Parameter(),
            `doesn't have a parameter`,
        );

        return this.parameter as Value;
    }

    Has_Argument():
        boolean
    {
        return this.argument != null;
    }

    Argument():
        Value | null
    {
        return this.argument;
    }

    Some_Argument():
        Value
    {
        Utils.Assert(
            this.Has_Argument(),
            `doesn't have an argument`,
        );

        return this.argument as Value;
    }

    Is_Column():
        boolean
    {
        return this.Value() === Known_Value.COLUMN;
    }

    Is_Row():
        boolean
    {
        return this.Value() === Known_Value.ROW;
    }

    Is_Margin():
        boolean
    {
        return this.Value() === Known_Value.MARGIN;
    }

    Is_Interlinear():
        boolean
    {
        return this.Is_Forward_Interlinear() || this.Is_Reverse_Interlinear();
    }

    Is_Forward_Interlinear():
        boolean
    {
        return this.Value() === Known_Value.INTERLINEAR;
    }

    Is_Reverse_Interlinear():
        boolean
    {
        return this.Value() === Known_Value.REVERSE_INTERLINEAR;
    }

    Is_Center():
        boolean
    {
        return this.Value() === Known_Value.CENTER;
    }

    Is_Indent():
        boolean
    {
        return this.Value() === Known_Value.INDENT;
    }

    Is_Pad():
        boolean
    {
        return this.Value() === Known_Value.PAD;
    }

    Is_Image():
        boolean
    {
        return this.Parameter() === Parameter.IMAGE;
    }

    Is_Inline_Image():
        boolean
    {
        return this.Parameter() === Parameter.INLINE_IMAGE;
    }

    Is_Opening():
        boolean
    {
        return this.Value().length > 1 && this.Value()[1] !== `/`;
    }

    Is_Closing():
        boolean
    {
        return this.Value().length > 1 && this.Value()[1] === `/`;
    }

    Is_Open_Italic():
        boolean
    {
        return this.Value() === Known_Value.OPEN_ITALIC;
    }

    Is_Close_Italic():
        boolean
    {
        return this.Value() === Known_Value.CLOSE_ITALIC;
    }

    Is_Open_Bold():
        boolean
    {
        return this.Value() === Known_Value.OPEN_BOLD;
    }

    Is_Close_Bold():
        boolean
    {
        return this.Value() === Known_Value.CLOSE_BOLD;
    }

    Is_Open_Underline():
        boolean
    {
        return this.Value() === Known_Value.OPEN_UNDERLINE;
    }

    Is_Close_Underline():
        boolean
    {
        return this.Value() === Known_Value.CLOSE_UNDERLINE;
    }

    Is_Open_Small_Caps():
        boolean
    {
        return this.Value() === Known_Value.OPEN_SMALL_CAPS;
    }

    Is_Close_Small_Caps():
        boolean
    {
        return this.Value() === Known_Value.CLOSE_SMALL_CAPS;
    }

    Is_Open_Addition():
        boolean
    {
        return this.Value() === Known_Value.OPEN_ADDITION;
    }

    Is_Close_Addition():
        boolean
    {
        return this.Value() === Known_Value.CLOSE_ADDITION;
    }

    Is_Open_Error():
        boolean
    {
        return (
            this.Value() === Known_Value.OPEN_ERROR ||
            this.Parameter() === Parameter.ERROR
        );
    }

    Is_Close_Error():
        boolean
    {
        return this.Value() === Known_Value.CLOSE_ERROR;
    }

    Is_Open_Left_To_Right():
        boolean
    {
        return this.Value() === Known_Value.OPEN_LEFT_TO_RIGHT;
    }

    Is_Close_Left_To_Right():
        boolean
    {
        return this.Value() === Known_Value.CLOSE_LEFT_TO_RIGHT;
    }

    Is_Open_Right_To_Left():
        boolean
    {
        return this.Value() === Known_Value.OPEN_RIGHT_TO_LEFT;
    }

    Is_Close_Right_To_Left():
        boolean
    {
        return this.Value() === Known_Value.CLOSE_RIGHT_TO_LEFT;
    }

    Is_Open_Language():
        boolean
    {
        return this.Parameter() === Parameter.LANGUAGE;
    }

    Is_Open_Hebrew():
        boolean
    {
        return (
            this.Parameter() === Parameter.LANGUAGE &&
            this.Argument() === Language.Name.HEBREW
        );
    }

    Is_Open_Greek():
        boolean
    {
        return (
            this.Parameter() === Parameter.LANGUAGE &&
            this.Argument() === Language.Name.GREEK
        );
    }

    Is_Open_Latin():
        boolean
    {
        return (
            this.Parameter() === Parameter.LANGUAGE &&
            this.Argument() === Language.Name.LATIN
        );
    }

    Is_Open_Aramaic():
        boolean
    {
        return (
            this.Parameter() === Parameter.LANGUAGE &&
            this.Argument() === Language.Name.ARAMAIC
        );
    }

    Is_Open_Arabic():
        boolean
    {
        return (
            this.Parameter() === Parameter.LANGUAGE &&
            this.Argument() === Language.Name.ARABIC
        );
    }

    Is_Open_German():
        boolean
    {
        return (
            this.Parameter() === Parameter.LANGUAGE &&
            this.Argument() === Language.Name.GERMAN
        );
    }

    Is_Open_French():
        boolean
    {
        return (
            this.Parameter() === Parameter.LANGUAGE &&
            this.Argument() === Language.Name.FRENCH
        );
    }

    Is_Open_Italian():
        boolean
    {
        return (
            this.Parameter() === Parameter.LANGUAGE &&
            this.Argument() === Language.Name.ITALIAN
        );
    }

    Is_Open_Dutch():
        boolean
    {
        return (
            this.Parameter() === Parameter.LANGUAGE &&
            this.Argument() === Language.Name.DUTCH
        );
    }

    Is_Open_English():
        boolean
    {
        return (
            this.Parameter() === Parameter.LANGUAGE &&
            this.Argument() === Language.Name.ENGLISH
        );
    }

    Is_Close_Language():
        boolean
    {
        return this.Value() === Known_Value.CLOSE_LANGUAGE;
    }

    Is_First_Of_Split():
        boolean
    {
        return this.Value()[this.Value().length - 1] === Symbol.DIVIDER;
    }

    Is_Last_Of_Split():
        boolean
    {
        return this.Value()[0] === Symbol.LAST;
    }

    Symbol_Point_Count():
        Count
    {
        let result: Count = 0;

        let it: Unicode.Iterator = new Unicode.Iterator(
            {
                text: this.Value(),
            },
        );
        for (; !it.Is_At_End(); it = it.Next()) {
            if (Is_Symbol(it.Point())) {
                result += 1;
            }
        }

        return result;
    }

    Non_Symbol_Point_Count():
        Count
    {
        let result: Count = 0;

        let it: Unicode.Iterator = new Unicode.Iterator(
            {
                text: this.Value(),
            },
        );
        for (; !it.Is_At_End(); it = it.Next()) {
            if (!Is_Symbol(it.Point())) {
                result += 1;
            }
        }

        return result;
    }
}
