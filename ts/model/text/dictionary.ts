import { Index } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Unicode from "../../unicode.js";

import { Value } from "./value.js";

export type Letter = Value;
export type Word = Value;

export type Marker = Value;
export type Break = Value;

export enum Boundary
{
    START = `START`,
    MIDDLE = `MIDDLE`,
    END = `END`,
};

// this should probably go in data
type Info = {
    letters: Array<Letter>;
    markers: Array<Marker>;

    words: { [index: Letter]: Array<Word> };
    breaks: {
        [Boundary.START]: { [index: Marker]: Array<Break> },
        [Boundary.MIDDLE]: { [index: Marker]: Array<Break> },
        [Boundary.END]: { [index: Marker]: Array<Break> },
    };

    word_errors: Array<Word>;
    break_errors: {
        [Boundary.START]: Array<Break>,
        [Boundary.MIDDLE]: Array<Break>,
        [Boundary.END]: Array<Break>,
    };
}

export class Instance
{
    private info: Info;

    constructor(
        {
            json = null,
        }: {
            json?: string | null,
        },
    )
    {
        this.info = json != null ?
            JSON.parse(json) :
            {
                letters: [],
                markers: [],

                words: {},
                breaks: {
                    [Boundary.START]: {},
                    [Boundary.MIDDLE]: {},
                    [Boundary.END]: {},
                },

                word_errors: [],
                break_errors: {
                    [Boundary.START]: [],
                    [Boundary.MIDDLE]: [],
                    [Boundary.END]: [],
                },
            };

        // letters, markers
        for (const property of [`letters`, `markers`]) {
            Utils.Assert(
                (this.info as any).hasOwnProperty(property) &&
                Utils.Is.Array((this.info as any)[property]),
                `info.${property} is missing or is invalid.`,
            );
            for (const value of (this.info as any)[property]) {
                Utils.Assert(
                    Utils.Is.String(value as any),
                    `info.${property} is missing or is invalid.`,
                );
            }
        }

        // words
        Utils.Assert(
            (this.info as any).hasOwnProperty(`words`) &&
            Utils.Is.Object((this.info as any)[`words`]),
            `info.words is missing or is invalid.`,
        );
        for (const [key, value] of Object.entries((this.info as any)[`words`])) {
            Utils.Assert(
                Utils.Is.String(key as any) &&
                Utils.Is.Array(value as any),
                `info.words is missing or is invalid.`,
            );
            for (const value_value of (value as any)) {
                Utils.Assert(
                    Utils.Is.String(value_value as any),
                    `info.words is missing or is invalid.`,
                );
            }
        }

        // breaks
        Utils.Assert(
            (this.info as any).hasOwnProperty(`breaks`) &&
            Utils.Is.Object((this.info as any)[`breaks`]),
            `info.breaks is missing or is invalid.`,
        );
        for (const boundary of [Boundary.START, Boundary.MIDDLE, Boundary.END]) {
            Utils.Assert(
                (this.info as any)[`breaks`].hasOwnProperty(boundary) &&
                Utils.Is.Object((this.info as any)[`breaks`][boundary]),
                `info.breaks is missing or is invalid.`,
            );
            for (const [key, value] of Object.entries((this.info as any)[`breaks`][boundary])) {
                Utils.Assert(
                    Utils.Is.String(key as any) &&
                    Utils.Is.Array(value as any),
                    `info.breaks is missing or is invalid.`,
                );
                for (const value_value of (value as any)) {
                    Utils.Assert(
                        Utils.Is.String(value_value as any),
                        `info.breaks is missing or is invalid.`,
                    );
                }
            }
        }

        // word_errors
        Utils.Assert(
            (this.info as any).hasOwnProperty(`word_errors`) &&
            Utils.Is.Array((this.info as any)[`word_errors`]),
            `info.word_errors is missing or is invalid.`,
        );
        for (const value of (this.info as any)[`word_errors`]) {
            Utils.Assert(
                Utils.Is.String(value as any),
                `info.word_errors is missing or is invalid.`,
            );
        }

        // break_errors
        Utils.Assert(
            (this.info as any).hasOwnProperty(`break_errors`) &&
            Utils.Is.Object((this.info as any)[`break_errors`]),
            `info.break_errors is missing or is invalid.`,
        );
        for (const boundary of [Boundary.START, Boundary.MIDDLE, Boundary.END]) {
            Utils.Assert(
                (this.info as any)[`break_errors`].hasOwnProperty(boundary) &&
                Utils.Is.Array((this.info as any)[`break_errors`][boundary]),
                `info.break_errors is missing or is invalid.`,
            );
            for (const value of (this.info as any)[`break_errors`][boundary]) {
                Utils.Assert(
                    Utils.Is.String(value as any),
                    `info.break_errors is missing or is invalid.`,
                );
            }
        }
    }

    Has_Letter(
        letter: Letter,
    ):
        boolean
    {
        Utils.Assert(
            Unicode.Is_Point(letter),
            `Letter must be a point.`,
        );

        return this.info.letters.includes(letter);
    }

    Add_Letter(
        letter: Letter,
    ):
        void
    {
        Utils.Assert(
            Unicode.Is_Point(letter),
            `Letter must be a point.`,
        );

        if (!this.info.letters.includes(letter)) {
            this.info.letters.push(letter);

            this.info.words[letter] = [];
        }
    }

    Remove_Letter(
        letter: Letter,
    ):
        void
    {
        Utils.Assert(
            Unicode.Is_Point(letter),
            `Letter must be a point.`,
        );

        const index: Index = this.info.letters.indexOf(letter);
        if (index > -1) {
            this.info.letters[index] = this.info.letters[this.info.letters.length - 1];
            this.info.letters.pop();

            delete this.info.words[letter];
        }
    }

    Has_Marker(
        marker: Marker,
    ):
        boolean
    {
        Utils.Assert(
            Unicode.Is_Point(marker),
            `Marker must be a point.`,
        );

        return this.info.markers.includes(marker);
    }

    Add_Marker(
        marker: Marker,
    ):
        void
    {
        Utils.Assert(
            Unicode.Is_Point(marker),
            `Marker must be a point.`,
        );

        if (!this.info.markers.includes(marker)) {
            this.info.markers.push(marker);

            this.info.breaks[Boundary.START][marker] = [];
            this.info.breaks[Boundary.MIDDLE][marker] = [];
            this.info.breaks[Boundary.END][marker] = [];
        }
    }

    Remove_Marker(
        marker: Marker,
    ):
        void
    {
        Utils.Assert(
            Unicode.Is_Point(marker),
            `Marker must be a point.`,
        );

        const index: Index = this.info.markers.indexOf(marker);
        if (index > -1) {
            this.info.markers[index] = this.info.markers[this.info.markers.length - 1];
            this.info.markers.pop();

            delete this.info.breaks[Boundary.START][marker];
            delete this.info.breaks[Boundary.MIDDLE][marker];
            delete this.info.breaks[Boundary.END][marker];
        }
    }

    Has_Word(
        word: Word,
    ):
        boolean
    {
        Utils.Assert(
            word.length > 0,
            `Word must have a length greater than 0.`,
        );

        const first_point: string = Unicode.First_Point(word);

        return (
            this.info.words[first_point] != null &&
            this.info.words[first_point].includes(word)
        );
    }

    Add_Word(
        word: Word,
    ):
        void
    {
        Utils.Assert(
            word.length > 0,
            `Word must have a length greater than 0.`,
        );
        Utils.Assert(
            !this.Has_Word_Error(word),
            `Word must not be considered an error.`,
        );

        const first_point: string = Unicode.First_Point(word);

        if (this.info.words[first_point] == null) {
            this.Add_Letter(first_point);
            this.info.words[first_point].push(word);
        } else {
            if (!this.info.words[first_point].includes(word)) {
                this.info.words[first_point].push(word);
            }
        }
    }

    Remove_Word(
        word: Word,
    ):
        void
    {
        Utils.Assert(
            word.length > 0,
            `Word must have a length greater than 0.`,
        );

        const first_point: string = Unicode.First_Point(word);

        if (this.info.words[first_point] != null) {
            const index: Index = this.info.words[first_point].indexOf(word);
            if (index > -1) {
                this.info.words[first_point][index] =
                    this.info.words[first_point][this.info.words[first_point].length - 1];
                this.info.words[first_point].pop();
            }
        }
    }

    Has_Break(
        break_: Break,
        boundary: Boundary,
    ):
        boolean
    {
        Utils.Assert(
            break_.length > 0,
            `Break must have a length greater than 0.`,
        );

        const first_point: string = Unicode.First_Point(break_);

        return (
            this.info.breaks[boundary][first_point] != null &&
            this.info.breaks[boundary][first_point].includes(break_)
        );
    }

    Add_Break(
        break_: Break,
        boundary: Boundary,
    ):
        void
    {
        Utils.Assert(
            break_.length > 0,
            `Break must have a length greater than 0.`,
        );
        Utils.Assert(
            !this.Has_Break_Error(break_, boundary),
            `Break must not be considered an error.`,
        );

        const first_point: string = Unicode.First_Point(break_);

        if (this.info.breaks[boundary][first_point] == null) {
            this.Add_Marker(first_point);
            this.info.breaks[boundary][first_point].push(break_);
        } else {
            if (!this.info.breaks[boundary][first_point].includes(break_)) {
                this.info.breaks[boundary][first_point].push(break_);
            }
        }
    }

    Remove_Break(
        break_: Break,
        boundary: Boundary,
    ):
        void
    {
        Utils.Assert(
            break_.length > 0,
            `Break must have a length greater than 0.`,
        );

        const first_point: string = Unicode.First_Point(break_);

        if (this.info.breaks[boundary][first_point] != null) {
            const index: Index = this.info.breaks[boundary][first_point].indexOf(break_);
            if (index > -1) {
                this.info.breaks[boundary][first_point][index] =
                    this.info.breaks[boundary][first_point][this.info.breaks[boundary][first_point].length - 1];
                this.info.breaks[boundary][first_point].pop();
            }
        }
    }

    Has_Word_Error(
        word_error: Word,
    ):
        boolean
    {
        Utils.Assert(
            word_error.length > 0,
            `Word error must have a length greater than 0.`,
        );

        return this.info.word_errors.includes(word_error);
    }

    Add_Word_Error(
        word_error: Word,
    ):
        void
    {
        Utils.Assert(
            word_error.length > 0,
            `Word error must have a length greater than 0.`,
        );
        Utils.Assert(
            !this.Has_Word(word_error),
            `Error must not be considered a word.`,
        );

        if (!this.info.word_errors.includes(word_error)) {
            this.info.word_errors.push(word_error);
        }
    }

    Remove_Word_Error(
        word_error: Word,
    ):
        void
    {
        Utils.Assert(
            word_error.length > 0,
            `Word error must have a length greater than 0.`,
        );

        const index: Index = this.info.word_errors.indexOf(word_error);
        if (index > -1) {
            this.info.word_errors[index] =
                this.info.word_errors[this.info.word_errors.length - 1];
            this.info.word_errors.pop();
        }
    }

    Has_Break_Error(
        break_error: Break,
        boundary: Boundary,
    ):
        boolean
    {
        Utils.Assert(
            break_error.length > 0,
            `Break error must have a length greater than 0.`,
        );

        return this.info.break_errors[boundary].includes(break_error);
    }

    Add_Break_Error(
        break_error: Break,
        boundary: Boundary,
    ):
        void
    {
        Utils.Assert(
            break_error.length > 0,
            `Break error must have a length greater than 0.`,
        );
        Utils.Assert(
            !this.Has_Break(break_error, boundary),
            `Error must not be considered a break.`,
        );

        if (!this.info.break_errors[boundary].includes(break_error)) {
            this.info.break_errors[boundary].push(break_error);
        }
    }

    Remove_Break_Error(
        break_error: Break,
        boundary: Boundary,
    ):
        void
    {
        Utils.Assert(
            break_error.length > 0,
            `Break error must have a length greater than 0.`,
        );

        const index: Index = this.info.break_errors[boundary].indexOf(break_error);
        if (index > -1) {
            this.info.break_errors[boundary][index] =
                this.info.break_errors[boundary][this.info.break_errors[boundary].length - 1];
            this.info.break_errors[boundary].pop();
        }
    }

    To_JSON():
        string
    {
        this.info.letters.sort();
        this.info.markers.sort();

        const sorted_words: { [index: Letter]: Array<Word> } = {};
        for (const letter of Object.keys(this.info.words).sort()) {
            sorted_words[letter] = this.info.words[letter].sort();
        }
        this.info.words = sorted_words;

        const sorted_breaks: {
            [Boundary.START]: { [index: Marker]: Array<Break> },
            [Boundary.MIDDLE]: { [index: Marker]: Array<Break> },
            [Boundary.END]: { [index: Marker]: Array<Break> },
        } = {
            [Boundary.START]: {},
            [Boundary.MIDDLE]: {},
            [Boundary.END]: {},
        };
        for (const boundary of [Boundary.START, Boundary.MIDDLE, Boundary.END]) {
            for (const marker of Object.keys(this.info.breaks[boundary]).sort()) {
                sorted_breaks[boundary][marker] = this.info.breaks[boundary][marker].sort();
            }
        }
        this.info.breaks = sorted_breaks;

        this.info.word_errors.sort();
        for (const boundary of [Boundary.START, Boundary.MIDDLE, Boundary.END]) {
            this.info.break_errors[boundary].sort();
        }

        return JSON.stringify(this.info);
    }

    Unique_Parts():
        Set<string>
    {
        const unique_parts: Set<string> = new Set();

        for (const parts of Object.values(this.info.words)) {
            for (const part of parts) {
                unique_parts.add(part);
            }
        }
        for (const parts of Object.values(this.info.breaks[Boundary.START])) {
            for (const part of parts) {
                unique_parts.add(part);
            }
        }
        for (const parts of Object.values(this.info.breaks[Boundary.MIDDLE])) {
            for (const part of parts) {
                unique_parts.add(part);
            }
        }
        for (const parts of Object.values(this.info.breaks[Boundary.END])) {
            for (const part of parts) {
                unique_parts.add(part);
            }
        }
        for (const part of this.info.word_errors) {
            unique_parts.add(part);
        }
        for (const part of this.info.break_errors[Boundary.START]) {
            unique_parts.add(part);
        }
        for (const part of this.info.break_errors[Boundary.MIDDLE]) {
            unique_parts.add(part);
        }
        for (const part of this.info.break_errors[Boundary.END]) {
            unique_parts.add(part);
        }

        return unique_parts;
    }
}
