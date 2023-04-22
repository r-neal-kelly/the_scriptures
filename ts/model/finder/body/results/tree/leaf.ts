import * as Entity from "../../../../entity.js";
import * as Tree from "./instance.js";
import * as Branch from "./branch.js"

export class Instance extends Entity.Instance
{
    private parent: Tree.Instance | Branch.Instance;

    constructor(
        {
            parent,
        }: {
            parent: Tree.Instance | Branch.Instance,
        },
    )
    {
        super();

        this.parent = parent;
    }

    Parent():
        Tree.Instance | Branch.Instance
    {
        return this.parent;
    }
}
