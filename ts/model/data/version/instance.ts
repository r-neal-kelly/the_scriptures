import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { Name } from "../../../types.js";
import { Path } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Compressor from "../compressor.js";
import * as Language from "../language.js";
import * as Dictionary from "./dictionary.js";
import * as Text from "./text.js";
import * as File from "../file.js";

export type Branch = {
    name: Name,
    files: Array<File.Leaf>,
};

export enum Symbol
{
    FILE_BREAK = `\n~~~FILE_BREAK~~~\n`,
}

export class Instance extends Entity.Instance
{
    private language: Language.Instance;
    private name: Name;
    private path: Path;
    private dictionary: Dictionary.Instance;
    private text: Text.Instance;
    private files: Array<File.Instance>;

    constructor(
        {
            language,
            branch,
        }: {
            language: Language.Instance,
            branch: Branch,
        },
    )
    {
        super();

        this.language = language;
        this.name = branch.name;
        this.path = `${language.Path()}/${branch.name}`;
        this.dictionary = new Dictionary.Instance(
            {
                version: this,
            },
        );
        this.text = new Text.Instance(
            {
                version: this,
            },
        );
        this.files = [];
        for (const file_leaf of branch.files) {
            this.files.push(
                new File.Instance(
                    {
                        version: this,
                        leaf: file_leaf,
                    },
                ),
            );
        }

        this.Add_Dependencies(
            [
            ],
        );
    }

    Language():
        Language.Instance
    {
        return this.language;
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

    async Dictionary():
        Promise<Dictionary.Instance>
    {
        await this.dictionary.Ready();

        return this.dictionary;
    }

    async Text():
        Promise<Text.Instance>
    {
        await this.text.Ready();

        return this.text;
    }

    File(
        file_name: Name,
    ):
        File.Instance
    {
        for (const file of this.files) {
            if (file.Name() === file_name) {
                return file;
            }
        }

        Utils.Assert(
            false,
            `Invalid file_name.`,
        );

        return this.files[0];
    }

    File_Count():
        Count
    {
        return this.files.length;
    }

    File_At(
        file_index: Index,
    ):
        File.Instance
    {
        Utils.Assert(
            file_index > -1,
            `file_index must be greater than -1.`,
        );
        Utils.Assert(
            file_index < this.File_Count(),
            `file_index must be less than file_count.`,
        );

        return this.files[file_index];
    }

    Files():
        Array<File.Instance>
    {
        return Array.from(this.files);
    }

    Compressor():
        Compressor.Instance
    {
        return this.Language().Book().Data().Compressor(this.Language().Name());
    }
}
