import { Integer } from "./types.js";
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

// we could use String.prototype.codePointAt
export function First_Point(
    text: string,
):
    string
{
    if (text.length === 0) {
        return ``;
    } else {
        const first_unit: Integer = text.charCodeAt(0);
        if (
            first_unit < LEADING_SURROGATE.FIRST ||
            first_unit > TRAILING_SURROGATE.LAST
        ) {
            return text.slice(0, 1);
        } else {
            const second_unit: Integer = text.charCodeAt(1);
            if (
                first_unit >= LEADING_SURROGATE.FIRST &&
                first_unit <= LEADING_SURROGATE.LAST &&
                second_unit >= TRAILING_SURROGATE.FIRST &&
                second_unit <= TRAILING_SURROGATE.LAST
            ) {
                return text.slice(0, 2);
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

export function Points(
    text: string,
):
    Array<string>
{
    const result: Array<string> = [];

    for (let it = new Iterator({ text: text }); !it.Is_At_End(); it = it.Next()) {
        result.push(it.Point());
    }

    return result;
}

export function Has_Point(
    text: string,
    point: string,
):
    boolean
{
    Utils.Assert(
        Is_Point(point),
        `point must be a point.`,
    );

    let iter: Iterator = new Iterator(
        {
            text: text,
        },
    );

    for (; !iter.Is_At_End(); iter = iter.Next()) {
        if (iter.Point() === point) {
            return true;
        }
    }

    return false;
}

export function Expected_UTF_8_Unit_Count(
    text: string,
):
    Count
{
    let unit_count: Count = 0;
    let iter: Iterator = new Iterator(
        {
            text: text,
        },
    );

    for (; !iter.Is_At_End(); iter = iter.Next()) {
        const point: Index = iter.Point().codePointAt(0) as Index;

        if (point <= 0x7F) {
            unit_count += 1;
        } else if (point <= 0x7FF) {
            unit_count += 2;
        } else if (point <= 0xFFFF) {
            unit_count += 3;
        } else {
            unit_count += 4;
        }
    }

    return unit_count;
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
            value = null,
        }: {
            text: string,
            index?: Index,
            value?: string | null,
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
        if (value != null) {
            this.value = value;
        } else {
            this.value = First_Point(this.text.slice(this.index));
        }
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

    Is_At_Start():
        boolean
    {
        return this.index === 0;
    }

    Is_At_End():
        boolean
    {
        return this.index >= this.text.length;
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

    Previous():
        Iterator
    {
        Utils.Assert(
            !this.Is_At_Start(),
            `Iterator is at the start of the string.`,
        );

        const first_unit: Integer = this.text.charCodeAt(this.index - 1);
        if (
            first_unit < LEADING_SURROGATE.FIRST ||
            first_unit > TRAILING_SURROGATE.LAST ||
            this.index < 2
        ) {
            return new Iterator(
                {
                    text: this.text,
                    index: this.index - 1,
                    value: this.text.slice(this.index - 1, this.index),
                },
            );
        } else {
            const second_unit: Integer = this.text.charCodeAt(this.index - 2);
            if (
                second_unit >= LEADING_SURROGATE.FIRST &&
                second_unit <= LEADING_SURROGATE.LAST &&
                first_unit >= TRAILING_SURROGATE.FIRST &&
                first_unit <= TRAILING_SURROGATE.LAST
            ) {
                return new Iterator(
                    {
                        text: this.text,
                        index: this.index - 2,
                        value: this.text.slice(this.index - 2, this.index),
                    },
                );
            } else {
                return new Iterator(
                    {
                        text: this.text,
                        index: this.index - 1,
                        value: this.text.slice(this.index - 1, this.index),
                    },
                );
            }
        }
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

    Look_Backward_Index():
        Index
    {
        Utils.Assert(
            !this.Is_At_Start(),
            `Iterator is at the start of the string.`,
        );

        return this.Previous().Index();
    }

    Look_Backward_Point():
        string | null
    {
        Utils.Assert(
            !this.Is_At_Start(),
            `Iterator is at the start of the string.`,
        );

        return this.Previous().Point();
    }

    Look_Backward_Points():
        string | null
    {
        Utils.Assert(
            !this.Is_At_Start(),
            `Iterator is at the start of the string.`,
        );

        return this.Previous().Points();
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
}
