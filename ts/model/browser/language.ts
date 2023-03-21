import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Languages from "./languages.js";
import * as Versions from "./versions.js";

export class Instance
{
    private languages: Languages.Instance;
    private name: Name;
    private path: Path;
    private versions: Versions.Instance;

    constructor(
        {
            languages,
            name,
        }: {
            languages: Languages.Instance,
            name: Name,
        },
    )
    {
        this.languages = languages;
        this.name = name;
        this.path = `${languages.Path()}/${name}`;
        this.versions = new Versions.Instance(
            {
                language: this,
            },
        );
    }

    Languages():
        Languages.Instance
    {
        return this.languages;
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

    Versions():
        Versions.Instance
    {
        return this.versions;
    }
}
