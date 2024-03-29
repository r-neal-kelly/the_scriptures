import { Integer } from "./types.js";
import { Count } from "./types.js";
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

export function Assert_Even_In_Release(
    boolean_statement: boolean,
    failure_message: string = `Failed assert.`,
):
    void
{
    if (boolean_statement === false) {
        throw new Error(failure_message);
    }
}

export function Print(
    ...data: any
):
    void
{
    console.log(...data);
}

const is_big_endian: boolean =
    new TextDecoder(`utf-16be`).decode(
        new Uint16Array([0x0041]),
    ) === String.fromCharCode(0x0041);

export function Is_Big_Endian():
    boolean
{
    return is_big_endian;
}

export function Is_Little_Endian():
    boolean
{
    return !is_big_endian;
}

export function Is_Landscape():
    boolean
{
    return document.documentElement.clientHeight <= document.documentElement.clientWidth;
}

export function Is_Portrait():
    boolean
{
    return document.documentElement.clientHeight > document.documentElement.clientWidth;
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

    if (milliseconds > 0) {
        return new Promise(
            function (
                resolve,
            ):
                void
            {
                setTimeout(resolve, milliseconds);
            },
        );
    }
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

    if (seconds > 0) {
        return Wait_Milliseconds(seconds * 1000);
    }
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

export function Remove_File_Extension(
    file_name_or_path: string,
):
    string
{
    return file_name_or_path.replace(/\.[^.]*$/, ``);
}

export function Add_Commas_To_Number(
    number: Integer,
):
    string
{
    const string: string = `${number}`;
    const remainder: Count = string.length % 3;

    let result: string = ``;
    let slice: string = string;

    if (remainder !== 0) {
        result += `${slice.slice(0, remainder)},`;
        slice = slice.slice(remainder);
    }

    while (slice.length > 0) {
        result += `${slice.slice(0, 3)},`;
        slice = slice.slice(3);
    }

    return result.slice(0, result.length - 1);
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

export function Can_Use_Workers():
    boolean
{
    return window.Worker != null;
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

export function Styles_To_Inline_String(
    styles: { [css_property: string]: string },
    interior_quotation_mark: string,
):
    string
{
    Assert(
        interior_quotation_mark === `"` ||
        interior_quotation_mark === `'`,
        `invalid interior_quotation_mark`,
    );

    let result: string = ``;

    for (const css_property of Object.keys(styles)) {
        const css_value: string =
            styles[css_property].replace(/["']/g, interior_quotation_mark);

        result += `${css_property}:${css_value};`;
    }

    return result;
}
