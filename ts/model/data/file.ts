import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Files from "./files.js";

export class Instance
{
    private files: Files.Instance;
    private name: Name;
    private path: Path;
    private title: Name;
    private extension: Name;

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
        this.title = name.replace(/\.[^.]*$/, ``);
        this.extension = name.replace(/^[^.]*\./, ``);
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
