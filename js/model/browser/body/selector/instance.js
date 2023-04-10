import * as Entity from "../../../entity.js";
import * as Slots from "./slots.js";
export class Instance extends Entity.Instance {
    constructor({ body, selection = null, slot_order, }) {
        super();
        this.body = body;
        this.slots = new Slots.Instance({
            selector: this,
            order: slot_order,
            selection: selection,
        });
        this.Add_Dependencies([
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
