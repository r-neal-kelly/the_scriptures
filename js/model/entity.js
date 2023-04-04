import * as Async from "../async.js";
import * as Unique_ID from "../unique_id.js";
// Maybe we should combine async and this type together.
export class Instance extends Async.Instance {
    constructor() {
        super();
        this.id = Unique_ID.New();
    }
    ID() {
        return this.id;
    }
}
