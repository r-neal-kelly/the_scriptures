import * as Utils from "../../../utils.js";
import * as Item from "../item.js";
import { Type } from "./type.js";
import { Status } from "./status.js";
import { Style } from "./style.js";
export class Instance extends Item.Instance {
    constructor({ part_type, value, status, style, }) {
        super({
            item_type: Item.Type.PART,
        });
        Utils.Assert(value.length > 0, `value must have a length greater than 0.`);
        this.part_type = part_type;
        this.value = value;
        this.status = status;
        if (style instanceof Array) {
            this.style = Style._NONE_;
            for (const value of style) {
                this.style |= value;
            }
        }
        else {
            this.style = style;
        }
    }
    Part_Type() {
        return this.part_type;
    }
    Is_Point() {
        return this.part_type === Type.POINT;
    }
    Is_Letter() {
        return this.part_type === Type.LETTER;
    }
    Is_Marker() {
        return this.part_type === Type.MARKER;
    }
    Is_Word() {
        return this.part_type === Type.WORD;
    }
    Is_Break() {
        return this.part_type === Type.BREAK;
    }
    Is_Command() {
        return this.part_type === Type.COMMAND;
    }
    Value() {
        return this.value;
    }
    Status() {
        return this.status;
    }
    Is_Good() {
        return this.status === Status.GOOD;
    }
    Is_Unknown() {
        return this.status === Status.UNKNOWN;
    }
    Is_Error() {
        return this.status === Status.ERROR;
    }
    Style() {
        return this.style;
    }
    Has_Italic_Style() {
        return (this.style & Style.ITALIC) != 0;
    }
    Has_Bold_Style() {
        return (this.style & Style.BOLD) != 0;
    }
    Has_Underline_Style() {
        return (this.style & Style.UNDERLINE) != 0;
    }
    Has_Small_Caps_Style() {
        return (this.style & Style.SMALL_CAPS) != 0;
    }
    Has_Error_Style() {
        return (this.style & Style.ERROR) != 0;
    }
}
