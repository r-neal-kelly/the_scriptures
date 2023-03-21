import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Version from "./version.js";
import * as File from "./file.js";

type Info = {
    names: Array<Name>,
}

export class Instance
{
    private version: Version.Instance;
    private name: Name;
    private path: Path;
    private info: Info | null;
    private files: Array<File.Instance>;

    constructor(
        {
            version,
        }: {
            version: Version.Instance,
        },
    )
    {
        this.version = version;
        this.name = `Files`;
        this.path = `${version.Path()}/${this.name}`;
        this.info = null;
        this.files = [];
    }

    Version():
        Version.Instance
    {
        return this.version;
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

    private async Info():
        Promise<Info>
    {
        await this.Download();

        if (this.info != null) {
            return this.info;
        } else {
            return (
                {
                    names: [],
                }
            );
        }
    }

    async File_Count():
        Promise<Count>
    {
        await this.Download();

        return this.files.length;
    }

    async File(
        file_index: Index,
    ):
        Promise<File.Instance>
    {
        await this.Download();

        Utils.Assert(
            file_index > -1,
            `file_index must be greater than -1.`,
        );
        Utils.Assert(
            file_index < await this.File_Count(),
            `file_index must be less than file_count.`,
        );

        return this.files[file_index];
    }

    async Files():
        Promise<Array<File.Instance>>
    {
        await this.Download();

        return Array.from(this.files);
    }

    private async Download():
        Promise<void>
    {
        if (this.info == null) {
            const response: Response =
                await fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
            if (response.ok) {
                this.info = JSON.parse(await response.text()) as Info;

                for (const name of this.info.names) {
                    this.files.push(
                        new File.Instance(
                            {
                                files: this,
                                name: name,
                            },
                        ),
                    );
                }
            }
        }
    }
}
