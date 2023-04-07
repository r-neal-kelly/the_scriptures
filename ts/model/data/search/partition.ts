import { Index } from "../../../types.js";
import { Name } from "../../../types.js";
import { Path } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Uniques from "./uniques.js";
import * as Occurrences from "./occurrences.js";

export type File_Index = Index;
export type Line_Index = Index;
export type Part_Index = Index;

export type Info = {
    [index: Uniques.Part]: {
        [index: File_Index]: {
            [index: Line_Index]: Array<Part_Index>,
        },
    },
}

export class Instance
{
    private occurrences: Occurrences.Instance;
    private name: Name;
    private path: Path;
    private title: Name;
    private extension: Name;

    constructor(
        {
            occurrences,
            name,
        }: {
            occurrences: Occurrences.Instance,
            name: Name,
        },
    )
    {
        this.occurrences = occurrences;
        this.name = name;
        this.path = `${occurrences.Path()}/${name}`;
        this.title = name.replace(/\.[^.]*$/, ``);
        this.extension = name.replace(/^[^.]*\./, ``);
    }

    Occurrences():
        Occurrences.Instance
    {
        return this.occurrences;
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

    async Maybe_JSON():
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
