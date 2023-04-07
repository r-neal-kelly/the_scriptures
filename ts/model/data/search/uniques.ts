import { Name } from "../../../types.js";
import { Path } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Search from "./instance.js";

export type First_Point = string;
export type Part = string;

export type Info = {
    [index: First_Point]: Array<Part>,
}

export class Instance
{
    static Name():
        Name
    {
        return `Uniques.json`;
    }

    private search: Search.Instance;
    private path: Path;
    private info: Info | null;

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
            return {};
        }
    }

    private async Download():
        Promise<void>
    {
        if (this.info == null) {
            const response: Response =
                await fetch(Utils.Resolve_Path(this.Path()));
            if (response.ok) {
                this.info = JSON.parse(await response.text()) as Info;
            }
        }
    }
}
