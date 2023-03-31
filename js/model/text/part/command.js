import * as Utils from "../../../utils.js";
import * as Unicode from "../../../unicode.js";
import * as Part from "./instance.js";
import { Type } from "./type.js";
import { Status } from "./status.js";
import { Style } from "./style.js";
export var Known_Value;
(function (Known_Value) {
    Known_Value["CENTER"] = "\u2E28cen\u2E29";
    Known_Value["INDENT"] = "\u2E28in\u2E29";
    Known_Value["OPEN_ITALIC"] = "\u2E28i\u2E29";
    Known_Value["CLOSE_ITALIC"] = "\u2E28/i\u2E29";
    Known_Value["OPEN_BOLD"] = "\u2E28b\u2E29";
    Known_Value["CLOSE_BOLD"] = "\u2E28/b\u2E29";
    Known_Value["OPEN_UNDERLINE"] = "\u2E28u\u2E29";
    Known_Value["CLOSE_UNDERLINE"] = "\u2E28/u\u2E29";
    Known_Value["OPEN_SMALL_CAPS"] = "\u2E28sc\u2E29";
    Known_Value["CLOSE_SMALL_CAPS"] = "\u2E28/sc\u2E29";
    Known_Value["OPEN_ERROR"] = "\u2E28err\u2E29";
    Known_Value["CLOSE_ERROR"] = "\u2E28/err\u2E29";
})(Known_Value || (Known_Value = {}));
export function Is_Valid_Value(value) {
    const interior_value = value.replace(/^⸨\/?/, ``).replace(/⸩$/, ``);
    return (value.length > 2 &&
        value[0] === `⸨` &&
        value[value.length - 1] === `⸩` &&
        interior_value.length > 0 &&
        !/⸨/.test(interior_value) &&
        !/\//.test(interior_value) &&
        !/\s/.test(interior_value) &&
        !/⸩/.test(interior_value));
}
export function Is_Known_Value(value) {
    return (value === Known_Value.CENTER ||
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
        value === Known_Value.CLOSE_ERROR);
}
export function Valid_Value_From(text) {
    const matches = text.match(/^⸨\/?[^⸨\/⸩]+⸩/);
    if (matches != null) {
        return matches[0];
    }
    else {
        return null;
    }
}
export function Maybe_Valid_Value_From(text) {
    const matches = text.match(/^⸨[^⸩]*⸩/);
    if (matches != null) {
        return matches[0];
    }
    else {
        return null;
    }
}
export function Last_Non_Value_Index(text) {
    if (text.length > 0) {
        const matches = text.match(/(⸨[^⸩]*⸩)*$/);
        if (matches != null &&
            matches[0].length > 0) {
            const iterator = new Unicode.Iterator({
                text: text,
                index: text.length - matches[0].length,
            });
            if (iterator.Is_At_Start()) {
                return null;
            }
            else {
                return iterator.Previous().Index();
            }
        }
        else {
            return new Unicode.Iterator({
                text: text,
                index: text.length,
            }).Previous().Index();
        }
    }
    else {
        return null;
    }
}
export class Instance extends Part.Instance {
    constructor({ value, }) {
        super({
            part_type: Type.COMMAND,
            value: value,
            status: Is_Known_Value(value) ?
                Status.GOOD :
                Is_Valid_Value(value) ?
                    Status.UNKNOWN :
                    Status.ERROR,
            style: Style._NONE_,
        });
        Utils.Assert(value.length >= 2, `A command must have a length of at least 2.`);
    }
    Is_Center() {
        return this.Value() === Known_Value.CENTER;
    }
    Is_Indent() {
        return this.Value() === Known_Value.INDENT;
    }
    Is_Opening() {
        return this.Value()[1] !== `/`;
    }
    Is_Closing() {
        return this.Value()[1] === `/`;
    }
    Is_Open_Italic() {
        return this.Value() === Known_Value.OPEN_ITALIC;
    }
    Is_Close_Italic() {
        return this.Value() === Known_Value.CLOSE_ITALIC;
    }
    Is_Open_Bold() {
        return this.Value() === Known_Value.OPEN_BOLD;
    }
    Is_Close_Bold() {
        return this.Value() === Known_Value.CLOSE_BOLD;
    }
    Is_Open_Underline() {
        return this.Value() === Known_Value.OPEN_UNDERLINE;
    }
    Is_Close_Underline() {
        return this.Value() === Known_Value.CLOSE_UNDERLINE;
    }
    Is_Open_Small_Caps() {
        return this.Value() === Known_Value.OPEN_SMALL_CAPS;
    }
    Is_Close_Small_Caps() {
        return this.Value() === Known_Value.CLOSE_SMALL_CAPS;
    }
    Is_Open_Error() {
        return this.Value() === Known_Value.OPEN_ERROR;
    }
    Is_Close_Error() {
        return this.Value() === Known_Value.CLOSE_ERROR;
    }
}
