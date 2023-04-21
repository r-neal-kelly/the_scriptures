import { Index } from "../../../types.js"

import * as Utils from "../../../utils.js";

import { Value } from "../value.js";
import * as Item from "../item.js";
import { Type } from "./type.js";
import { Status } from "./status.js";
import { Style } from "./style.js";

export class Instance implements Item.Instance
{
    private part_type: Type;
    private index: Index;
    private value: Value;
    private status: Status;
    private style: Style;

    constructor(
        {
            part_type,
            index,
            value,
            status,
            style,
        }: {
            part_type: Type,
            index: Index,
            value: Value,
            status: Status,
            style: Style | Array<Style>,
        },
    )
    {
        Utils.Assert(
            index > -1,
            `index must be greater than -1.`,
        );
        Utils.Assert(
            value.length > 0,
            `value must have a length greater than 0.`,
        );

        this.part_type = part_type;
        this.index = index;
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

    Item_Type():
        Item.Type
    {
        return Item.Type.PART;
    }

    Is_Part():
        boolean
    {
        return true;
    }

    Is_Split():
        boolean
    {
        return false;
    }

    Part_Type():
        Type
    {
        return this.part_type;
    }

    Is_Point():
        boolean
    {
        return this.part_type === Type.POINT;
    }

    Is_Letter():
        boolean
    {
        return this.part_type === Type.LETTER;
    }

    Is_Marker():
        boolean
    {
        return this.part_type === Type.MARKER;
    }

    Is_Word():
        boolean
    {
        return this.part_type === Type.WORD;
    }

    Is_Break():
        boolean
    {
        return this.part_type === Type.BREAK;
    }

    Is_Command():
        boolean
    {
        return this.part_type === Type.COMMAND;
    }

    Index():
        Index
    {
        return this.index;
    }

    Part_Index():
        Index
    {
        return this.index;
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
