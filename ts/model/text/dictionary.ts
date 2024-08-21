import { Index } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Unicode from "../../unicode.js";

import * as Language from "../language.js";

import { Value } from "./value.js";
import * as Text from "./instance.js";
import * as Line from "./line.js";
import * as Column from "./column.js";
import * as Row from "./row.js";
import * as Part from "./part.js";

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

export type Validation_Error = string;

type Letters = {
    [language_name: string]: Array<Letter>
};

type Markers = {
    [language_name: string]: Array<Marker>
};

type Words = {
    [language_name: string]: {
        [letter: Letter]: Array<Word>
    }
};

type Breaks = {
    [language_name: string]: {
        [Boundary.START]: { [marker: Marker]: Array<Break> },
        [Boundary.MIDDLE]: { [marker: Marker]: Array<Break> },
        [Boundary.END]: { [marker: Marker]: Array<Break> },
    }
};

type Word_Errors = {
    [language_name: string]: Array<Word>
};

type Break_Errors = {
    [language_name: string]: {
        [Boundary.START]: Array<Break>,
        [Boundary.MIDDLE]: Array<Break>,
        [Boundary.END]: Array<Break>,
    }
};

type Info = {
    default_language_name: string;
    letters: Letters;
    markers: Markers;
    words: Words;
    breaks: Breaks;
    word_errors: Word_Errors;
    break_errors: Break_Errors;
};

const NULL_DEFAULT_LANGUAGE_NAME: string = ``;

export class Instance
{
    private info: Info;

    constructor(
        {
            json = null,
        }: {
            json?: string | null,
        } = {},
    )
    {
        if (json != null) {
            this.info = Object.create(null);
            this.From_JSON(json);
        } else {
            this.info = Object.assign(
                Object.create(null),
                {
                    default_language_name: NULL_DEFAULT_LANGUAGE_NAME,
                    letters: Object.create(null) as Letters,
                    markers: Object.create(null) as Markers,
                    words: Object.create(null) as Words,
                    breaks: Object.create(null) as Breaks,
                    word_errors: Object.create(null) as Word_Errors,
                    break_errors: Object.create(null) as Break_Errors,
                } as Info,
            );
        }
    }

    From_JSON(
        json: string,
    ):
        void
    {
        const object: any = JSON.parse(json);

        this.info = Object.create(null);

        if (object.default_language_name != null) {
            this.info.default_language_name = object.default_language_name;
        } else {
            this.info.default_language_name = NULL_DEFAULT_LANGUAGE_NAME;
        }

        if (object.letters != null) {
            this.info.letters = Object.assign(
                Object.create(null),
                object.letters,
            );
        }

        if (object.markers != null) {
            this.info.markers = Object.assign(
                Object.create(null),
                object.markers,
            );
        }

        if (object.words != null) {
            this.info.words = Object.create(null);
            for (const language_name of Object.keys(object.words)) {
                this.info.words[language_name] = Object.assign(
                    Object.create(null),
                    object.words[language_name],
                );
            }
        }

        if (object.breaks != null) {
            this.info.breaks = Object.create(null);
            for (const language_name of Object.keys(object.breaks)) {
                this.info.breaks[language_name] = Object.create(null);
                for (const boundary of [Boundary.START, Boundary.MIDDLE, Boundary.END]) {
                    if (object.breaks[language_name][boundary] != null) {
                        this.info.breaks[language_name][boundary] = Object.assign(
                            Object.create(null),
                            object.breaks[language_name][boundary],
                        );
                    }
                }
            }
        }

        if (object.word_errors != null) {
            this.info.word_errors = Object.assign(
                Object.create(null),
                object.word_errors,
            );
        }

        if (object.break_errors != null) {
            this.info.break_errors = Object.create(null);
            for (const language_name of Object.keys(object.break_errors)) {
                this.info.break_errors[language_name] = Object.create(null);
                for (const boundary of [Boundary.START, Boundary.MIDDLE, Boundary.END]) {
                    if (object.break_errors[language_name][boundary] != null) {
                        this.info.break_errors[language_name][boundary] =
                            object.break_errors[language_name][boundary];
                    }
                }
            }
        }

        Utils.Assert(
            this.Maybe_Validation_Error() === null,
            `json is invalid: ${this.Maybe_Validation_Error()}`,
        );
    }

    To_JSON():
        string
    {
        // Object.keys returns only an object's own keys, nothing on the prototype,
        // which is what we want. Unlike getOwnPropertyNames, keys only returns
        // enumerable properties, which is fine, because these should all be enumerable.

        const sorted_letters: Letters = Object.create(null);
        for (const language_name of Object.keys(this.info.letters).sort()) {
            sorted_letters[language_name] =
                this.info.letters[language_name].sort();
        }
        this.info.letters = sorted_letters;

        const sorted_markers: Markers = Object.create(null);
        for (const language_name of Object.keys(this.info.markers).sort()) {
            sorted_markers[language_name] =
                this.info.markers[language_name].sort();
        }
        this.info.markers = sorted_markers;

        const sorted_words: Words = Object.create(null);
        for (const language_name of Object.keys(this.info.words).sort()) {
            sorted_words[language_name] = Object.create(null);
            for (const letter of Object.keys(this.info.words[language_name]).sort()) {
                sorted_words[language_name][letter] =
                    this.info.words[language_name][letter].sort();
            }
        }
        this.info.words = sorted_words;

        const sorted_breaks: Breaks = Object.create(null);
        for (const language_name of Object.keys(this.info.breaks).sort()) {
            sorted_breaks[language_name] = Object.create(null);
            for (const boundary of [Boundary.START, Boundary.MIDDLE, Boundary.END]) {
                sorted_breaks[language_name][boundary] = Object.create(null);
                for (const marker of Object.keys(this.info.breaks[language_name][boundary]).sort()) {
                    sorted_breaks[language_name][boundary][marker] =
                        this.info.breaks[language_name][boundary][marker].sort();
                }
            }
        }
        this.info.breaks = sorted_breaks;

        const sorted_word_errors: Word_Errors = Object.create(null);
        for (const language_name of Object.keys(this.info.word_errors).sort()) {
            sorted_word_errors[language_name] =
                this.info.word_errors[language_name].sort();
        }
        this.info.word_errors = sorted_word_errors;

        const sorted_break_errors: Break_Errors = Object.create(null);
        for (const language_name of Object.keys(this.info.break_errors).sort()) {
            sorted_break_errors[language_name] = Object.create(null);
            for (const boundary of [Boundary.START, Boundary.MIDDLE, Boundary.END]) {
                sorted_break_errors[language_name][boundary] =
                    this.info.break_errors[language_name][boundary].sort();
            }
        }
        this.info.break_errors = sorted_break_errors;

        return JSON.stringify(this.info);
    }

    Maybe_Validation_Error():
        Validation_Error | null
    {
        const info: any = this.info as any;

        if (!Utils.Is.Object(info)) {
            return `info is not an object.`;
        }

        if (info[`default_language_name`] == null) {
            return `default_language_name is missing.`;
        }
        if (!Utils.Is.String(info[`default_language_name`])) {
            return `default_language_name is not a string.`;
        }

        for (const property of [`letters`, `markers`]) {
            if (info[property] == null) {
                return `${property} is missing.`;
            }
            if (!Utils.Is.Object(info[property])) {
                return `${property} is not an object.`;
            }
            for (const language_name of Object.keys(info[property])) {
                if (!Utils.Is.String(language_name)) {
                    return `${language_name} is not a string in ${property}.`;
                }
                if (!Utils.Is.Array(info[property][language_name])) {
                    return `${property}.${language_name} is not an array.`;
                }
                for (const letter_or_marker of info[property][language_name]) {
                    if (!Utils.Is.String(letter_or_marker)) {
                        return `${letter_or_marker} is not a string in ${property}.${language_name}.`;
                    }
                }
            }
        }

        if (info[`words`] == null) {
            return `words is missing.`;
        }
        if (!Utils.Is.Object(info[`words`])) {
            return `words is not an object.`;
        }
        for (const language_name of Object.keys(info[`words`])) {
            if (!Utils.Is.String(language_name)) {
                return `${language_name} is not a string in words.`;
            }
            if (!Utils.Is.Object(info[`words`][language_name])) {
                return `words.${language_name} is not an object.`;
            }
            for (const letter of Object.keys(info[`words`][language_name])) {
                if (!Utils.Is.String(letter)) {
                    return `${letter} is not a string in words.${language_name}.`;
                }
                if (!Utils.Is.Array(info[`words`][language_name][letter])) {
                    return `words.${language_name}.${letter} is not an array.`;
                }
                for (const word of info[`words`][language_name][letter]) {
                    if (!Utils.Is.String(word)) {
                        return `${word} is not a string in words.${language_name}.${letter}.`;
                    }
                }
            }
        }

        if (info[`breaks`] == null) {
            return `breaks is missing.`;
        }
        if (!Utils.Is.Object(info[`breaks`])) {
            return `breaks is not an object.`;
        }
        for (const language_name of Object.keys(info[`breaks`])) {
            if (!Utils.Is.String(language_name)) {
                return `${language_name} is not a string in breaks.`;
            }
            if (!Utils.Is.Object(info[`breaks`][language_name])) {
                return `breaks.${language_name} is not an object.`;
            }
            for (const boundary of [Boundary.START, Boundary.MIDDLE, Boundary.END]) {
                if (info[`breaks`][language_name][boundary] == null) {
                    return `breaks.${language_name}.${boundary} is missing.`;
                }
                if (!Utils.Is.Object(info[`breaks`][language_name][boundary])) {
                    return `breaks.${language_name}.${boundary} is not an object.`;
                }
                for (const marker of Object.keys(info[`breaks`][language_name][boundary])) {
                    if (!Utils.Is.String(marker)) {
                        return `${marker} is not a string in breaks.${language_name}.${boundary}.`;
                    }
                    if (!Utils.Is.Array(info[`breaks`][language_name][boundary][marker])) {
                        return `breaks.${language_name}.${boundary}.${marker} is not an array.`;
                    }
                    for (const break_ of info[`breaks`][language_name][boundary][marker]) {
                        if (!Utils.Is.String(break_)) {
                            return `${break_} is not a string in breaks.${language_name}.${boundary}.${marker}.`;
                        }
                    }
                }
            }
        }

        if (info[`word_errors`] == null) {
            return `word_errors is missing.`;
        }
        if (!Utils.Is.Object(info[`word_errors`])) {
            return `word_errors is not an object.`;
        }
        for (const language_name of Object.keys(info[`word_errors`])) {
            if (!Utils.Is.String(language_name)) {
                return `${language_name} is not a string in word_errors.`;
            }
            if (!Utils.Is.Array(info[`word_errors`][language_name])) {
                return `word_errors.${language_name} is not an array.`;
            }
            for (const word_error of info[`word_errors`][language_name]) {
                if (!Utils.Is.String(word_error)) {
                    return `${word_error} is not a string in word_errors.${language_name}.`;
                }
            }
        }

        if (info[`break_errors`] == null) {
            return `break_errors is missing.`;
        }
        if (!Utils.Is.Object(info[`break_errors`])) {
            return `break_errors is not an object.`;
        }
        for (const language_name of Object.keys(info[`break_errors`])) {
            if (!Utils.Is.String(language_name)) {
                return `${language_name} is not a string in break_errors.`;
            }
            if (!Utils.Is.Object(info[`break_errors`][language_name])) {
                return `break_errors.${language_name} is not an object.`;
            }
            for (const boundary of [Boundary.START, Boundary.MIDDLE, Boundary.END]) {
                if (info[`break_errors`][language_name][boundary] == null) {
                    return `break_errors.${language_name}.${boundary} is missing.`;
                }
                if (!Utils.Is.Array(info[`break_errors`][language_name][boundary])) {
                    return `break_errors.${language_name}.${boundary} is not an array.`;
                }
                for (const break_error of info[`break_errors`][language_name][boundary]) {
                    if (!Utils.Is.String(break_error)) {
                        return `${break_error} is not a string in break_errors.${language_name}.${boundary}.`;
                    }
                }
            }
        }

        return null;
    }

    Default_Language_Name():
        Language.Name | null
    {
        return this.info.default_language_name !== NULL_DEFAULT_LANGUAGE_NAME ?
            this.info.default_language_name as Language.Name :
            null;
    }

    Set_Default_Language_Name(
        default_language_name: Language.Name | null,
    ):
        void
    {
        const previous_default_language_name: string =
            this.info.default_language_name;
        const next_default_language_name: string = default_language_name != null ?
            default_language_name as string :
            NULL_DEFAULT_LANGUAGE_NAME;

        if (previous_default_language_name !== next_default_language_name) {
            this.info.default_language_name = next_default_language_name;

            if (this.info.letters[previous_default_language_name] != null) {
                this.info.letters[next_default_language_name] =
                    this.info.letters[previous_default_language_name];
                delete this.info.letters[previous_default_language_name];
            }

            if (this.info.markers[previous_default_language_name] != null) {
                this.info.markers[next_default_language_name] =
                    this.info.markers[previous_default_language_name];
                delete this.info.markers[previous_default_language_name];
            }

            if (this.info.words[previous_default_language_name] != null) {
                this.info.words[next_default_language_name] =
                    this.info.words[previous_default_language_name];
                delete this.info.words[previous_default_language_name];
            }

            if (this.info.breaks[previous_default_language_name] != null) {
                this.info.breaks[next_default_language_name] =
                    this.info.breaks[previous_default_language_name];
                delete this.info.breaks[previous_default_language_name];
            }

            if (this.info.word_errors[previous_default_language_name] != null) {
                this.info.word_errors[next_default_language_name] =
                    this.info.word_errors[previous_default_language_name];
                delete this.info.word_errors[previous_default_language_name];
            }

            if (this.info.break_errors[previous_default_language_name] != null) {
                this.info.break_errors[next_default_language_name] =
                    this.info.break_errors[previous_default_language_name];
                delete this.info.break_errors[previous_default_language_name];
            }
        }
    }

    private Language_Key(
        language_name: Language.Name | null,
    ):
        string
    {
        if (language_name != null) {
            return language_name as string;
        } else {
            return this.info.default_language_name;
        }
    }

    Has_Letter(
        letter: Letter,
        language_name: Language.Name | null,
    ):
        boolean
    {
        Utils.Assert(
            Unicode.Is_Point(letter),
            `Letter must be a point.`,
        );

        const language_key: string = this.Language_Key(language_name);

        return (
            this.info.letters[language_key] != null &&
            this.info.letters[language_key].includes(letter)
        );
    }

    Is_Letter(
        letter: Letter,
    ):
        boolean
    {
        Utils.Assert(
            Unicode.Is_Point(letter),
            `Letter must be a point.`,
        );

        for (const language_key of Object.keys(this.info.letters)) {
            if (this.Has_Letter(letter, language_key as Language.Name)) {
                return true;
            }
        }

        return false;
    }

    Add_Letter(
        letter: Letter,
        language_name: Language.Name | null,
    ):
        void
    {
        Utils.Assert(
            Unicode.Is_Point(letter),
            `Letter must be a point.`,
        );

        const language_key: string = this.Language_Key(language_name);

        if (this.info.letters[language_key] == null) {
            this.info.letters[language_key] = [];
        }
        if (!this.info.letters[language_key].includes(letter)) {
            this.info.letters[language_key].push(letter);

            if (this.info.words[language_key] == null) {
                this.info.words[language_key] = Object.create(null);
            }
            this.info.words[language_key][letter] = [];
        }
    }

    Remove_Letter(
        letter: Letter,
        language_name: Language.Name | null,
    ):
        void
    {
        Utils.Assert(
            Unicode.Is_Point(letter),
            `Letter must be a point.`,
        );

        const language_key: string = this.Language_Key(language_name);

        if (this.info.letters[language_key] != null) {
            {
                const words_to_remove: Array<Word> = [];

                for (const info_letter of this.info.letters[language_key]) {
                    for (const info_word of this.info.words[language_key][info_letter]) {
                        if (Unicode.Has_Point(info_word, letter)) {
                            words_to_remove.push(info_word);
                        }
                    }
                }
                for (const word_to_remove of words_to_remove) {
                    this.Remove_Word(word_to_remove, language_name);
                }
            }

            if (this.info.word_errors[language_key] != null) {
                const word_errors_to_remove: Array<Word> = [];

                for (const info_word_error of this.info.word_errors[language_key]) {
                    if (Unicode.Has_Point(info_word_error, letter)) {
                        word_errors_to_remove.push(info_word_error);
                    }
                }
                for (const word_error_to_remove of word_errors_to_remove) {
                    this.Remove_Word_Error(word_error_to_remove, language_name);
                }
            }

            const index: Index = this.info.letters[language_key].indexOf(letter);

            if (index > -1) {
                const last_index: Index = this.info.letters[language_key].length - 1;

                this.info.letters[language_key][index] =
                    this.info.letters[language_key][last_index];
                this.info.letters[language_key].pop();

                delete this.info.words[language_key][letter];
            }
        }
    }

    Has_Marker(
        marker: Marker,
        language_name: Language.Name | null,
    ):
        boolean
    {
        Utils.Assert(
            Unicode.Is_Point(marker),
            `Marker must be a point.`,
        );

        const language_key: string = this.Language_Key(language_name);

        return (
            this.info.markers[language_key] != null &&
            this.info.markers[language_key].includes(marker)
        );
    }

    Is_Marker(
        marker: Marker,
    ):
        boolean
    {
        Utils.Assert(
            Unicode.Is_Point(marker),
            `Marker must be a point.`,
        );

        for (const language_key of Object.keys(this.info.markers)) {
            if (this.Has_Marker(marker, language_key as Language.Name)) {
                return true;
            }
        }

        return false;
    }

    Add_Marker(
        marker: Marker,
        language_name: Language.Name | null,
    ):
        void
    {
        Utils.Assert(
            Unicode.Is_Point(marker),
            `Marker must be a point.`,
        );

        const language_key: string = this.Language_Key(language_name);

        if (this.info.markers[language_key] == null) {
            this.info.markers[language_key] = [];
        }
        if (!this.info.markers[language_key].includes(marker)) {
            this.info.markers[language_key].push(marker);

            if (this.info.breaks[language_key] == null) {
                this.info.breaks[language_key] = Object.create(null);
                this.info.breaks[language_key][Boundary.START] = Object.create(null);
                this.info.breaks[language_key][Boundary.MIDDLE] = Object.create(null);
                this.info.breaks[language_key][Boundary.END] = Object.create(null);
            }
            this.info.breaks[language_key][Boundary.START][marker] = [];
            this.info.breaks[language_key][Boundary.MIDDLE][marker] = [];
            this.info.breaks[language_key][Boundary.END][marker] = [];
        }
    }

    Remove_Marker(
        marker: Marker,
        language_name: Language.Name | null,
    ):
        void
    {
        Utils.Assert(
            Unicode.Is_Point(marker),
            `Marker must be a point.`,
        );

        const language_key: string = this.Language_Key(language_name);

        if (this.info.markers[language_key] != null) {
            {
                const breaks_to_remove: Array<[Break, Boundary]> = [];

                for (const info_marker of this.info.markers[language_key]) {
                    for (const info_boundary of [Boundary.START, Boundary.MIDDLE, Boundary.END]) {
                        for (const info_break of this.info.breaks[language_key][info_boundary][info_marker]) {
                            if (Unicode.Has_Point(info_break, marker)) {
                                breaks_to_remove.push([info_break, info_boundary]);
                            }
                        }
                    }
                }
                for (const [break_to_remove, boundary] of breaks_to_remove) {
                    this.Remove_Break(break_to_remove, boundary, language_name);
                }
            }

            if (this.info.break_errors[language_key] != null) {
                const break_errors_to_remove: Array<[Break, Boundary]> = [];

                for (const info_boundary of [Boundary.START, Boundary.MIDDLE, Boundary.END]) {
                    for (const info_break_error of this.info.break_errors[language_key][info_boundary]) {
                        if (Unicode.Has_Point(info_break_error, marker)) {
                            break_errors_to_remove.push([info_break_error, info_boundary]);
                        }
                    }
                }
                for (const [break_error_to_remove, boundary] of break_errors_to_remove) {
                    this.Remove_Break_Error(break_error_to_remove, boundary, language_name);
                }
            }

            const index: Index = this.info.markers[language_key].indexOf(marker);

            if (index > -1) {
                const last_index: Index = this.info.markers[language_key].length - 1;

                this.info.markers[language_key][index] =
                    this.info.markers[language_key][last_index];
                this.info.markers[language_key].pop();

                delete this.info.breaks[language_key][Boundary.START][marker];
                delete this.info.breaks[language_key][Boundary.MIDDLE][marker];
                delete this.info.breaks[language_key][Boundary.END][marker];
            }
        }
    }

    Has_Word(
        word: Word,
        language_name: Language.Name | null,
    ):
        boolean
    {
        Utils.Assert(
            word.length > 0,
            `Word must have a length greater than 0.`,
        );

        const language_key: string = this.Language_Key(language_name);

        if (this.info.words[language_key] != null) {
            const first_point: string = Unicode.First_Point(word);

            return (
                this.info.words[language_key][first_point] != null &&
                this.info.words[language_key][first_point].includes(word)
            );
        } else {
            return false;
        }
    }

    Is_Word(
        word: Word,
    ):
        boolean
    {
        Utils.Assert(
            word.length > 0,
            `Word must have a length greater than 0.`,
        );

        for (const language_key of Object.keys(this.info.words)) {
            if (this.Has_Word(word, language_key as Language.Name)) {
                return true;
            }
        }

        return false;
    }

    Add_Word(
        word: Word,
        language_name: Language.Name | null,
    ):
        void
    {
        Utils.Assert(
            word.length > 0,
            `Word must have a length greater than 0.`,
        );
        Utils.Assert(
            !this.Has_Word_Error(word, language_name),
            `Word must not be considered an error.`,
        );

        for (const letter of Unicode.Points(word)) {
            if (!this.Has_Letter(letter, language_name)) {
                return;
            }
        }

        const language_key: string = this.Language_Key(language_name);
        const first_point: string = Unicode.First_Point(word);

        if (!this.info.words[language_key][first_point].includes(word)) {
            this.info.words[language_key][first_point].push(word);
        }
    }

    Remove_Word(
        word: Word,
        language_name: Language.Name | null,
    ):
        void
    {
        Utils.Assert(
            word.length > 0,
            `Word must have a length greater than 0.`,
        );

        const language_key: string = this.Language_Key(language_name);

        if (this.info.words[language_key] != null) {
            const first_point: string = Unicode.First_Point(word);

            if (this.info.words[language_key][first_point] != null) {
                const index: Index = this.info.words[language_key][first_point].indexOf(word);

                if (index > -1) {
                    const last_index: Index = this.info.words[language_key][first_point].length - 1;

                    this.info.words[language_key][first_point][index] =
                        this.info.words[language_key][first_point][last_index];
                    this.info.words[language_key][first_point].pop();
                }
            }
        }
    }

    Has_Break(
        break_: Break,
        boundary: Boundary,
        language_name: Language.Name | null,
    ):
        boolean
    {
        Utils.Assert(
            break_.length > 0,
            `Break must have a length greater than 0.`,
        );

        const language_key: string = this.Language_Key(language_name);

        if (this.info.breaks[language_key] != null) {
            const first_point: string = Unicode.First_Point(break_);

            return (
                this.info.breaks[language_key][boundary][first_point] != null &&
                this.info.breaks[language_key][boundary][first_point].includes(break_)
            );
        } else {
            return false;
        }
    }

    Is_Break(
        break_: Break,
        boundary: Boundary,
    ):
        boolean
    {
        Utils.Assert(
            break_.length > 0,
            `Break must have a length greater than 0.`,
        );

        for (const language_key of Object.keys(this.info.breaks)) {
            if (this.Has_Break(break_, boundary, language_key as Language.Name)) {
                return true;
            }
        }

        return false;
    }

    Add_Break(
        break_: Break,
        boundary: Boundary,
        language_name: Language.Name | null,
    ):
        void
    {
        Utils.Assert(
            break_.length > 0,
            `Break must have a length greater than 0.`,
        );
        Utils.Assert(
            !this.Has_Break_Error(break_, boundary, language_name),
            `Break must not be considered an error.`,
        );

        for (const marker of Unicode.Points(break_)) {
            if (!this.Has_Marker(marker, language_name)) {
                return;
            }
        }

        const language_key: string = this.Language_Key(language_name);
        const first_point: string = Unicode.First_Point(break_);

        if (!this.info.breaks[language_key][boundary][first_point].includes(break_)) {
            this.info.breaks[language_key][boundary][first_point].push(break_);
        }
    }

    Remove_Break(
        break_: Break,
        boundary: Boundary,
        language_name: Language.Name | null,
    ):
        void
    {
        Utils.Assert(
            break_.length > 0,
            `Break must have a length greater than 0.`,
        );

        const language_key: string = this.Language_Key(language_name);

        if (this.info.breaks[language_key] != null) {
            const first_point: string = Unicode.First_Point(break_);

            if (this.info.breaks[language_key][boundary][first_point] != null) {
                const index: Index =
                    this.info.breaks[language_key][boundary][first_point].indexOf(break_);

                if (index > -1) {
                    const last_index: Index =
                        this.info.breaks[language_key][boundary][first_point].length - 1;

                    this.info.breaks[language_key][boundary][first_point][index] =
                        this.info.breaks[language_key][boundary][first_point][last_index];
                    this.info.breaks[language_key][boundary][first_point].pop();
                }
            }
        }
    }

    Has_Word_Error(
        word_error: Word,
        language_name: Language.Name | null,
    ):
        boolean
    {
        Utils.Assert(
            word_error.length > 0,
            `Word error must have a length greater than 0.`,
        );

        const language_key: string = this.Language_Key(language_name);

        return (
            this.info.word_errors[language_key] != null &&
            this.info.word_errors[language_key].includes(word_error)
        );
    }

    Is_Word_Error(
        word_error: Word,
    ):
        boolean
    {
        Utils.Assert(
            word_error.length > 0,
            `Word error must have a length greater than 0.`,
        );

        for (const language_key of Object.keys(this.info.word_errors)) {
            if (this.Has_Word_Error(word_error, language_key as Language.Name)) {
                return true;
            }
        }

        return false;
    }

    Add_Word_Error(
        word_error: Word,
        language_name: Language.Name | null,
    ):
        void
    {
        Utils.Assert(
            word_error.length > 0,
            `Word error must have a length greater than 0.`,
        );
        Utils.Assert(
            !this.Has_Word(word_error, language_name),
            `Error must not be considered a word.`,
        );

        for (const letter of Unicode.Points(word_error)) {
            if (!this.Has_Letter(letter, language_name)) {
                return;
            }
        }

        const language_key: string = this.Language_Key(language_name);

        if (this.info.word_errors[language_key] == null) {
            this.info.word_errors[language_key] = [];
        }
        if (!this.info.word_errors[language_key].includes(word_error)) {
            this.info.word_errors[language_key].push(word_error);
        }
    }

    Remove_Word_Error(
        word_error: Word,
        language_name: Language.Name | null,
    ):
        void
    {
        Utils.Assert(
            word_error.length > 0,
            `Word error must have a length greater than 0.`,
        );

        const language_key: string = this.Language_Key(language_name);

        if (this.info.word_errors[language_key] != null) {
            const index: Index = this.info.word_errors[language_key].indexOf(word_error);

            if (index > -1) {
                const last_index: Index = this.info.word_errors[language_key].length - 1;

                this.info.word_errors[language_key][index] =
                    this.info.word_errors[language_key][last_index];
                this.info.word_errors[language_key].pop();
            }
        }
    }

    Has_Break_Error(
        break_error: Break,
        boundary: Boundary,
        language_name: Language.Name | null,
    ):
        boolean
    {
        Utils.Assert(
            break_error.length > 0,
            `Break error must have a length greater than 0.`,
        );

        const language_key: string = this.Language_Key(language_name);

        return (
            this.info.break_errors[language_key] != null &&
            this.info.break_errors[language_key][boundary].includes(break_error)
        );
    }

    Is_Break_Error(
        break_error: Break,
        boundary: Boundary,
    ):
        boolean
    {
        Utils.Assert(
            break_error.length > 0,
            `Break error must have a length greater than 0.`,
        );

        for (const language_key of Object.keys(this.info.break_errors)) {
            if (this.Has_Break_Error(break_error, boundary, language_key as Language.Name)) {
                return true;
            }
        }

        return false;
    }

    Add_Break_Error(
        break_error: Break,
        boundary: Boundary,
        language_name: Language.Name | null,
    ):
        void
    {
        Utils.Assert(
            break_error.length > 0,
            `Break error must have a length greater than 0.`,
        );
        Utils.Assert(
            !this.Has_Break(break_error, boundary, language_name),
            `Error must not be considered a break.`,
        );

        for (const marker of Unicode.Points(break_error)) {
            if (!this.Has_Marker(marker, language_name)) {
                return;
            }
        }

        const language_key: string = this.Language_Key(language_name);

        if (this.info.break_errors[language_key] == null) {
            this.info.break_errors[language_key] = Object.create(null);
            this.info.break_errors[language_key][Boundary.START] = [];
            this.info.break_errors[language_key][Boundary.MIDDLE] = [];
            this.info.break_errors[language_key][Boundary.END] = [];
        }
        if (!this.info.break_errors[language_key][boundary].includes(break_error)) {
            this.info.break_errors[language_key][boundary].push(break_error);
        }
    }

    Remove_Break_Error(
        break_error: Break,
        boundary: Boundary,
        language_name: Language.Name | null,
    ):
        void
    {
        Utils.Assert(
            break_error.length > 0,
            `Break error must have a length greater than 0.`,
        );

        const language_key: string = this.Language_Key(language_name);

        if (this.info.break_errors[language_key] != null) {
            const index: Index =
                this.info.break_errors[language_key][boundary].indexOf(break_error);

            if (index > -1) {
                const last_index: Index =
                    this.info.break_errors[language_key][boundary].length - 1;

                this.info.break_errors[language_key][boundary][index] =
                    this.info.break_errors[language_key][boundary][last_index];
                this.info.break_errors[language_key][boundary].pop();
            }
        }
    }

    Add_All_From(
        other: Instance,
    ):
        void
    {
        Utils.Assert(
            false,
            `not implemented.`,
        );

        // we'll be able to implement this once we have the default language name update done.
    }

    /*
        Only add parts from lines in the given text that have no unknown points.
    */
    Add_All_Possible_From_Text(
        text: Text.Instance,
    ):
        void
    {
        const text_default_language_name: Language.Name | null =
            text.Default_Language_Name();
        const possible_lines: Array<Line.Instance> = text.Lines().filter(
            function (
                line: Line.Instance,
            ):
                boolean
            {
                for (
                    let column_idx = 0, column_end = line.Column_Count();
                    column_idx < column_end;
                    column_idx += 1
                ) {
                    const column: Column.Instance = line.Column(column_idx);
                    for (
                        let row_idx = 0, row_end = column.Row_Count();
                        row_idx < row_end;
                        row_idx += 1
                    ) {
                        const row: Row.Instance = column.Row(row_idx);
                        for (
                            let part_idx = 0, part_end = row.Micro_Part_Count();
                            part_idx < part_end;
                            part_idx += 1
                        ) {
                            const part: Part.Instance = row.Micro_Part(part_idx);
                            if (part.Is_Unknown()) {
                                return false;
                            }
                        }
                    }
                }

                return true;
            },
        );

        for (
            let line_idx = 0, line_end = possible_lines.length;
            line_idx < line_end;
            line_idx += 1
        ) {
            const line: Line.Instance = possible_lines[line_idx];
            for (
                let column_idx = 0, column_end = line.Column_Count();
                column_idx < column_end;
                column_idx += 1
            ) {
                const column: Column.Instance = line.Column(column_idx);
                for (
                    let row_idx = 0, row_end = column.Row_Count();
                    row_idx < row_end;
                    row_idx += 1
                ) {
                    const row: Row.Instance = column.Row(row_idx);
                    for (
                        let part_idx = 0, part_end = row.Macro_Part_Count();
                        part_idx < part_end;
                        part_idx += 1
                    ) {
                        const part: Part.Instance = row.Macro_Part(part_idx);
                        if (!part.Is_Command()) {
                            const value: Value = part.Value();
                            const language_name: Language.Name | null =
                                part.Language() || text_default_language_name;
                            if (part.Is_Word()) {
                                if (
                                    !this.Has_Word(
                                        value,
                                        language_name,
                                    )
                                ) {
                                    if (
                                        this.Has_Word_Error(
                                            value,
                                            language_name,
                                        )
                                    ) {
                                        // if not in a fix tag, then it's assumed as not an error
                                        // even if it's currently a static error in its own dictionary.
                                        // This allows its own dictionary to update itself when parts
                                        // are no longer considered static errors.
                                        if (!part.Has_Error_Style()) {
                                            this.Remove_Word_Error(
                                                value,
                                                language_name,
                                            );
                                            this.Add_Word(
                                                value,
                                                language_name,
                                            );
                                        }
                                    } else {
                                        if (part.Is_Error() || part.Has_Error_Style()) {
                                            this.Add_Word_Error(
                                                value,
                                                language_name,
                                            );
                                        } else {
                                            this.Add_Word(
                                                value,
                                                language_name,
                                            );
                                        }
                                    }
                                }
                            } else if (part.Is_Break()) {
                                const boundary: Boundary = (part as Part.Break.Instance).Boundary();
                                if (
                                    !this.Has_Break(
                                        value,
                                        boundary,
                                        language_name,
                                    )
                                ) {
                                    if (
                                        this.Has_Break_Error(
                                            value,
                                            boundary,
                                            language_name,
                                        )
                                    ) {
                                        // see comment above where part is a word
                                        if (!part.Has_Error_Style()) {
                                            this.Remove_Break_Error(
                                                value,
                                                boundary,
                                                language_name,
                                            );
                                            this.Add_Break(
                                                value,
                                                boundary,
                                                language_name,
                                            );
                                        }
                                    } else {
                                        if (part.Is_Error() || part.Has_Error_Style()) {
                                            this.Add_Break_Error(
                                                value,
                                                boundary,
                                                language_name,
                                            );
                                        } else {
                                            this.Add_Break(
                                                value,
                                                boundary,
                                                language_name,
                                            );
                                        }
                                    }
                                }
                            } else {
                                Utils.Assert(
                                    false,
                                    `unknown part type`,
                                );
                            }
                        }
                    }
                }
            }
        }
    }
}
