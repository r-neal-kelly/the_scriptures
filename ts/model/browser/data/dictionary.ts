import { Name } from "../../../types.js";
import { Path } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Async from "../../../async.js";

import * as Files from "./files.js";

export type Letter = string;

export type Marker = string;

export type Word = string;

export type Break = string;

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

export class Instance extends Async.Instance
{
    private files: Files.Instance;
    private name: Name;
    private path: Path;
    private title: Name;
    private extension: Name;
    private info: Info | null;

    constructor(
        {
            files,
        }: {
            files: Files.Instance,
        },
    )
    {
        super();

        this.files = files;
        this.name = `Dictionary.json`;
        this.path = `${files.Path()}/${this.name}`;
        this.title = this.name.replace(/\.[^.]*$/, ``);
        this.extension = this.name.replace(/^[^.]*\./, ``);
        this.info = null;
    }

    Files():
        Files.Instance
    {
        return this.files;
    }

    Name():
        Name
    {
        return this.name;
    }

    Path():
        Path
    {
        return this.path;
    }

    Title():
        Name
    {
        return this.title;
    }

    Extension():
        Name
    {
        return this.extension;
    }

    private Info():
        Info
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );
        Utils.Assert(
            this.info != null,
            `Info should not be null when dictionary is ready.`,
        );

        return this.info as Info;
    }

    async Ready():
        Promise<void>
    {
        await super.Ready();

        const response: Response =
            await fetch(Utils.Resolve_Path(this.Path()));
        if (response.ok) {
            this.info = JSON.parse(await response.text()) as Info;
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
}
