import { Count } from "./types.js";
import { Index } from "./types.js";

import * as Utils from "./utils.js";
import * as Unicode from "./unicode.js";

export const LZSS_MAX_MEMORY_LENGTH: Count = 0x110000;
export const LZSS_ESCAPE_INDEX: Index = 0x10;
export const LZSS_ESCAPE_STRING: string = String.fromCodePoint(LZSS_ESCAPE_INDEX);
export const LZSS_FIRST_SURROGATE_INDEX: Index = Unicode.LEADING_SURROGATE.FIRST;
export const LZSS_LAST_SURROGATE_INDEX: Index = Unicode.TRAILING_SURROGATE.LAST;

/*
    There is a max of 4 flags. We may use the
    unused 2 for big_offset and big_length
    which would further lower the number into
    a more efficient utf-8 or utf-16 space.
    That would probably mean putting an indicator
    at the beginning of the compressed string
    to tell us which encoding was optimized for.
*/
export enum LZSS_Flags
{
    SURROGATE_OFFSET = 1 << 0,
    SURROGATE_LENGTH = 1 << 1,
    UNUSED_1 = 1 << 2,
    UNUSED_2 = 1 << 3,
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
        max_memory_length > 0,
        `max_memory_length must be greater than 0`,
    );
    Utils.Assert(
        max_memory_length <= LZSS_MAX_MEMORY_LENGTH,
        `max_memory_length must be less than or equal to ${LZSS_MAX_MEMORY_LENGTH}`,
    );

    class Window
    {
        private text: string;
        private text_index: Index;
        private memory: string;
        private max_memory_length: Count;
        private matches_buffer_a: Array<[Index, Index]>;
        private matches_buffer_b: Array<[Index, Index]>;

        constructor(
            {
                text,
                max_memory_length,
            }: {
                text: string,
                max_memory_length: Count,
            },
        )
        {
            this.text = text;
            this.text_index = 0;
            this.memory = ``;
            this.max_memory_length = max_memory_length;
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

        /*
            Handles the surrogate exceptions. We can't use
            surrogates as indices into the the string
            because it will confuse any unicode interpreter
            of the compressed string.
        */
        private Create_Token(
            offset: Count,
            length: Count,
        ):
            string
        {
            Utils.Assert(
                offset > 0,
                `offset must be greater than 0`,
            );
            Utils.Assert(
                length > 0,
                `length must be greater than 0`,
            );

            // subtract one for 0x110000 - 1 unicode limit
            // but we add one in decompressor so we can use
            // the full limit of the max_memory_length.
            offset -= 1;
            length -= 1;

            const has_surrogate_offset: boolean =
                offset >= LZSS_FIRST_SURROGATE_INDEX &&
                offset <= LZSS_LAST_SURROGATE_INDEX;
            const has_surrogate_length: boolean =
                length >= LZSS_FIRST_SURROGATE_INDEX &&
                length <= LZSS_LAST_SURROGATE_INDEX;

            let control_index: Index = 0;
            if (has_surrogate_offset) {
                control_index |= LZSS_Flags.SURROGATE_OFFSET;
                offset -= LZSS_FIRST_SURROGATE_INDEX;
            }
            if (has_surrogate_length) {
                control_index |= LZSS_Flags.SURROGATE_LENGTH;
                length -= LZSS_FIRST_SURROGATE_INDEX;
            }

            return (
                String.fromCodePoint(control_index) +
                String.fromCodePoint(offset) +
                String.fromCodePoint(length)
            );
        }

        private Can_Use_Token(
            token: string,
            text: string,
        ):
            boolean
        {
            if (optimize_for_utf_8_encoding) {
                return (
                    Unicode.Expected_UTF_8_Unit_Count(token) <
                    Unicode.Expected_UTF_8_Unit_Count(text)
                );
            } else {
                return token.length < text.length;
            }
        }

        private Create_Non_Token(
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
            [string, Unicode.Iterator]
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
                    this.Create_Token(offset, length);

                if (this.Can_Use_Token(token, points.slice(0, length))) {
                    this.Move_Memory(length);

                    return [
                        token,
                        new Unicode.Iterator(
                            {
                                text: iter.Text(),
                                index: iter.Index() + length,
                            },
                        ),
                    ];
                } else {
                    this.Move_Memory(first_point.length);

                    return [
                        this.Create_Non_Token(first_point),
                        new Unicode.Iterator(
                            {
                                text: iter.Text(),
                                index: iter.Index() + first_point.length,
                            },
                        ),
                    ];
                }
            } else {
                this.Move_Memory(first_point.length);

                return [
                    this.Create_Non_Token(first_point),
                    new Unicode.Iterator(
                        {
                            text: iter.Text(),
                            index: iter.Index() + first_point.length,
                        },
                    ),
                ];
            }
        }
    }

    const window: Window = new Window(
        {
            text: value,
            max_memory_length: max_memory_length,
        },
    );

    let result: string = ``;
    let iter: Unicode.Iterator = new Unicode.Iterator(
        {
            text: value,
        },
    );

    for (; !iter.Is_At_End();) {
        const [token_or_non_token, new_iter]: [string, Unicode.Iterator] =
            window.Token_Or_Non_Token(iter);

        result += token_or_non_token;
        iter = new_iter;
    }

    return result;
}

// we want to use String.fromCharCode is we feed it utf16 units
// we just expand the typed array ...type_array.
// to get the total length of the typed_array, we could have a
// point at the start of the string that indicates the number of
// points after that, when decoded into points and added together
// equate to the total number of 16bit units in the remainder of the
// string. then we can use that number to create the typed_array and
// from the point that proceeds after that to the end of the string
// we can decompress based on the utf16 units in the typed_array.
// then we just call the fromCharCode with the expand syntax as a return.
export function LZSS_Decompress(
    value: string,
):
    string
{
    let result: string = ``;
    let iter: Unicode.Iterator = new Unicode.Iterator(
        {
            text: value,
        },
    );

    for (; !iter.Is_At_End();) {
        const maybe_control_point: string = iter.Point();

        if (maybe_control_point === LZSS_ESCAPE_STRING) {
            iter = iter.Next();

            const point: string = iter.Point();

            result += point;
            iter = iter.Next();
        } else {
            const maybe_control_index: Index = maybe_control_point.codePointAt(0) as Index;

            if (maybe_control_index < LZSS_ESCAPE_INDEX) {
                const control_index: Index = maybe_control_index;

                let offset: Count;
                let length: Count;

                iter = iter.Next();

                offset = iter.Point().codePointAt(0) as Count + 1;
                if ((control_index & LZSS_Flags.SURROGATE_OFFSET) !== 0) {
                    offset += LZSS_FIRST_SURROGATE_INDEX;
                }

                iter = iter.Next();

                length = iter.Point().codePointAt(0) as Count + 1;
                if ((control_index & LZSS_Flags.SURROGATE_LENGTH) !== 0) {
                    length += LZSS_FIRST_SURROGATE_INDEX;
                }

                const from: Index = result.length - offset;
                const to_exclusive: Index = from + length;

                result += result.slice(from, to_exclusive);
                iter = iter.Next();
            } else {
                const point: string = maybe_control_point;

                result += point;
                iter = iter.Next();
            }
        }
    }

    return result;
}
