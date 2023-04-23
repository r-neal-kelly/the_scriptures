import { Count } from "../../../../../types.js";
import { Index } from "../../../../../types.js";
import { Name } from "../../../../../types.js";

import * as Utils from "../../../../../utils.js";

import * as Entity from "../../../../entity.js";
import * as Tree from "./instance.js";
import * as Leaf from "./leaf.js";

export type Data = {
    [name: Name]: Data | Array<Leaf.Data>,
}

export class Instance extends Entity.Instance
{
    private parent: Tree.Instance | Instance;
    private name: Name;
    private branches_or_leaves: Array<Instance> | Array<Leaf.Instance>;
    private has_branches: boolean;

    constructor(
        {
            parent,
            name,
            data,
        }: {
            parent: Tree.Instance | Instance,
            name: Name,
            data: Data | Array<Leaf.Data>,
        },
    )
    {
        super();

        this.parent = parent;
        this.name = name;
        this.branches_or_leaves = [];

        if (Utils.Is.Object(data)) {
            this.has_branches = true;
            for (const [branch_name, branch_data] of Object.entries(data as Data)) {
                (this.branches_or_leaves as Array<Instance>).push(
                    new Instance(
                        {
                            parent: this,
                            name: branch_name,
                            data: branch_data,
                        },
                    ),
                );
            }
        } else {
            this.has_branches = false;
            for (const leaf_data of data as Array<Leaf.Data>) {
                (this.branches_or_leaves as Array<Leaf.Instance>).push(
                    new Leaf.Instance(
                        {
                            parent: this,
                            data: leaf_data,
                        },
                    ),
                );
            }
        }
    }

    Tree():
        Tree.Instance
    {
        let parent: Tree.Instance | Instance = this.Parent();
        while (!(parent instanceof Tree.Instance)) {
            parent = parent.Parent();
        }

        return parent;
    }

    Parent():
        Tree.Instance | Instance
    {
        return this.parent;
    }

    Name():
        Name
    {
        return this.name;
    }

    Is_Empty():
        boolean
    {
        return this.branches_or_leaves.length === 0;
    }

    Has_Branches():
        boolean
    {
        return this.has_branches;
    }

    Branch_Count():
        Count
    {
        Utils.Assert(
            this.Has_Branches(),
            `Doesn't have branches.`,
        );

        return this.branches_or_leaves.length;
    }

    Branch_At(
        branch_index: Index,
    ):
        Instance
    {
        Utils.Assert(
            branch_index > -1,
            `branch_index must be greater than -1.`,
        );
        Utils.Assert(
            branch_index < this.Branch_Count(),
            `branch_index must be less than branch_count.`,
        );

        return this.branches_or_leaves[branch_index] as Instance;
    }

    Has_Leaves():
        boolean
    {
        return !this.Has_Branches();
    }

    Leaf_Count():
        Count
    {
        Utils.Assert(
            this.Has_Leaves(),
            `Doesn't have leaves.`,
        );

        return this.branches_or_leaves.length;
    }

    Leaf_At(
        leaf_index: Index,
    ):
        Leaf.Instance
    {
        Utils.Assert(
            leaf_index > -1,
            `leaf_index must be greater than -1.`,
        );
        Utils.Assert(
            leaf_index < this.Leaf_Count(),
            `leaf_index must be less than leaf_count.`,
        );

        return this.branches_or_leaves[leaf_index] as Leaf.Instance;
    }

    Is_Selected():
        boolean
    {
        return this.Tree().Is_Selected(this);
    }
}
