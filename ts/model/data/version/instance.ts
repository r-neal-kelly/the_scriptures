import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { Name } from "../../../types.js";
import { Path } from "../../../types.js";

import * as Utils from "../../../utils.js";
import * as Main_Compressors from "../../../compressor.js";

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

export enum Consts
{
    UNIQUE_PARTS_FILE_NAME = `Unique_Parts.comp`,
}

export enum Symbol
{
    FILE_BREAK = `\n~~~FILE_BREAK~~~\n`,
}

export class Instance extends Entity.Instance
{
    private language: Language.Instance;
    private name: Name;
    private path: Path;
    private compressor: Compressor.Instance | null;
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
        this.compressor = null;
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
        for (let idx = 0, end = branch.files.length; idx < end; idx += 1) {
            this.files.push(
                new File.Instance(
                    {
                        version: this,
                        name: branch.files[idx],
                        index: idx,
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

    async Compressor(
        {
            fetch_attempt_count,
            fetch_attempt_limit,
        }: {
            fetch_attempt_count: Count,
            fetch_attempt_limit: Count,
        } = {
                fetch_attempt_count: 0,
                fetch_attempt_limit: 3,
            },
    ):
        Promise<Compressor.Instance>
    {
        if (this.compressor != null) {
            return this.compressor;
        } else {
            if (fetch_attempt_count < fetch_attempt_limit) {
                const response: Response =
                    await fetch(Utils.Resolve_Path(`${this.Path()}/${Consts.UNIQUE_PARTS_FILE_NAME}`));
                if (response.ok) {
                    this.compressor = new Compressor.Instance(
                        {
                            unique_parts: JSON.parse(
                                Main_Compressors.LZSS_Decompress(await response.text()),
                            ) as Array<string>,
                        },
                    );

                    return this.compressor;
                } else {
                    return await this.Compressor(
                        {
                            fetch_attempt_count: fetch_attempt_count + 1,
                            fetch_attempt_limit: fetch_attempt_limit,
                        },
                    );
                }
            } else {
                return new Compressor.Instance(
                    {
                        unique_parts: [],
                    },
                );
            }
        }
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
}
