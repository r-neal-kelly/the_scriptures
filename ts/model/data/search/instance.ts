import { Name } from "../../../types.js";
import { Path } from "../../../types.js";

import * as Unicode from "../../../unicode.js";

import * as Version from "../version.js";
import * as Uniques from "./uniques.js";
import * as Occurrences from "./occurrences.js";
import * as Partition from "./partition.js";

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

    async Maybe_Partition(
        first_point: Uniques.First_Point,
    ):
        Promise<Partition.Instance | null>
    {
        const uniques: Uniques.Instance = this.Uniques();
        if (await uniques.Has(first_point)) {
            const occurrences: Occurrences.Instance = this.Occurrences();
            if (await occurrences.Has(first_point)) {
                return await occurrences.Get(first_point);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    async Maybe_Partition_Parts(
        first_point: Uniques.First_Point,
    ):
        Promise<Partition.Parts | null>
    {
        const partition: Partition.Instance | null =
            await this.Maybe_Partition(first_point);
        if (partition) {
            return await partition.Maybe_Parts();
        } else {
            return null;
        }
    }

    async Maybe_Partition_Part(
        part: Uniques.Part,
    ):
        Promise<Partition.Part | null>
    {
        const partition: Partition.Instance | null =
            await this.Maybe_Partition(Unicode.First_Point(part));
        if (partition) {
            return await partition.Maybe_Part(part);
        } else {
            return null;
        }
    }
}
