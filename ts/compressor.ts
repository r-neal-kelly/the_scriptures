import { Count } from "./types.js";
import { Index } from "./types.js";

import * as Utils from "./utils.js";
import * as Unicode from "./unicode.js";

export const LZSS_FIRST_BAD_INDEX: Index = Unicode.LEADING_SURROGATE.FIRST;
export const LZSS_LAST_BAD_INDEX: Index = Unicode.TRAILING_SURROGATE.LAST;
export const LZSS_MAX_LENGTH: Count = 0x110000;

export class LZSS_Control_Tokens
{
    private good: string;
    private bad_a: string;
    private bad_b: string;
    private bad_ab: string;

    private has_token_regex: RegExp;

    constructor(
        {
            GOOD = 0x00,
            BAD_A = 0x01,
            BAD_B = 0x02,
            BAD_AB = 0x03,
        }: {
            GOOD?: Index,
            BAD_A?: Index,
            BAD_B?: Index,
            BAD_AB?: Index,
        } = {},
    )
    {
        Utils.Assert(
            GOOD < LZSS_FIRST_BAD_INDEX ||
            GOOD > LZSS_LAST_BAD_INDEX,
            `Cannot use a unicode surrogate as a token.`,
        );
        Utils.Assert(
            BAD_A < LZSS_FIRST_BAD_INDEX ||
            BAD_A > LZSS_LAST_BAD_INDEX,
            `Cannot use a unicode surrogate as a token.`,
        );
        Utils.Assert(
            BAD_B < LZSS_FIRST_BAD_INDEX ||
            BAD_B > LZSS_LAST_BAD_INDEX,
            `Cannot use a unicode surrogate as a token.`,
        );
        Utils.Assert(
            BAD_AB < LZSS_FIRST_BAD_INDEX ||
            BAD_AB > LZSS_LAST_BAD_INDEX,
            `Cannot use a unicode surrogate as a token.`,
        );
        Utils.Assert(
            GOOD !== BAD_A &&
            GOOD !== BAD_B &&
            GOOD !== BAD_AB,
            `Each control token must be unique.`,
        );
        Utils.Assert(
            BAD_A !== GOOD &&
            BAD_A !== BAD_B &&
            BAD_A !== BAD_AB,
            `Each control token must be unique.`,
        );
        Utils.Assert(
            BAD_B !== GOOD &&
            BAD_B !== BAD_A &&
            BAD_B !== BAD_AB,
            `Each control token must be unique.`,
        );
        Utils.Assert(
            BAD_AB !== GOOD &&
            BAD_AB !== BAD_A &&
            BAD_AB !== BAD_B,
            `Each control token must be unique.`,
        );

        this.good = String.fromCodePoint(GOOD);
        this.bad_a = String.fromCodePoint(BAD_A);
        this.bad_b = String.fromCodePoint(BAD_B);
        this.bad_ab = String.fromCodePoint(BAD_AB);

        const token_string: string =
            this.GOOD() +
            this.BAD_A() +
            this.BAD_B() +
            this.BAD_AB();
        this.has_token_regex = new RegExp(`[${token_string}]`);

        Object.freeze(this);
    }

    GOOD():
        string
    {
        return this.good;
    }

    BAD_A():
        string
    {
        return this.bad_a;
    }

    BAD_B():
        string
    {
        return this.bad_b;
    }

    BAD_AB():
        string
    {
        return this.bad_ab;
    }

    Has_Token(
        text: string,
    ):
        boolean
    {
        return this.has_token_regex.test(text);
    }
}

export function LZSS_Compress(
    value: string,
    max_memory_length: Count = 1 * 1024, // approx. 2 kilobytes
    control_tokens: LZSS_Control_Tokens = new LZSS_Control_Tokens(),
):
    string
{
    Utils.Assert(
        value.length <= LZSS_MAX_LENGTH,
        `Too many units in string for this implementation. ` +
        `The max is ${LZSS_MAX_LENGTH} or ${Utils.Add_Commas_To_Number(LZSS_MAX_LENGTH)} units. ` +
        `This implementation uses unicode points to index into the string.`,
    );
    Utils.Assert(
        !control_tokens.Has_Token(value),
        `value cannot have a control token.`,
    );
    Utils.Assert(
        max_memory_length > 0,
        `max_memory_length must be greater than 0`,
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
            Utils.Assert(
                new_matches.length === 0,
                `new_matches should be empty`,
            );

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
            from: Index,
            to_exclusive: Index,
        ):
            string
        {
            const has_bad_a: boolean =
                from >= LZSS_FIRST_BAD_INDEX &&
                from <= LZSS_LAST_BAD_INDEX;
            const has_bad_b: boolean =
                to_exclusive >= LZSS_FIRST_BAD_INDEX &&
                to_exclusive <= LZSS_LAST_BAD_INDEX;

            if (has_bad_a && has_bad_b) {
                return (
                    control_tokens.BAD_AB() +
                    String.fromCodePoint(from - LZSS_FIRST_BAD_INDEX) +
                    String.fromCodePoint(to_exclusive - LZSS_FIRST_BAD_INDEX)
                );
            } else if (has_bad_a) {
                return (
                    control_tokens.BAD_A() +
                    String.fromCodePoint(from - LZSS_FIRST_BAD_INDEX) +
                    String.fromCodePoint(to_exclusive)
                );
            } else if (has_bad_b) {
                return (
                    control_tokens.BAD_B() +
                    String.fromCodePoint(from) +
                    String.fromCodePoint(to_exclusive - LZSS_FIRST_BAD_INDEX)
                );
            } else {
                return (
                    control_tokens.GOOD() +
                    String.fromCodePoint(from) +
                    String.fromCodePoint(to_exclusive)
                );
            }
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

                let previous_matches: Array<[Index, Index]> = [];
                let matches: Array<[Index, Index]> = initial_matches;
                let matches_swap: Array<[Index, Index]> = previous_matches;

                while (matches.length > 0) {
                    matches_swap = previous_matches;
                    previous_matches = matches;
                    matches = matches_swap;
                    matches.splice(0, matches.length);
                    this.Matches(previous_matches, matches, points);
                }

                const match: [Index, Index] =
                    previous_matches[previous_matches.length - 1];
                const length: Count =
                    match[1] - match[0];
                const from: Index =
                    this.text_index + match[0];
                const to_exclusive: Index =
                    this.text_index + match[1];
                const token: string =
                    this.Create_Token(from, to_exclusive);

                if (token.length < length) {
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
                        first_point,
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
                    first_point,
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
        const [token, new_iter]: [string, Unicode.Iterator] =
            window.Token(iter);

        result += token;
        iter = new_iter;
    }

    return result;
}

export function LZSS_Decompress(
    value: string,
    control_tokens: LZSS_Control_Tokens = new LZSS_Control_Tokens(),
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
        if (iter.Point() === control_tokens.GOOD()) {
            iter = iter.Next();

            const from = iter.Point().codePointAt(0) as Index;

            iter = iter.Next();

            const to_exclusive = iter.Point().codePointAt(0) as Index;

            result += result.slice(from, to_exclusive);
            iter = iter.Next();
        } else if (iter.Point() === control_tokens.BAD_A()) {
            iter = iter.Next();

            const from = (iter.Point().codePointAt(0) as Index) + LZSS_FIRST_BAD_INDEX;

            iter = iter.Next();

            const to_exclusive = iter.Point().codePointAt(0) as Index;

            result += result.slice(from, to_exclusive);
            iter = iter.Next();
        } else if (iter.Point() === control_tokens.BAD_B()) {
            iter = iter.Next();

            const from = iter.Point().codePointAt(0) as Index;

            iter = iter.Next();

            const to_exclusive = (iter.Point().codePointAt(0) as Index) + LZSS_FIRST_BAD_INDEX;

            result += result.slice(from, to_exclusive);
            iter = iter.Next();
        } else if (iter.Point() === control_tokens.BAD_AB()) {
            iter = iter.Next();

            const from = (iter.Point().codePointAt(0) as Index) + LZSS_FIRST_BAD_INDEX;

            iter = iter.Next();

            const to_exclusive = (iter.Point().codePointAt(0) as Index) + LZSS_FIRST_BAD_INDEX;

            result += result.slice(from, to_exclusive);
            iter = iter.Next();
        } else {
            result += iter.Point();
            iter = iter.Next();
        }
    }

    return result;
}
