import { ID } from "../types.js";

import * as Async from "../async.js";
import * as Unique_ID from "../unique_id.js";

// Maybe we should combine async and this type together.
export abstract class Instance extends Async.Instance
{
    private id: ID;

    constructor()
    {
        super();

        this.id = Unique_ID.New();
    }

    ID():
        ID
    {
        return this.id;
    }
}
