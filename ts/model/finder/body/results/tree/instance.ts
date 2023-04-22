import * as Utils from "../../../../../utils.js";

import * as Entity from "../../../../entity.js";
import * as Data from "../../../../data.js";
import * as Search from "../../../../search.js";
import * as Filter from "../../../../selector.js";
import * as Results from "../instance.js";
import * as Branch from "./branch.js";
import * as Leaf from "./leaf.js";

export class Instance extends Entity.Instance
{
    private results: Results.Instance;
    private branches_or_leaves: Array<Branch.Instance> | Array<Leaf.Instance>;

    constructor(
        {
            results,
        }: {
            results: Results.Instance,
        },
    )
    {
        super();

        this.results = results;
        this.branches_or_leaves = [];

        this.Add_Dependencies(
            [
                Data.Singleton(),
                Search.Singleton(),
            ],
        );
    }

    Results():
        Results.Instance
    {
        return this.results;
    }

    Filter():
        Filter.Instance
    {
        return this.Results().Body().Filter();
    }
}
