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
export function Create_Style_Element(inner_css) {
    const style = document.createElement(`style`);
    style.setAttribute(`type`, `text/css`);
    style.appendChild(document.createTextNode(inner_css));
    document.head.appendChild(style);
    return style;
}
