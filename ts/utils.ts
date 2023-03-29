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

    if (/github.io$/.test(window.location.hostname)) {
        return `https://raw.githubusercontent.com/r-neal-kelly/the_scriptures/master/${path_from_root}`;
    } else {
        return `${window.location.origin}/${path_from_root}`;
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
