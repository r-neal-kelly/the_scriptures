import { Name } from "../../../types.js";
import { Path } from "../../../types.js";

import * as Versions from "./versions.js";
import * as Files from "./files.js";

export class Instance
{
    private versions: Versions.Instance;
    private name: Name;
    private path: Path;
    private files: Files.Instance;

    constructor(
        {
            versions,
            name,
        }: {
            versions: Versions.Instance,
            name: Name,
        },
    )
    {
        this.versions = versions;
        this.name = name;
        this.path = `${versions.Path()}/${name}`;
        this.files = new Files.Instance(
            {
                version: this,
            },
        );
    }

    Versions():
        Versions.Instance
    {
        return this.versions;
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

    Files():
        Files.Instance
    {
        return this.files;
    }
}
