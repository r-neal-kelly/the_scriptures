import * as Utils from "../../../utils.js";

import { Value } from "../value.js";

import { Type } from "./type.js";
import { Status } from "./status.js";
import { Style } from "./style.js";

export class Instance
{
    private type: Type;
    private value: Value;
    private status: Status;
    private style: Style;

    constructor(
        {
            type,
            value,
            status,
            style,
        }: {
            type: Type,
            value: Value,
            status: Status,
            style: Style | Array<Style>,
        },
    )
    {
        Utils.Assert(
            value.length > 0,
            `value must have a length greater than 0.`,
        );

        this.type = type;
        this.value = value;
        this.status = status;
        if (style instanceof Array) {
            this.style = Style._NONE_;
            for (const value of style) {
                this.style |= value;
            }
        } else {
            this.style = style;
        }
    }

    Type():
        Type
    {
        return this.type;
    }

    Is_Point():
        boolean
    {
        return this.type === Type.POINT;
    }

    Is_Letter():
        boolean
    {
        return this.type === Type.LETTER;
    }

    Is_Marker():
        boolean
    {
        return this.type === Type.MARKER;
    }

    Is_Word():
        boolean
    {
        return this.type === Type.WORD;
    }

    Is_Break():
        boolean
    {
        return this.type === Type.BREAK;
    }

    Is_Command():
        boolean
    {
        return this.type === Type.COMMAND;
    }

    Value():
        Value
    {
        return this.value;
    }

    Status():
        Status
    {
        return this.status;
    }

    Is_Good():
        boolean
    {
        return this.status === Status.GOOD;
    }

    Is_Unknown():
        boolean
    {
        return this.status === Status.UNKNOWN;
    }

    Is_Error():
        boolean
    {
        return this.status === Status.ERROR;
    }

    Style():
        Style
    {
        return this.style;
    }

    Has_Italic_Style():
        boolean
    {
        return (this.style & Style.ITALIC) != 0;
    }

    Has_Bold_Style():
        boolean
    {
        return (this.style & Style.BOLD) != 0;
    }

    Has_Underline_Style():
        boolean
    {
        return (this.style & Style.UNDERLINE) != 0;
    }

    Has_Small_Caps_Style():
        boolean
    {
        return (this.style & Style.SMALL_CAPS) != 0;
    }

    Has_Error_Style():
        boolean
    {
        return (this.style & Style.ERROR) != 0;
    }
}
