import * as Entity from "../../../../entity.js";
import * as Tree from "./instance.js";
import * as Leaf from "./leaf.js"

export class Instance extends Entity.Instance
{
    private parent: Tree.Instance | Instance;
    private branches_or_leaves: Array<Instance> | Array<Leaf.Instance>;

    constructor(
        {
            parent,
        }: {
            parent: Tree.Instance | Instance,
        },
    )
    {
        super();

        this.parent = parent;
        this.branches_or_leaves = [];
    }

    Parent():
        Tree.Instance | Instance
    {
        return this.parent;
    }
}
