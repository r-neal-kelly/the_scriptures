import { Name } from "../../../types.js";
import { Path } from "../../../types.js";

import * as Utils from "../../../utils.js";
import * as Async from "../../../async.js";

import * as Text from "../../text.js";
import * as Compressor from "../compressor.js";
import * as Version from "./instance.js";

export enum Symbol
{
    NAME = `Dictionary`,
    EXTENSION = `comp`,
}

export class Instance extends Async.Instance
{
    private version: Version.Instance;
    private path: Path;
    private text_dictionary: Text.Dictionary.Instance | null;

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
        this.text_dictionary = null;

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

    Text_Dictionary():
        Text.Dictionary.Instance
    {
        Utils.Assert(
            this.Is_Ready(),
            `Not ready.`,
        );
        Utils.Assert(
            this.text_dictionary != null,
            `text_dictionary should not be null when this is ready!`,
        );

        return this.text_dictionary as Text.Dictionary.Instance;
    }

    override async After_Dependencies_Are_Ready():
        Promise<void>
    {
        let text_dictionary_json: string | null;

        const response: Response =
            await fetch(Utils.Resolve_Path(this.Path()));
        if (response.ok) {
            const compressor: Compressor.Instance =
                this.Version().Language().Book().Data().Compressor();
            text_dictionary_json = compressor.Decompress_Dictionary(await response.text());
        } else {
            text_dictionary_json = null;
        }

        this.text_dictionary = new Text.Dictionary.Instance(
            {
                json: text_dictionary_json,
            },
        );
    }
}
