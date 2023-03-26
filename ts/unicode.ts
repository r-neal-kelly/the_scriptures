import { Count } from "./types.js";
import { Index } from "./types.js";

import * as Utils from "./utils.js";

export enum LEADING_SURROGATE
{
    FIRST = 0xD800,
    LAST = 0xDBFF,
}
export enum TRAILING_SURROGATE
{
    FIRST = 0xDC00,
    LAST = 0xDFFF,
}
export { LEADING_SURROGATE as HIGH_SURROGATE };
export { TRAILING_SURROGATE as LOW_SURROGATE };

export function Is_Point(
    text: string,
):
    boolean
{
    return (
        text.length === 1 ||
        (
            text.length === 2 &&
            text.charCodeAt(0) >= LEADING_SURROGATE.FIRST &&
            text.charCodeAt(0) <= LEADING_SURROGATE.LAST &&
            text.charCodeAt(1) >= TRAILING_SURROGATE.FIRST &&
            text.charCodeAt(1) <= TRAILING_SURROGATE.LAST
        )
    );
}

export function First_Point(
    text: string,
):
    string
{
    if (text.length === 0) {
        return ``;
    } else {
        // This will return a leading or trailing surrogate
        // if the text string is malformed and has incomplete pairs.
        if (
            text.charCodeAt(0) < LEADING_SURROGATE.FIRST ||
            text.charCodeAt(0) > LEADING_SURROGATE.LAST
        ) {
            return text.slice(0, 1);
        } else {
            const surrogate_pair: string = text.slice(0, 2);
            if (
                surrogate_pair.charCodeAt(1) >= TRAILING_SURROGATE.FIRST &&
                surrogate_pair.charCodeAt(1) <= TRAILING_SURROGATE.LAST
            ) {
                return surrogate_pair;
            } else {
                return text.slice(0, 1);
            }
        }
    }
}

export function Point_Count(
    text: string,
):
    Count
{
    let count: Count = 0;
    for (let it = new Iterator({ text: text }); !it.Is_At_End(); it = it.Next()) {
        count += 1;
    }

    return count;
}

export class Iterator
{
    private text: string;
    private index: Index;
    private value: string;

    constructor(
        {
            text,
            index = 0,
        }: {
            text: string,
            index?: Index,
        },
    )
    {
        Utils.Assert(
            index > -1,
            `index must be greater than -1.`,
        );
        Utils.Assert(
            index <= text.length,
            `index must be less than or equal to text length.`,
        );

        this.text = text;
        this.index = index;
        this.value = First_Point(this.text.slice(this.index));
    }

    Copy():
        Iterator
    {
        return new Iterator(
            {
                text: this.text,
                index: this.index,
            },
        );
    }

    Text():
        string
    {
        return this.text;
    }

    Index():
        Index
    {
        return this.index;
    }

    Point():
        string
    {
        Utils.Assert(
            !this.Is_At_End(),
            `Iterator is at the end of the string.`,
        );

        return this.value;
    }

    Points():
        string
    {
        Utils.Assert(
            !this.Is_At_End(),
            `Iterator is at the end of the string.`,
        );

        return this.text.slice(this.index);
    }

    Look_Forward_Index():
        Index
    {
        Utils.Assert(
            !this.Is_At_End(),
            `Iterator is at the end of the string.`,
        );

        return this.Next().Index();
    }

    Look_Forward_Point():
        string | null
    {
        Utils.Assert(
            !this.Is_At_End(),
            `Iterator is at the end of the string.`,
        );

        const next: Iterator = this.Next();
        if (next.Is_At_End()) {
            return null;
        } else {
            return next.Point();
        }
    }

    Look_Forward_Points():
        string | null
    {
        Utils.Assert(
            !this.Is_At_End(),
            `Iterator is at the end of the string.`,
        );

        const next: Iterator = this.Next();
        if (next.Is_At_End()) {
            return null;
        } else {
            return next.Points();
        }
    }

    Is_At_End():
        boolean
    {
        return this.index >= this.text.length;
    }

    Next():
        Iterator
    {
        Utils.Assert(
            !this.Is_At_End(),
            `Iterator is at the end of the string.`,
        );

        return new Iterator(
            {
                text: this.text,
                index: this.index + this.value.length,
            },
        );
    }
}
