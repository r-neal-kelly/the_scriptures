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

    private Info():
        Info
    {
        return this.info;
    }

    // Here we can add the functionality that will cover both browser and editor.
}
