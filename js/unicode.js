import * as Utils from "./utils.js";
export var LEADING_SURROGATE;
(function (LEADING_SURROGATE) {
    LEADING_SURROGATE[LEADING_SURROGATE["FIRST"] = 55296] = "FIRST";
    LEADING_SURROGATE[LEADING_SURROGATE["LAST"] = 56319] = "LAST";
})(LEADING_SURROGATE || (LEADING_SURROGATE = {}));
export var TRAILING_SURROGATE;
(function (TRAILING_SURROGATE) {
    TRAILING_SURROGATE[TRAILING_SURROGATE["FIRST"] = 56320] = "FIRST";
    TRAILING_SURROGATE[TRAILING_SURROGATE["LAST"] = 57343] = "LAST";
})(TRAILING_SURROGATE || (TRAILING_SURROGATE = {}));
export { LEADING_SURROGATE as HIGH_SURROGATE };
export { TRAILING_SURROGATE as LOW_SURROGATE };
export function Is_Point(text) {
    return (text.length === 1 ||
        (text.length === 2 &&
            text.charCodeAt(0) >= LEADING_SURROGATE.FIRST &&
            text.charCodeAt(0) <= LEADING_SURROGATE.LAST &&
            text.charCodeAt(1) >= TRAILING_SURROGATE.FIRST &&
            text.charCodeAt(1) <= TRAILING_SURROGATE.LAST));
}
export function First_Point(text) {
    if (text.length === 0) {
        return ``;
    }
    else {
        // This will return a leading or trailing surrogate
        // if the text string is malformed and has incomplete pairs.
        if (text.charCodeAt(0) < LEADING_SURROGATE.FIRST ||
            text.charCodeAt(0) > LEADING_SURROGATE.LAST) {
            return text.slice(0, 1);
        }
        else {
            const surrogate_pair = text.slice(0, 2);
            if (surrogate_pair.charCodeAt(1) >= TRAILING_SURROGATE.FIRST &&
                surrogate_pair.charCodeAt(1) <= TRAILING_SURROGATE.LAST) {
                return surrogate_pair;
            }
            else {
                return text.slice(0, 1);
            }
        }
    }
}
export function Point_Count(text) {
    let count = 0;
    for (let it = new Iterator({ text: text }); !it.Is_At_End(); it = it.Next()) {
        count += 1;
    }
    return count;
}
export class Iterator {
    constructor({ text, index = 0, }) {
        Utils.Assert(index > -1, `index must be greater than -1.`);
        Utils.Assert(index <= text.length, `index must be less than or equal to text length.`);
        this.text = text;
        this.index = index;
        this.value = First_Point(this.text.slice(this.index));
    }
    Copy() {
        return new Iterator({
            text: this.text,
            index: this.index,
        });
    }
    Text() {
        return this.text;
    }
    Index() {
        return this.index;
    }
    Point() {
        Utils.Assert(!this.Is_At_End(), `Iterator is at the end of the string.`);
        return this.value;
    }
    Points() {
        Utils.Assert(!this.Is_At_End(), `Iterator is at the end of the string.`);
        return this.text.slice(this.index);
    }
    Look_Forward_Index() {
        Utils.Assert(!this.Is_At_End(), `Iterator is at the end of the string.`);
        return this.Next().Index();
    }
    Look_Forward_Point() {
        Utils.Assert(!this.Is_At_End(), `Iterator is at the end of the string.`);
        const next = this.Next();
        if (next.Is_At_End()) {
            return null;
        }
        else {
            return next.Point();
        }
    }
    Look_Forward_Points() {
        Utils.Assert(!this.Is_At_End(), `Iterator is at the end of the string.`);
        const next = this.Next();
        if (next.Is_At_End()) {
            return null;
        }
        else {
            return next.Points();
        }
    }
    Is_At_End() {
        return this.index >= this.text.length;
    }
    Next() {
        Utils.Assert(!this.Is_At_End(), `Iterator is at the end of the string.`);
        return new Iterator({
            text: this.text,
            index: this.index + this.value.length,
        });
    }
}
