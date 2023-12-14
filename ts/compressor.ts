import { Count } from "./types.js";
import { Index } from "./types.js";

import * as Utils from "./utils.js";
import * as Unicode from "./unicode.js";

export function LZSS_Compress(
    value: string,
    memory_in_kilobytes: Count = 32,
):
    string
{
    Utils.Assert(
        value.length <= 0x110000,
        `Too many units in string for this implementation. ` +
        `The max is ${0x110000} or ${Utils.Add_Commas_To_Number(1114112)} units. ` +
        `This implementation uses unicode points to index into the string.`,
    );
    Utils.Assert(
        !/\0/.test(value),
        `value cannot have have U+0000.`,
    );

    class Window
    {
        private text: string;
        private text_index: Index;
        private memory: string;
        private max_memory_length: Count;

        constructor(
            {
                text,
                memory_in_kilobytes,
            }: {
                text: string,
                memory_in_kilobytes: Count,
            },
        )
        {
            this.text = text;
            this.text_index = 0;
            this.memory = ``;
            this.max_memory_length = memory_in_kilobytes * 1024 / 2; // each string unit is 16 bit
        }

        /*
            Returns an array of slice indices into the current memory.
            Indices must be used before memory is updated with new tokens.
        */
        private Initial_Matches(
            point: string,
        ):
            Array<[Index, Index]>
        {
            Utils.Assert(
                Unicode.Is_Point(point),
                `point is not a point`,
            );

            const results: Array<[Index, Index]> = [];

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

            return results;
        }

        /*
            Whittles down previous_matches by incrementing each
            end index and only keeping matches that equate to
            how ever many units can be pulled from points.
            points is not yet an actual token, it's safe to
            pass an undetermined string.
        */
        private Matches(
            previous_matches: Array<[Index, Index]>,
            points: string,
        ):
            Array<[Index, Index]>
        {
            const results: Array<[Index, Index]> = [];

            for (const [from, previous_to_exclusive] of previous_matches) {
                const previous_count: Count =
                    previous_to_exclusive - from;
                const count: Count =
                    previous_count +
                    Unicode.First_Point(this.memory.slice(previous_to_exclusive)).length;
                const to_exclusive: Index =
                    from + count;

                if (
                    count > previous_count &&
                    points.length >= count &&
                    points.slice(0, count) === this.memory.slice(from, to_exclusive)
                ) {
                    results.push([from, to_exclusive]);
                }
            }

            return results;
        }

        private Move_Memory(
            count: Count,
        ):
            void
        {
            while (this.memory.length + count > this.max_memory_length) {
                const first_point: string = Unicode.First_Point(this.memory);

                this.text_index += first_point.length;
                this.memory = this.memory.slice(first_point.length);
            }

            this.memory = this.text.slice(
                this.text_index,
                this.text_index + this.memory.length + count,
            );
        }

        Token(
            iter: Unicode.Iterator,
        ):
            [string, Unicode.Iterator]
        {
            Utils.Assert(
                !iter.Is_At_End(),
                `iter is at end`,
            );

            const first_point: string = iter.Point();
            const initial_matches: Array<[Index, Index]> = this.Initial_Matches(first_point);

            if (initial_matches.length > 0) {
                const points: string = iter.Points();

                let matches: Array<[Index, Index]> = initial_matches;
                let previous_matches: Array<[Index, Index]> = matches;

                while (matches.length > 0) {
                    previous_matches = matches;
                    matches = this.Matches(previous_matches, points);
                }

                const match: [Index, Index] =
                    previous_matches[previous_matches.length - 1];
                const count: Count =
                    match[1] - match[0];
                const from: Index =
                    this.text_index + match[0];
                const to_exclusive: Count =
                    this.text_index + match[1];
                const token: string =
                    String.fromCodePoint(0) +
                    String.fromCodePoint(from) +
                    String.fromCodePoint(to_exclusive);

                if (token.length < count) {
                    this.Move_Memory(count);

                    return [
                        token,
                        new Unicode.Iterator(
                            {
                                text: iter.Text(),
                                index: iter.Index() + count,
                            },
                        ),
                    ];
                } else {
                    this.Move_Memory(first_point.length);

                    return [
                        first_point,
                        iter.Next(),
                    ];
                }
            } else {
                this.Move_Memory(first_point.length);

                return [
                    first_point,
                    iter.Next(),
                ];
            }
        }
    }

    const window: Window = new Window(
        {
            text: value,
            memory_in_kilobytes: memory_in_kilobytes,
        },
    );

    let result: string = ``;
    let iter: Unicode.Iterator = new Unicode.Iterator(
        {
            text: value,
        },
    );

    for (; !iter.Is_At_End();) {
        const [token, new_iter]: [string, Unicode.Iterator] =
            window.Token(iter);

        result += token;
        iter = new_iter;
    }

    return result;
}

export function LZSS_Decompress(
    value: string,
):
    string
{
    const zero: string = String.fromCodePoint(0);

    let result: string = ``;
    let iter: Unicode.Iterator = new Unicode.Iterator(
        {
            text: value,
        },
    );

    for (; !iter.Is_At_End();) {
        if (iter.Point() === zero) {
            iter = iter.Next();

            const from: Index = iter.Point().codePointAt(0) as Index;

            iter = iter.Next();

            const to_exclusive: Index = iter.Point().codePointAt(0) as Index;

            result += result.slice(from, to_exclusive);
            iter = iter.Next();
        } else {
            result += iter.Point();
            iter = iter.Next();
        }
    }

    return result;
}
