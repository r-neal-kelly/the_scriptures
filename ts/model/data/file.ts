import { Index } from "../../types.js";
import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Entity from "../entity.js";
import * as Text from "../text.js";
import * as Compressor from "./compressor.js";
import * as Version from "./version.js";

export type Leaf = {
    name: Name,
    index: Index,
};

export class Instance extends Entity.Instance
{
    private version: Version.Instance;
    private name: Name;
    private index: Index;
    private path: Path;
    private title: Name;
    private extension: Name;
    private text: Text.Instance | null;

    constructor(
        {
            version,
            leaf,
        }: {
            version: Version.Instance,
            leaf: Leaf,
        },
    )
    {
        super();

        this.version = version;
        this.name = leaf.name;
        this.index = leaf.index;
        this.path = `${version.Path()}/${leaf.name}`;
        this.title = leaf.name.replace(/\.[^.]*$/, ``);
        this.extension = leaf.name.replace(/^[^.]*\./, ``);
        this.text = null;

        this.Add_Dependencies(
            [
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
        return this.name;
    }

    Index():
        Index
    {
        return this.index;
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

    async Text():
        Promise<Text.Instance>
    {
        await this.Ready();

        return this.text as Text.Instance;
    }

    async After_Dependencies_Are_Ready():
        Promise<void>
    {
        let text_value: Text.Value | null;

        const response: Response =
            await fetch(Utils.Resolve_Path(this.Path()));
        if (response.ok) {
            text_value = await response.text();
        } else {
            text_value = null;
        }

        const dictionary: Text.Dictionary.Instance =
            (await this.Version().Dictionary()).Text_Dictionary();
        const compressor: Compressor.Instance =
            this.Version().Language().Book().Data().Compressor();
        this.text = new Text.Instance(
            {
                dictionary: dictionary,
                value: compressor.Decompress(
                    {
                        value: text_value || ``,
                        dictionary: dictionary,
                    },
                ),
            },
        );
    }
}
