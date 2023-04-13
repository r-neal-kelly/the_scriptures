import * as Node from "./node.js";
import * as Match from "./match.js";

export enum Mode
{
    DEFAULT = 0,
    SEQUENCE = 1 << 0,
    FUZZY = 1 << 1,
}

export class Instance
{
    // We could cache matches by expression + given data (which is from the singleton).

    constructor()
    {
    }

    Execute(
        node: Node.Instance,
        matches: Array<Match.Instance> = [],
        mode: Mode = Mode.DEFAULT,
    ):
        Array<Match.Instance>
    {
        return matches;
    }
}
