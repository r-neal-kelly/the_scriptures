import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Version from "./version.js";

export type Leaf = {
    name: Name,
};

export class Instance
{
    private version: Version.Instance;
    private name: Name;
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

    async Maybe_Text():
        Promise<string | null>
    {
        const response: Response =
            await fetch(Utils.Resolve_Path(this.Path()));
        if (response.ok) {
            return await response.text();
        } else {
            return null;
        }
    }
}
