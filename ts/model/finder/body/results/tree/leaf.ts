import { Name } from "../../../../../types.js";

import * as Entity from "../../../../entity.js";
import * as Search from "../../../../search.js";
import * as Tree from "./instance.js";
import * as Branch from "./branch.js";

export type Data = {
    name: Name,
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

    Name():
        Name
    {
        return this.data.name;
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

    Select():
        void
    {
        this.Tree().Select(this);
    }
}
