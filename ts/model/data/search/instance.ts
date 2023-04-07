import { Name } from "../../../types.js";
import { Path } from "../../../types.js";

import * as Version from "../version.js";
import * as Uniques from "./uniques.js";
import * as Occurrences from "./occurrences.js";

export type Info = {
}

export class Instance
{
    private version: Version.Instance;
    private name: Name;
    private path: Path;
    private uniques: Uniques.Instance;
    private occurrences: Occurrences.Instance;

    constructor(
        {
            version,
        }: {
            version: Version.Instance,
        },
    )
    {
        this.version = version;
        this.name = `Search`;
        this.path = `${version.Path()}/${this.name}`;
        this.uniques = new Uniques.Instance(
            {
                search: this,
            },
        );
        this.occurrences = new Occurrences.Instance(
            {
                search: this,
            },
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

    Path():
        Path
    {
        return this.path;
    }

    Uniques():
        Uniques.Instance
    {
        return this.uniques;
    }

    Occurrences():
        Occurrences.Instance
    {
        return this.occurrences;
    }
}
