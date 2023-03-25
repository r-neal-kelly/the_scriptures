export var Value;
(function (Value) {
    Value["CENTER"] = "\uFF5Fcen\uFF60";
    Value["INDENT"] = "\uFF5Fin\uFF60";
    Value["OPEN_BOLD"] = "\uFF5Fb\uFF60";
    Value["CLOSE_BOLD"] = "\uFF5F/b\uFF60";
    Value["OPEN_ITALIC"] = "\uFF5Fi\uFF60";
    Value["CLOSE_ITALIC"] = "\uFF5F/i\uFF60";
    Value["OPEN_UNDERLINE"] = "\uFF5Fu\uFF60";
    Value["CLOSE_UNDERLINE"] = "\uFF5F/u\uFF60";
    Value["OPEN_SMALL_CAPS"] = "\uFF5Fsc\uFF60";
    Value["CLOSE_SMALL_CAPS"] = "\uFF5F/sc\uFF60";
    Value["OPEN_ERROR"] = "\uFF5Ferr\uFF60";
    Value["CLOSE_ERROR"] = "\uFF5F/err\uFF60";
})(Value || (Value = {}));
export class Instance {
    constructor({ value, }) {
        this.value = value;
    }
    Value() {
        return this.value;
    }
    Indented() {
        return this.value === Value.INDENT;
    }
}
export const CENTER = new Instance({
    value: Value.CENTER,
});
export const INDENT = new Instance({
    value: Value.INDENT,
});
export const OPEN_BOLD = new Instance({
    value: Value.OPEN_BOLD,
});
export const CLOSE_BOLD = new Instance({
    value: Value.CLOSE_BOLD,
});
export const OPEN_ITALIC = new Instance({
    value: Value.OPEN_ITALIC,
});
export const CLOSE_ITALIC = new Instance({
    value: Value.CLOSE_ITALIC,
});
export const OPEN_UNDERLINE = new Instance({
    value: Value.OPEN_UNDERLINE,
});
export const CLOSE_UNDERLINE = new Instance({
    value: Value.CLOSE_UNDERLINE,
});
export const OPEN_SMALL_CAPS = new Instance({
    value: Value.OPEN_SMALL_CAPS,
});
export const CLOSE_SMALL_CAPS = new Instance({
    value: Value.CLOSE_SMALL_CAPS,
});
export const OPEN_ERROR = new Instance({
    value: Value.OPEN_ERROR,
});
export const CLOSE_ERROR = new Instance({
    value: Value.CLOSE_ERROR,
});
