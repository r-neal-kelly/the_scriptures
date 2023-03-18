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
    milliseconds: number,
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
    seconds: number,
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

export function Create_Style_Element(
    inner_css: string,
):
    HTMLStyleElement
{
    const style: HTMLStyleElement = document.createElement(`style`);

    style.setAttribute(
        `type`,
        `text/css`,
    );

    style.appendChild(
        document.createTextNode(inner_css),
    );

    document.head.appendChild(style);

    return style;
}
