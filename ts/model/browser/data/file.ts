import { Name } from "../../../types.js";
import { Path } from "../../../types.js";

import * as Files from "./files.js";

export class Instance
{
    private files: Files.Instance;
    private name: Name;
    private path: Path;

    constructor(
        {
            files,
            name,
        }: {
            files: Files.Instance,
            name: Name,
        },
    )
    {
        this.files = files;
        this.name = name;
        this.path = `${files.Path()}/${name}`;
    }

    Files():
        Files.Instance
    {
        return this.files;
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
}
