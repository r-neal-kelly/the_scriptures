import { Name } from "../../../types.js";
import { Path } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Search from "./instance.js";
import * as Uniques from "./uniques.js";
import * as Partition from "./partition.js";

export type Info = {
    names: Array<Name>,
}

export class Instance
{
    static Name():
        Name
    {
        return `Occurrences`;
    }

    private search: Search.Instance;
    private path: Path;
    private info: Info | null;
    private partitions: { [index: Uniques.First_Point]: Partition.Instance };

    constructor(
        {
            search,
        }: {
            search: Search.Instance,
        },
    )
    {
        this.search = search;
        this.path = `${search.Path()}/${Instance.Name()}`;
        this.info = null;
        this.partitions = {};
    }

    Search():
        Search.Instance
    {
        return this.search;
    }

    Name():
        Name
    {
        return Instance.Name();
    }

    Path():
        Path
    {
        return this.path;
    }

    private async Info():
        Promise<Info>
    {
        await this.Download();

        if (this.info != null) {
            return this.info;
        } else {
            return (
                {
                    names: [],
                }
            );
        }
    }

    async Has(
        first_point: Uniques.First_Point,
    ):
        Promise<boolean>
    {
        await this.Download();

        return this.partitions.hasOwnProperty(first_point);
    }

    async Get(
        first_point: Uniques.First_Point,
    ):
        Promise<Partition.Instance>
    {
        await this.Download();

        Utils.Assert(
            await this.Has(first_point),
            `Doesn't have first_point.`,
        );

        return this.partitions[first_point];
    }

    private async Download():
        Promise<void>
    {
        if (this.info == null) {
            const response: Response =
                await fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
            if (response.ok) {
                this.info = JSON.parse(await response.text()) as Info;

                for (const name of this.info.names) {
                    const partition: Partition.Instance = new Partition.Instance(
                        {
                            occurrences: this,
                            name: name,
                        },
                    );
                    const first_point: Uniques.First_Point =
                        String.fromCodePoint(Number.parseInt(partition.Title()));
                    this.partitions[first_point] = partition;
                }
            }
        }
    }
}
