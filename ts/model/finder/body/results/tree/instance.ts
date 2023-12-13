import * as Entity from "../../../../entity.js";
import * as Results from "../instance.js";
import * as Branch from "./branch.js";
import * as Leaf from "./leaf.js";

export class Instance extends Entity.Instance
{
    private results: Results.Instance;
    private root: Branch.Instance;
    private selected: Array<Branch.Instance | Leaf.Instance>;

    constructor(
        {
            results,
            data,
        }: {
            results: Results.Instance,
            data: Branch.Data,
        },
    )
    {
        super();

        this.results = results;
        this.root = new Branch.Instance(
            {
                parent: this,
                name: ``,
                data: data,
            },
        );
        this.selected = [];
    }

    Results():
        Results.Instance
    {
        return this.results;
    }

    Root():
        Branch.Instance
    {
        return this.root;
    }

    Is_Selected(
        branch_or_leaf: Branch.Instance | Leaf.Instance,
    ):
        boolean
    {
        return this.selected.includes(branch_or_leaf);
    }

    async Select(
        leaf: Leaf.Instance,
    ):
        Promise<void>
    {
        this.selected = [leaf];

        let parent: Instance | Branch.Instance = leaf.Parent();
        while (parent instanceof Branch.Instance) {
            this.selected.push(parent);
            parent = parent.Parent();
        }

        this.Results().Set_Buffer(leaf.Default_Language(), await leaf.File().Text(), leaf.Results());
    }
}
