import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";
import * as Unicode from "../../../unicode.js";

import * as Languages from "../../languages.js";
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
    ARGUMENT = `:`,
}

enum Parameter
{
    LANGUAGE = `lang`,
}

export enum Known_Value
{
    CENTER = `⸨cen⸩`,

    INDENT = `⸨in⸩`,

    OPEN_ITALIC = `⸨i⸩`,
    CLOSE_ITALIC = `⸨/i⸩`,

    OPEN_BOLD = `⸨b⸩`,
    CLOSE_BOLD = `⸨/b⸩`,

    OPEN_UNDERLINE = `⸨u⸩`,
    CLOSE_UNDERLINE = `⸨/u⸩`,

    OPEN_SMALL_CAPS = `⸨sc⸩`,
    CLOSE_SMALL_CAPS = `⸨/sc⸩`,

    OPEN_ERROR = `⸨err⸩`,
    CLOSE_ERROR = `⸨/err⸩`,

    OPEN_LEFT_TO_RIGHT = `⸨ltr⸩`,
    CLOSE_LEFT_TO_RIGHT = `⸨/ltr⸩`,

    OPEN_RIGHT_TO_LEFT = `⸨rtl⸩`,
    CLOSE_RIGHT_TO_LEFT = `⸨/rtl⸩`,

    CLOSE_LANGUAGE = `⸨/lang⸩`,
}

function Interior_Value(
    value: Value,
):
    Value
{
    return value.replace(/^⸨\/?/, ``).replace(/⸩$/, ``);
}

function Interior_Parameter_Argument(
    value: Value,
):
    [Value, Value] | null
{
    const interior_value: Value = Interior_Value(value);
    const interior_split: Array<Value> = interior_value.split(Symbol.ARGUMENT);

    if (
        interior_split.length === 2 &&
        interior_split[0] != null &&
        interior_split[1] != null &&
        interior_split[0].length > 0 &&
        interior_split[1].length > 0
    ) {
        return interior_split as [Value, Value];
    } else {
        return null;
    }
}

export function Is_Valid_Value(
    value: Value,
):
    boolean
{
    const interior_value: Value = Interior_Value(value);

    return (
        value.length > 2 &&
        value[0] === `⸨` &&
        value[value.length - 1] === `⸩` &&

        interior_value.length > 0 &&
        !/⸨/.test(interior_value) &&
        !/\//.test(interior_value) &&
        !/\s/.test(interior_value) &&
        !/⸩/.test(interior_value)
    );
}

export function Is_Known_Value(
    value: Value,
):
    boolean
{
    if (
        value === Known_Value.CENTER ||

        value === Known_Value.INDENT ||

        value === Known_Value.OPEN_ITALIC ||
        value === Known_Value.CLOSE_ITALIC ||

        value === Known_Value.OPEN_BOLD ||
        value === Known_Value.CLOSE_BOLD ||

        value === Known_Value.OPEN_UNDERLINE ||
        value === Known_Value.CLOSE_UNDERLINE ||

        value === Known_Value.OPEN_SMALL_CAPS ||
        value === Known_Value.CLOSE_SMALL_CAPS ||

        value === Known_Value.OPEN_ERROR ||
        value === Known_Value.CLOSE_ERROR ||

        value === Known_Value.OPEN_LEFT_TO_RIGHT ||
        value === Known_Value.CLOSE_LEFT_TO_RIGHT ||

        value === Known_Value.OPEN_RIGHT_TO_LEFT ||
        value === Known_Value.CLOSE_RIGHT_TO_LEFT ||

        value === Known_Value.CLOSE_LANGUAGE
    ) {
        return true;

    } else {
        const parameter_argument: [Value, Value] | null =
            Interior_Parameter_Argument(value);
        if (parameter_argument != null) {
            if (parameter_argument[0] === Parameter.LANGUAGE) {
                return (
                    parameter_argument[1] === Languages.Name.ENGLISH ||
                    parameter_argument[1] === Languages.Name.HEBREW ||
                    parameter_argument[1] === Languages.Name.GREEK ||
                    parameter_argument[1] === Languages.Name.LATIN
                );

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
    const matches: RegExpMatchArray | null = text.match(/^⸨[^⸩]*⸩/);
    if (matches != null) {
        return matches[0];
    } else {
        return null;
    }
}

export function Last_Non_Value_Index(
    text: string,
):
    Index | null
{
    if (text.length > 0) {
        const matches: RegExpMatchArray | null = text.match(/(⸨[^⸩]*⸩)*$/);
        if (
            matches != null &&
            matches[0].length > 0
        ) {
            const iterator: Unicode.Iterator = new Unicode.Iterator(
                {
                    text: text,
                    index: text.length - matches[0].length,
                },
            );
            if (iterator.Is_At_Start()) {
                return null;
            } else {
                return iterator.Previous().Index();
            }
        } else {
            return new Unicode.Iterator(
                {
                    text: text,
                    index: text.length,
                },
            ).Previous().Index();
        }
    } else {
        return null;
    }
}

export class Instance extends Part.Instance
{
    private parameter: Value | null;
    private argument: Value | null;

    constructor(
        {
            index,
            value,
        }: {
            index: Index,
            value: Value,
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
                language: null,
            }
        );

        Utils.Assert(
            value.length >= 2,
            `A command must have a length of at least 2.`,
        );

        const parameter_argument: [Value, Value] | null =
            Interior_Parameter_Argument(value);
        if (parameter_argument != null) {
            this.parameter = parameter_argument[0];
            this.argument = parameter_argument[1];
        } else {
            this.parameter = null;
            this.argument = null;
        }
    }

    Parameter():
        Value | null
    {
        return this.parameter;
    }

    Argument():
        Value | null
    {
        return this.argument;
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

    Is_Opening():
        boolean
    {
        return this.Value()[1] !== `/`;
    }

    Is_Closing():
        boolean
    {
        return this.Value()[1] === `/`;
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

    Is_Open_Error():
        boolean
    {
        return this.Value() === Known_Value.OPEN_ERROR;
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

    Is_Open_English():
        boolean
    {
        return (
            this.Parameter() === Parameter.LANGUAGE &&
            this.Argument() === Languages.Name.ENGLISH
        );
    }

    Is_Open_Hebrew():
        boolean
    {
        return (
            this.Parameter() === Parameter.LANGUAGE &&
            this.Argument() === Languages.Name.HEBREW
        );
    }

    Is_Open_Greek():
        boolean
    {
        return (
            this.Parameter() === Parameter.LANGUAGE &&
            this.Argument() === Languages.Name.GREEK
        );
    }

    Is_Open_Latin():
        boolean
    {
        return (
            this.Parameter() === Parameter.LANGUAGE &&
            this.Argument() === Languages.Name.LATIN
        );
    }

    Is_Close_Language():
        boolean
    {
        return this.Value() === Known_Value.CLOSE_LANGUAGE;
    }
}
