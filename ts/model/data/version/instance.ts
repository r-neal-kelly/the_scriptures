import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { Name } from "../../../types.js";
import { Path } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Text from "../../text.js";

import * as Language from "../language.js";
import * as File from "../file.js";

export type Branch = {
    name: Name,
    files: Array<File.Leaf>,
};

export class Instance extends Entity.Instance
{
    private language: Language.Instance;
    private name: Name;
    private path: Path;
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
        this.files = [];
        for (let idx = 0, end = branch.files.length; idx < end; idx += 1) {
            this.files.push(
                new File.Instance(
                    {
                        version: this,
                        title: branch.files[idx],
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

    async Dictionary():
        Promise<Text.Dictionary.Instance>
    {
        return (
            await this.Language().Book().Data().Cache().Dictionary(
                this.Path(),
            ) ||
            new Text.Dictionary.Instance()
        );
    }

    File(
        file_title: Name,
    ):
        File.Instance
    {
        for (const file of this.files) {
            if (file.Title() === file_title) {
                return file;
            }
        }

        Utils.Assert(
            false,
            `Invalid file_title.`,
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

    async Cache_Files():
        Promise<void>
    {
        await this.Language().Book().Data().Cache().Cache_Version_And_Files(
            this.Path(),
            this.files.map(
                function (
                    file: File.Instance,
                ):
                    Name
                {
                    return file.Name();
                },
            ),
        );
    }
}
