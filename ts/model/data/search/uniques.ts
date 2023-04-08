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
    private is_downloading: boolean;

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
        this.is_downloading = false;
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

    async Info():
        Promise<Info>
    {
        await this.Download();

        if (this.info != null) {
            return this.info;
        } else {
            return {};
        }
    }

    async Has(
        first_point: First_Point,
    ):
        Promise<boolean>
    {
        return (await this.Info()).hasOwnProperty(first_point);
    }

    async Get(
        first_point: First_Point,
    ):
        Promise<Array<Part>>
    {
        Utils.Assert(
            await this.Has(first_point),
            `Doesn't have first_point.`,
        );

        return (await this.Info())[first_point];
    }

    private async Download():
        Promise<void>
    {
        while (this.is_downloading) {
            await Utils.Wait_Milliseconds(1);
        }
        this.is_downloading = true;

        if (this.info == null) {
            const response: Response =
                await fetch(Utils.Resolve_Path(this.Path()));
            if (response.ok) {
                this.info = JSON.parse(await response.text()) as Info;
                for (const key of Object.keys(this.info)) {
                    Object.freeze(this.info[key]);
                }
                Object.freeze(this.info);
            }
        }

        this.is_downloading = false;
    }
}
