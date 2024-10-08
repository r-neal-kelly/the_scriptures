import { Count } from "./types.js";
import { Index } from "./types.js";

import * as Utils from "./utils.js";
import * as Unicode from "./unicode.js";

export const LZSS_INDEX_COUNT: Count = Unicode.POINT_COUNT;
export const LZSS_LAST_INDEX: Index = Unicode.LAST_POINT;
export const LZSS_ESCAPE_INDEX: Index = 0x10;
export const LZSS_ESCAPE_STRING: string = String.fromCodePoint(LZSS_ESCAPE_INDEX);

export const LZSS_MAX_STRING_LENGTH: Count = (LZSS_LAST_INDEX * LZSS_INDEX_COUNT) + LZSS_LAST_INDEX;
export const LZSS_MAX_MEMORY_LENGTH: Count = LZSS_INDEX_COUNT;

/*
    There is a max of 4 flags. We may use the
    unused 2 for big_offset and big_length
    which would further lower the number into
    a more efficient utf-8 or utf-16 space.
    That would probably mean putting an indicator
    at the beginning of the compressed string
    to tell us which encoding was optimized for.
*/
enum LZSS_Pair_Flags
{
    SURROGATE_INDEX_A = 1 << 0,
    SURROGATE_INDEX_B = 1 << 1,
    UNUSED_1 = 1 << 2,
    UNUSED_2 = 1 << 3,
}

function LZSS_Write_Pair(
    index_a: Count,
    index_b: Count,
):
    string
{
    Utils.Assert(
        index_a >= 0 &&
        index_a <= LZSS_LAST_INDEX,
        `index_a must be greater than or equal to 0 and less than or equal to ${LZSS_LAST_INDEX}`,
    );
    Utils.Assert(
        index_b >= 0 &&
        index_b <= LZSS_LAST_INDEX,
        `index_b must be greater than or equal to 0 and less than or equal to ${LZSS_LAST_INDEX}`,
    );

    let control_index: Index = 0;

    if (
        index_a >= Unicode.LEADING_SURROGATE.FIRST &&
        index_a <= Unicode.TRAILING_SURROGATE.LAST
    ) {
        control_index |= LZSS_Pair_Flags.SURROGATE_INDEX_A;
        index_a -= Unicode.LEADING_SURROGATE.FIRST;
    }

    if (
        index_b >= Unicode.LEADING_SURROGATE.FIRST &&
        index_b <= Unicode.TRAILING_SURROGATE.LAST
    ) {
        control_index |= LZSS_Pair_Flags.SURROGATE_INDEX_B;
        index_b -= Unicode.LEADING_SURROGATE.FIRST;
    }

    return (
        String.fromCodePoint(control_index) +
        String.fromCodePoint(index_a) +
        String.fromCodePoint(index_b)
    );
}

function LZSS_Read_Pair(
    iter: Unicode.Iterator,
):
    [Unicode.Iterator, Count, Count]
{
    const control_index: Index = iter.Point().codePointAt(0) as Index;

    Utils.Assert(
        control_index < LZSS_ESCAPE_INDEX,
        `cannot read value as a valid lzss pair!`,
    );

    iter = iter.Next();

    let index_a: Count = iter.Point().codePointAt(0) as Count;
    if ((control_index & LZSS_Pair_Flags.SURROGATE_INDEX_A) !== 0) {
        index_a += Unicode.LEADING_SURROGATE.FIRST;
    }

    iter = iter.Next();

    let index_b: Count = iter.Point().codePointAt(0) as Count;
    if ((control_index & LZSS_Pair_Flags.SURROGATE_INDEX_B) !== 0) {
        index_b += Unicode.LEADING_SURROGATE.FIRST;
    }

    iter = iter.Next();

    return [
        iter,
        index_a,
        index_b,
    ];
}

function LZSS_Write_Header(
    decompressed_length: Count,
):
    string
{
    let result: string = ``;

    Utils.Assert(
        decompressed_length <= LZSS_MAX_STRING_LENGTH,
        `cannot encode a string that is nearly 1.13 terrabytes`,
    );

    const length_multiplyer: Count =
        Math.floor(decompressed_length / LZSS_INDEX_COUNT);
    const length_remainder: Count =
        decompressed_length % LZSS_INDEX_COUNT;
    const compressed_length: string =
        LZSS_Write_Pair(length_multiplyer, length_remainder);

    result += compressed_length;

    Utils.Assert(
        LZSS_Read_Header(new Unicode.Iterator({ text: result, }))[1] === decompressed_length,
        `compressed_length should equate to decompressed_length\n` +
        `compressed_length: ${LZSS_Read_Header(new Unicode.Iterator({ text: result, }))[1]}\n` +
        `decompressed_length: ${decompressed_length}`,
    );

    return result;
}

function LZSS_Read_Header(
    iter: Unicode.Iterator,
):
    [Unicode.Iterator, Count]
{
    let length_multiplyer: Count;
    let length_remainder: Count;
    [
        iter,
        length_multiplyer,
        length_remainder,
    ] = LZSS_Read_Pair(iter);

    let decompressed_length: Count = (length_multiplyer * LZSS_INDEX_COUNT) + length_remainder;

    return [
        iter,
        decompressed_length,
    ];
}

function LZSS_Write_Token(
    offset: Count,
    length: Count,
):
    string
{
    Utils.Assert(
        offset > 0 &&
        offset <= LZSS_MAX_MEMORY_LENGTH,
        `offset must be greater than 0 and less than or equal to ${LZSS_MAX_MEMORY_LENGTH}`,
    );
    Utils.Assert(
        length > 0 &&
        length <= LZSS_MAX_MEMORY_LENGTH,
        `length must be greater than 0 and less than or equal to ${LZSS_MAX_MEMORY_LENGTH}`,
    );

    // subtract one for the unicode limit
    // but we add one in reading a pair so we can use
    // the full limit of the max_memory_length.
    offset -= 1;
    length -= 1;

    return LZSS_Write_Pair(offset, length);
}

function LZSS_Read_Token(
    iter: Unicode.Iterator,
):
    [Unicode.Iterator, Count, Count]
{
    let offset: Count;
    let length: Count;
    [
        iter,
        offset,
        length,
    ] = LZSS_Read_Pair(iter);

    offset += 1;
    length += 1;

    return [
        iter,
        offset,
        length,
    ];
}

class LZSS_Window
{
    private text: string;
    private text_index: Index;
    private memory: string;
    private max_memory_length: Count;
    private optimize_for_utf_8_encoding: boolean;
    private matches_buffer_a: Array<[Index, Index]>;
    private matches_buffer_b: Array<[Index, Index]>;

    constructor(
        {
            text,
            max_memory_length,
            optimize_for_utf_8_encoding,
        }: {
            text: string,
            max_memory_length: Count,
            optimize_for_utf_8_encoding: boolean,
        },
    )
    {
        this.text = text;
        this.text_index = 0;
        this.memory = ``;
        this.max_memory_length = max_memory_length;
        this.optimize_for_utf_8_encoding = optimize_for_utf_8_encoding;
        this.matches_buffer_a = [];
        this.matches_buffer_b = [];
    }

    /*
        Outputs into array slice indices into the current memory.
        Indices must be used before memory is updated with new tokens.
    */
    private Initial_Matches(
        results: Array<[Index, Index]>,
        point: string,
    ):
        void
    {
        Utils.Assert(
            Unicode.Is_Point(point),
            `point is not a point`,
        );

        results.splice(0, results.length);

        let iter: Unicode.Iterator = new Unicode.Iterator(
            {
                text: this.memory,
            },
        );

        for (; !iter.Is_At_End(); iter = iter.Next()) {
            if (iter.Point() === point) {
                const index: Index = iter.Index();
                results.push([index, index + point.length]);
            }
        }
    }

    /*
        Whittles down previous_matches by incrementing each
        end index and only adding new_matches that equate to
        how ever many units can be pulled from points.
        points is not yet an actual token, it's safe to
        pass an undetermined string. previous_matches is
        not altered. new_matches is, and should be empty.
    */
    private Matches(
        previous_matches: Array<[Index, Index]>,
        new_matches: Array<[Index, Index]>,
        points: string,
    ):
        void
    {
        new_matches.splice(0, new_matches.length);

        for (const [from, previous_to_exclusive] of previous_matches) {
            const previous_length: Count =
                previous_to_exclusive - from;
            const new_length: Count =
                previous_length +
                Unicode.First_Point(this.memory.slice(previous_to_exclusive)).length;
            const new_to_exclusive: Index =
                from + new_length;

            if (
                new_length > previous_length &&
                points.length >= new_length &&
                points.slice(0, new_length) === this.memory.slice(from, new_to_exclusive)
            ) {
                new_matches.push([from, new_to_exclusive]);
            }
        }
    }

    private Move_Memory(
        length: Count,
    ):
        void
    {
        while (this.memory.length + length > this.max_memory_length) {
            const first_point: string = Unicode.First_Point(this.memory);

            this.text_index += first_point.length;
            this.memory = this.memory.slice(first_point.length);
        }

        this.memory = this.text.slice(
            this.text_index,
            this.text_index + this.memory.length + length,
        );
    }

    private Can_Use_Token(
        token: string,
        text: string,
    ):
        boolean
    {
        if (this.optimize_for_utf_8_encoding) {
            return (
                Unicode.Expected_UTF_8_Unit_Count(token) <
                Unicode.Expected_UTF_8_Unit_Count(text)
            );
        } else {
            return token.length < text.length;
        }
    }

    private Write_Non_Token(
        point: string,
    ):
        string
    {
        Utils.Assert(
            point !== ``,
            `point cannot be empty`,
        );

        if (point.codePointAt(0) as Index > LZSS_ESCAPE_INDEX) {
            return point;
        } else {
            return (
                LZSS_ESCAPE_STRING +
                point
            );
        }
    }

    Token_Or_Non_Token(
        iter: Unicode.Iterator,
    ):
        [Unicode.Iterator, string]
    {
        Utils.Assert(
            !iter.Is_At_End(),
            `iter is at end`,
        );

        const first_point: string = iter.Point();

        this.Initial_Matches(this.matches_buffer_a, first_point);

        if (this.matches_buffer_a.length > 0) {
            const points: string = iter.Points();

            let previous_matches: Array<[Index, Index]> = this.matches_buffer_b;
            let new_matches: Array<[Index, Index]> = this.matches_buffer_a;
            let matches_swap: Array<[Index, Index]> = previous_matches;

            while (new_matches.length > 0) {
                matches_swap = previous_matches;
                previous_matches = new_matches;
                new_matches = matches_swap;
                this.Matches(previous_matches, new_matches, points);
            }

            const match: [Index, Index] =
                previous_matches[previous_matches.length - 1];
            const offset: Count =
                this.memory.length - match[0];
            const length: Count =
                match[1] - match[0];
            const token: string =
                LZSS_Write_Token(offset, length);

            if (this.Can_Use_Token(token, points.slice(0, length))) {
                this.Move_Memory(length);

                return [
                    new Unicode.Iterator(
                        {
                            text: iter.Text(),
                            index: iter.Index() + length,
                        },
                    ),
                    token,
                ];
            } else {
                this.Move_Memory(first_point.length);

                return [
                    new Unicode.Iterator(
                        {
                            text: iter.Text(),
                            index: iter.Index() + first_point.length,
                        },
                    ),
                    this.Write_Non_Token(first_point),
                ];
            }
        } else {
            this.Move_Memory(first_point.length);

            return [
                new Unicode.Iterator(
                    {
                        text: iter.Text(),
                        index: iter.Index() + first_point.length,
                    },
                ),
                this.Write_Non_Token(first_point),
            ];
        }
    }
}

export function LZSS_Compress(
    value: string,
    {
        max_memory_length,
        optimize_for_utf_8_encoding,
    }: {
        max_memory_length: Count,
        optimize_for_utf_8_encoding: boolean,
    } =
        {
            max_memory_length: 1024,
            optimize_for_utf_8_encoding: true,
        },
):
    string
{
    Utils.Assert(
        value.length <= LZSS_MAX_STRING_LENGTH,
        `value.length must be less than or equal to ${LZSS_MAX_STRING_LENGTH}`,
    );
    Utils.Assert(
        max_memory_length > 0 &&
        max_memory_length <= LZSS_MAX_MEMORY_LENGTH,
        `max_memory_length must be greater than 0 and less than or equal to ${LZSS_MAX_MEMORY_LENGTH}`,
    );

    const window: LZSS_Window = new LZSS_Window(
        {
            text: value,
            max_memory_length: max_memory_length,
            optimize_for_utf_8_encoding: optimize_for_utf_8_encoding,
        },
    );

    let result: string = LZSS_Write_Header(value.length);

    let iter: Unicode.Iterator = new Unicode.Iterator(
        {
            text: value,
        },
    );
    let token_or_non_token: string;

    for (; !iter.Is_At_End();) {
        [
            iter,
            token_or_non_token,
        ] = window.Token_Or_Non_Token(iter);

        result += token_or_non_token;
    }

    return result;
}

export function LZSS_Decompress(
    value: string,
):
    string
{
    let iter: Unicode.Iterator = new Unicode.Iterator(
        {
            text: value,
        },
    );

    let decompressed_length: Count;
    [
        iter,
        decompressed_length,
    ] = LZSS_Read_Header(iter);

    const buffer: Uint16Array =
        new Uint16Array(decompressed_length);

    let pointer: Index = 0;

    for (; !iter.Is_At_End();) {
        const maybe_control_point: string = iter.Point();

        if (maybe_control_point === LZSS_ESCAPE_STRING) {
            iter = iter.Next();

            const point: string = iter.Point();

            iter = iter.Next();

            buffer[pointer] = point.charCodeAt(0);
            pointer += 1;
            if (point.length === 2) {
                buffer[pointer] = point.charCodeAt(1);
                pointer += 1;
            }
        } else {
            const maybe_control_index: Index = maybe_control_point.codePointAt(0) as Index;

            if (maybe_control_index < LZSS_ESCAPE_INDEX) {
                let offset: Count;
                let length: Count;
                [
                    iter,
                    offset,
                    length,
                ] = LZSS_Read_Token(iter);

                const from: Index = pointer - offset;
                const to_exclusive: Index = from + length;

                buffer.copyWithin(pointer, from, to_exclusive);
                pointer += length;
            } else {
                const point: string = maybe_control_point;

                iter = iter.Next();

                buffer[pointer] = point.charCodeAt(0);
                pointer += 1;
                if (point.length === 2) {
                    buffer[pointer] = point.charCodeAt(1);
                    pointer += 1;
                }
            }
        }
    }

    Utils.Assert(
        pointer === decompressed_length,
        `pointer should equate decompressed_length`,
    );

    if (Utils.Is_Big_Endian()) {
        return new TextDecoder(`utf-16be`).decode(buffer);
    } else {
        return new TextDecoder(`utf-16le`).decode(buffer);
    }
}
