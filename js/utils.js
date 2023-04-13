var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function Assert(boolean_statement, failure_message = `Failed assert.`) {
    if (boolean_statement === false) {
        throw new Error(failure_message);
    }
}
export function Wait_Milliseconds(milliseconds) {
    return __awaiter(this, void 0, void 0, function* () {
        Assert(milliseconds >= 0, `Can't wait for negative milliseconds.`);
        Assert(milliseconds < Infinity, `Can't wait for infinite milliseconds.`);
        return new Promise(function (resolve, reject) {
            setTimeout(resolve, milliseconds);
        });
    });
}
export function Wait_Seconds(seconds) {
    return __awaiter(this, void 0, void 0, function* () {
        Assert(seconds >= 0, `Can't wait for negative seconds.`);
        Assert(seconds < Infinity, `Can't wait for infinite seconds.`);
        Assert(seconds * 1000 < Infinity, `Can't convert seconds to milliseconds, it's too big.`);
        return Wait_Milliseconds(seconds * 1000);
    });
}
function Is_Type(type, instance) {
    return type.test(Object.prototype.toString.call(instance).replace(/^[^ ]+ |.$/g, ``));
}
export const Is = {
    Undefined: (x) => Is_Type(/^Undefined$/, x),
    Null: (x) => Is_Type(/^Null$/, x),
    Undefined_Or_Null: (x) => Is_Type(/^Undefined$|^Null$/, x),
    Boolean: (x) => Is_Type(/^Boolean$/, x),
    Number: (x) => Is_Type(/^Number$/, x) && x === x && x !== Infinity && x !== -Infinity,
    Infinity: (x) => Is_Type(/^Number$/, x) && x === Infinity || x === -Infinity,
    Number_Or_Infinity: (x) => Is_Type(/^Number$/, x) && x === x,
    NaN: (x) => Is_Type(/^Number$/, x) && x !== x,
    Object: (x) => Is_Type(/^Object$/, x),
    Array: (x) => Is_Type(/^Array$/, x),
    String: (x) => Is_Type(/^String$/, x),
    Function: (x) => Is_Type(/^Function$/, x),
    Symbol: (x) => Is_Type(/^Symbol$/, x),
    Date: (x) => Is_Type(/^Date$/, x),
    RegExp: (x) => Is_Type(/^RegExp$/, x),
    Set: (x) => Is_Type(/^Set$/, x),
    Map: (x) => Is_Type(/^Map$/, x),
    Window: (x) => Is_Type(/^Window$/, x),
    Global: (x) => Is_Type(/^global$/, x),
    Window_Or_Global: (x) => Is_Type(/^Window$|^global$/, x),
};
Object.freeze(Is);
export function Escape_Regular_Expression(regular_expression) {
    // Courtesy of Mozilla Developer Network.
    return regular_expression.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
}
export function Resolve_Path(path_from_root) {
    Assert(!/^\.\//.test(path_from_root), `Path must be relative to the root, and not anything else.`);
    Assert(!/^\.\.\//.test(path_from_root), `Path must be relative to the root, and can't go above root.`);
    path_from_root = path_from_root.replace(/\\/g, `/`);
    path_from_root = path_from_root.replace(/^\//, ``);
    if (/github.io$/.test(window.location.hostname)) {
        return `https://raw.githubusercontent.com/r-neal-kelly/the_scriptures/master/${path_from_root}`;
    }
    else {
        return `${window.location.origin}/${path_from_root}`;
    }
}
export function Create_Style_Element(inner_css) {
    const style_element = document.createElement(`style`);
    style_element.setAttribute(`type`, `text/css`);
    style_element.appendChild(document.createTextNode(inner_css));
    document.head.appendChild(style_element);
    return style_element;
}
export function Destroy_Style_Element(style_element) {
    document.head.removeChild(style_element);
}
