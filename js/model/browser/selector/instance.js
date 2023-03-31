import * as Async from "../../../async.js";
import * as Toggle from "./toggle.js";
import * as Slots from "./slots.js";
export class Instance extends Async.Instance {
    constructor({ browser, is_open, slot_order, }) {
        super();
        this.browser = browser;
        this.toggle = new Toggle.Instance({
            selector: this,
            is_open: is_open,
        });
        this.slots = new Slots.Instance({
            selector: this,
            order: slot_order,
        });
        this.Is_Ready_After([
            this.toggle,
            this.slots,
        ]);
    }
    Browser() {
        return this.browser;
    }
    Toggle() {
        return this.toggle;
    }
    Slots() {
        return this.slots;
    }
}
