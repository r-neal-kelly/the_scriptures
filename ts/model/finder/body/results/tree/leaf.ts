import { Name } from "../../../../../types.js";

import * as Language from "../../../../language.js";
import * as Entity from "../../../../entity.js";
import * as File from "../../../../data/file.js";
import * as Search from "../../../../search.js";
import * as Tree from "./instance.js";
import * as Branch from "./branch.js";

export type Data = {
    file: File.Instance,
    results: Array<Search.Result.Instance>,
}

export class Instance extends Entity.Instance
{
    private parent: Branch.Instance;
    private data: Data;

    constructor(
        {
            parent,
            data,
        }: {
            parent: Branch.Instance,
            data: Data,
        },
    )
    {
        super();

        this.parent = parent;
        this.data = data;

        this.Add_Dependencies(
            [
                this.data.file,
            ],
        );
    }

    Tree():
        Tree.Instance
    {
        return this.Parent().Tree();
    }

    Parent():
        Branch.Instance
    {
        return this.parent;
    }

    File():
        File.Instance
    {
        return this.data.file;
    }

    Name():
        Name
    {
        return this.data.file.Title();
    }

    Default_Language():
        Language.Name
    {
        return this.File().Default_Language_Name();
    }

    Results():
        Array<Search.Result.Instance>
    {
        return this.data.results;
    }

    Is_Selected():
        boolean
    {
        return this.Tree().Is_Selected(this);
    }

    async Select():
        Promise<void>
    {
        await this.Tree().Select(this);
    }
}
