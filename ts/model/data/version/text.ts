import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { Name } from "../../../types.js";
import { Path } from "../../../types.js";

import * as Utils from "../../../utils.js";
import * as Async from "../../../async.js";

import * as Text from "../../text.js";
import * as Compressor from "../compressor.js";
import * as Version from "./instance.js";

export enum Symbol
{
    NAME = `Compressed.txt`,
    TITLE = `Compressed`,
    EXTENSION = `txt`,
}

export class Instance extends Async.Instance
{
    private version: Version.Instance;
    private path: Path;
    private text_files: Array<Text.Instance>;

    constructor(
        {
            version,
        }: {
            version: Version.Instance,
        },
    )
    {
        super();

        this.version = version;
        this.path = `${version.Path()}/${Symbol.NAME}`;
        this.text_files = [];

        this.Add_Dependencies(
            [
                this.Version().Language().Book().Data(),
            ],
        );
    }

    Version():
        Version.Instance
    {
        return this.version;
    }

    Name():
        Name
    {
        return Symbol.NAME;
    }

    Path():
        Path
    {
        return this.path;
    }

    Title():
        Name
    {
        return Symbol.TITLE;
    }

    Extension():
        Name
    {
        return Symbol.EXTENSION;
    }

    Text_File_Count():
        Count
    {
        return this.text_files.length;
    }

    Text_File_At(
        text_file_index: Index,
    ):
        Text.Instance
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );
        Utils.Assert(
            text_file_index > -1,
            `text_file_index must be greater than -1.`,
        );
        Utils.Assert(
            text_file_index < this.Text_File_Count(),
            `text_file_index must be less than text_file_count.`,
        );

        return this.text_files[text_file_index];
    }

    override async After_Dependencies_Are_Ready():
        Promise<void>
    {
        let text_version: string | null;

        const response: Response =
            await fetch(Utils.Resolve_Path(this.Path()));
        if (response.ok) {
            text_version = await response.text();
        } else {
            text_version = null;
        }

        if (text_version != null) {
            const compressor: Compressor.Instance =
                this.Version().Language().Book().Data().Compressor();
            for (
                const text_file of
                compressor.Decompress(text_version).split(Version.Symbol.FILE_BREAK)
            ) {
                this.text_files.push(
                    new Text.Instance(
                        {
                            dictionary:
                                (await this.Version().Dictionary()).Text_Dictionary(),
                            value:
                                text_file.replace(/\r?\n\r?\n/g, `\n \n`),
                        },
                    ),
                );
            }
        }
    }
}
