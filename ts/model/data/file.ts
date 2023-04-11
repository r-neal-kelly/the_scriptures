import { Index } from "../../types.js";
import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Text from "../text.js";
import * as Version from "./version.js";

export type Leaf = {
    name: Name,
    index: Index,
};

export class Instance
{
    private version: Version.Instance;
    private name: Name;
    private index: Index;
    private path: Path;
    private title: Name;
    private extension: Name;

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
        this.version = version;
        this.name = leaf.name;
        this.index = leaf.index;
        this.path = `${version.Path()}/${leaf.name}`;
        this.title = leaf.name.replace(/\.[^.]*$/, ``);
        this.extension = leaf.name.replace(/^[^.]*\./, ``);
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
        return (await this.Version().Text()).Text_File_At(this.Index());
    }
}
