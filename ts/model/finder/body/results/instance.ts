import * as Entity from "../../../entity.js";
import * as Body from "../instance.js";
import * as Tree from "./tree.js";
import * as Buffer from "../../../buffer/search.js";

export class Instance extends Entity.Instance
{
    private body: Body.Instance;
    private tree: Tree.Instance;
    private buffer: Buffer.Instance;

    constructor(
        {
            body,
        }: {
            body: Body.Instance,
        },
    )
    {
        super();

        this.body = body;
        this.tree = new Tree.Instance(
            {
                results: this,
            },
        );
        this.buffer = new Buffer.Instance(
            {
                results: [],
                is_showing_command: false,
            },
        );

        this.Add_Dependencies(
            [
                this.tree,
                this.buffer,
            ],
        );
    }

    Body():
        Body.Instance
    {
        return this.body;
    }

    Tree():
        Tree.Instance
    {
        return this.tree;
    }

    Buffer():
        Buffer.Instance
    {
        return this.buffer;
    }
}
