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
        if (json != null) {
            this.info = JSON.parse(json);
        } else {
            this.info = {
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
}
