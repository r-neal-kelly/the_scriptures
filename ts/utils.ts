import { Integer } from "./types.js";
import { Path } from "./types.js";

export function Assert(
    boolean_statement: boolean,
    failure_message: string = `Failed assert.`,
):
    void
{
    if (boolean_statement === false) {
        throw new Error(failure_message);
    }
}

export async function Wait_Milliseconds(
    milliseconds: Integer,
):
    Promise<void>
{
    Assert(
        milliseconds >= 0,
        `Can't wait for negative milliseconds.`,
    );
    Assert(
        milliseconds < Infinity,
        `Can't wait for infinite milliseconds.`,
    );

    return new Promise(
        function (
            resolve,
            reject,
        ):
            void
        {
            setTimeout(resolve, milliseconds);
        },
    );
}

export async function Wait_Seconds(
    seconds: Integer,
):
    Promise<void>
{
    Assert(
        seconds >= 0,
        `Can't wait for negative seconds.`,
    );
    Assert(
        seconds < Infinity,
        `Can't wait for infinite seconds.`,
    );
    Assert(
        seconds * 1000 < Infinity,
        `Can't convert seconds to milliseconds, it's too big.`,
    );

    return Wait_Milliseconds(seconds * 1000);
}

function Is_Type(
    type: RegExp,
    instance: any,
):
    boolean
{
    return type.test(
        Object.prototype.toString.call(instance).replace(/^[^ ]+ |.$/g, ``),
    );
}

export const Is = {
    Undefined: (x: any) => Is_Type(/^Undefined$/, x),
    Null: (x: any) => Is_Type(/^Null$/, x),
    Undefined_Or_Null: (x: any) => Is_Type(/^Undefined$|^Null$/, x),

    Boolean: (x: any) => Is_Type(/^Boolean$/, x),
    Number: (x: any) => Is_Type(/^Number$/, x) && x === x && x !== Infinity && x !== -Infinity,
    Infinity: (x: any) => Is_Type(/^Number$/, x) && x === Infinity || x === -Infinity,
    Number_Or_Infinity: (x: any) => Is_Type(/^Number$/, x) && x === x,
    NaN: (x: any) => Is_Type(/^Number$/, x) && x !== x,

    Object: (x: any) => Is_Type(/^Object$/, x),
    Array: (x: any) => Is_Type(/^Array$/, x),
    String: (x: any) => Is_Type(/^String$/, x),
    Function: (x: any) => Is_Type(/^Function$/, x),

    Symbol: (x: any) => Is_Type(/^Symbol$/, x),
    Date: (x: any) => Is_Type(/^Date$/, x),
    RegExp: (x: any) => Is_Type(/^RegExp$/, x),
    Set: (x: any) => Is_Type(/^Set$/, x),
    Map: (x: any) => Is_Type(/^Map$/, x),

    Window: (x: any) => Is_Type(/^Window$/, x),
    Global: (x: any) => Is_Type(/^global$/, x),
    Window_Or_Global: (x: any) => Is_Type(/^Window$|^global$/, x),
};
Object.freeze(Is);

export function Escape_Regular_Expression(
    regular_expression: string,
):
    string
{
    // Courtesy of Mozilla Developer Network.
    return regular_expression.replace(
        /[.*+?^${}()|[\]\\]/g,
        `\\$&`,
    );
}

export function Resolve_Path(
    path_from_root: Path,
):
    Path
{
    Assert(
        !/^\.\//.test(path_from_root),
        `Path must be relative to the root, and not anything else.`,
    );
    Assert(
        !/^\.\.\//.test(path_from_root),
        `Path must be relative to the root, and can't go above root.`,
    );

    path_from_root = path_from_root.replace(/\\/g, `/`);
    path_from_root = path_from_root.replace(/^\//, ``);

    if (Is.Window(globalThis)) {
        if (/github.io$/.test(window.location.hostname)) {
            return `https://raw.githubusercontent.com/r-neal-kelly/the_scriptures/master/${path_from_root}`;
        } else {
            return `${window.location.origin}/${path_from_root}`;
        }
    } else {
        return path_from_root;
    }
}

export function Create_Style_Element(
    inner_css: string,
):
    HTMLStyleElement
{
    const style_element: HTMLStyleElement =
        document.createElement(`style`);

    style_element.setAttribute(
        `type`,
        `text/css`,
    );

    style_element.appendChild(
        document.createTextNode(inner_css),
    );

    document.head.appendChild(style_element);

    return style_element;
}

export function Destroy_Style_Element(
    style_element: HTMLStyleElement,
):
    void
{
    document.head.removeChild(style_element);
}
