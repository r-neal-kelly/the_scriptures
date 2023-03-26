import { Value } from "../value.js";

import * as Part from "./instance.js";
import { Type } from "./type.js";
import { Status } from "./status.js";
import { Style } from "./style.js";

export enum Known_Value
{
    CENTER = `｟cen｠`,

    INDENT = `｟in｠`,

    OPEN_ITALIC = `｟i｠`,
    CLOSE_ITALIC = `｟/i｠`,

    OPEN_BOLD = `｟b｠`,
    CLOSE_BOLD = `｟/b｠`,

    OPEN_UNDERLINE = `｟u｠`,
    CLOSE_UNDERLINE = `｟/u｠`,

    OPEN_SMALL_CAPS = `｟sc｠`,
    CLOSE_SMALL_CAPS = `｟/sc｠`,

    OPEN_ERROR = `｟err｠`,
    CLOSE_ERROR = `｟/err｠`,
}

export function Is_Valid_Value(
    value: Value,
):
    boolean
{
    const interior_value: Value =
        value.replace(/^｟\/?/, ``).replace(/｠$/, ``);

    return (
        value.length > 2 &&
        value[0] === `｟` &&
        value[value.length - 1] === `｠` &&

        interior_value.length > 0 &&
        !/｟/.test(interior_value) &&
        !/\//.test(interior_value) &&
        !/\s/.test(interior_value) &&
        !/｠/.test(interior_value)
    );
}

export function Is_Known_Value(
    value: Value,
):
    boolean
{
    return (
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
        value === Known_Value.CLOSE_ERROR
    );
}

export function Valid_Value_From(
    text: string,
):
    string | null
{
    const matches: RegExpMatchArray | null = text.match(/^｟\/?[^｟\/｠]+｠/);
    if (matches != null) {
        return matches[0];
    } else {
        return null;
    }
}

export function Maybe_Valid_Value_From(
    text: string,
):
    string | null
{
    const matches: RegExpMatchArray | null = text.match(/^｟[^｠]*｠/);
    if (matches != null) {
        return matches[0];
    } else {
        return null;
    }
}

export class Instance extends Part.Instance
{
    constructor(
        {
            value,
        }: {
            value: Value,
        },
    )
    {
        super(
            {
                type: Type.COMMAND,
                value: value,
                status: Is_Known_Value(value) ?
                    Status.GOOD :
                    Is_Valid_Value(value) ?
                        Status.UNKNOWN :
                        Status.ERROR,
                style: Style._NONE_,
            }
        );
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
}
