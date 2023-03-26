import * as Part from "./instance.js";
import { Type } from "./type.js";
import { Status } from "./status.js";
import { Style } from "./style.js";
export var Known_Value;
(function (Known_Value) {
    Known_Value["CENTER"] = "\uFF5Fcen\uFF60";
    Known_Value["INDENT"] = "\uFF5Fin\uFF60";
    Known_Value["OPEN_ITALIC"] = "\uFF5Fi\uFF60";
    Known_Value["CLOSE_ITALIC"] = "\uFF5F/i\uFF60";
    Known_Value["OPEN_BOLD"] = "\uFF5Fb\uFF60";
    Known_Value["CLOSE_BOLD"] = "\uFF5F/b\uFF60";
    Known_Value["OPEN_UNDERLINE"] = "\uFF5Fu\uFF60";
    Known_Value["CLOSE_UNDERLINE"] = "\uFF5F/u\uFF60";
    Known_Value["OPEN_SMALL_CAPS"] = "\uFF5Fsc\uFF60";
    Known_Value["CLOSE_SMALL_CAPS"] = "\uFF5F/sc\uFF60";
    Known_Value["OPEN_ERROR"] = "\uFF5Ferr\uFF60";
    Known_Value["CLOSE_ERROR"] = "\uFF5F/err\uFF60";
})(Known_Value || (Known_Value = {}));
export function Is_Valid_Value(value) {
    const interior_value = value.replace(/^｟\/?/, ``).replace(/｠$/, ``);
    return (value.length > 2 &&
        value[0] === `｟` &&
        value[value.length - 1] === `｠` &&
        interior_value.length > 0 &&
        !/｟/.test(interior_value) &&
        !/\//.test(interior_value) &&
        !/\s/.test(interior_value) &&
        !/｠/.test(interior_value));
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
    const matches = text.match(/^｟\/?[^｟\/｠]+｠/);
    if (matches != null) {
        return matches[0];
    }
    else {
        return null;
    }
}
export function Maybe_Valid_Value_From(text) {
    const matches = text.match(/^｟[^｠]*｠/);
    if (matches != null) {
        return matches[0];
    }
    else {
        return null;
    }
}
export class Instance extends Part.Instance {
    constructor({ value, }) {
        super({
            type: Type.COMMAND,
            value: value,
            status: Is_Known_Value(value) ?
                Status.GOOD :
                Is_Valid_Value(value) ?
                    Status.UNKNOWN :
                    Status.ERROR,
            style: Style._NONE_,
        });
    }
    Is_Center() {
        return this.Value() === Known_Value.CENTER;
    }
    Is_Indent() {
        return this.Value() === Known_Value.INDENT;
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
