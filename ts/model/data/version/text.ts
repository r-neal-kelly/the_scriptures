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
    NAME = `Text`,
    EXTENSION = `comp`,
}

export class Instance extends Async.Instance
{
    private version: Version.Instance;
    private path: Path;
    private file_texts: Array<Text.Instance>;

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
        this.path = `${version.Path()}/${Symbol.NAME}.${Symbol.EXTENSION}`;
        this.file_texts = [];

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

    Extension():
        Name
    {
        return Symbol.EXTENSION;
    }

    File_Text_Count():
        Count
    {
        return this.file_texts.length;
    }

    File_Text_At(
        file_text_index: Index,
    ):
        Text.Instance
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );
        Utils.Assert(
            file_text_index > -1,
            `file_text_index must be greater than -1.`,
        );
        Utils.Assert(
            file_text_index < this.File_Text_Count(),
            `file_text_index must be less than file_text_count.`,
        );

        return this.file_texts[file_text_index];
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
            const dictionary: Text.Dictionary.Instance =
                (await this.Version().Dictionary()).Text_Dictionary();
            const compressor: Compressor.Instance =
                this.Version().Compressor();
            for (
                const text_file of
                compressor.Decompress(
                    {
                        value: text_version,
                        dictionary: dictionary,
                    },
                ).split(Version.Symbol.FILE_BREAK)
            ) {
                this.file_texts.push(
                    new Text.Instance(
                        {
                            dictionary: dictionary,
                            value: text_file,
                        },
                    ),
                );
            }
        }
    }
}
