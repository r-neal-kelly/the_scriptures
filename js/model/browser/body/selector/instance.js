import * as Async from "../../../../async.js";
import * as Slots from "./slots.js";
export class Instance extends Async.Instance {
    constructor({ body, selection = null, slot_order, }) {
        super();
        this.body = body;
        this.slots = new Slots.Instance({
            selector: this,
            order: slot_order,
            selection: selection,
        });
        this.Is_Ready_After([
            this.slots,
        ]);
    }
    Body() {
        return this.body;
    }
    Slots() {
        return this.slots;
    }
}
