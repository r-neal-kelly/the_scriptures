import * as Entity from "../../entity.js";
import * as Selector from "./selector.js";
import * as Reader from "./reader.js";
export class Instance extends Entity.Instance {
    constructor({ browser, selection = null, selector_slot_order, }) {
        super();
        this.browser = browser;
        this.selector = new Selector.Instance({
            body: this,
            slot_order: selector_slot_order,
            selection: selection,
        });
        this.reader = new Reader.Instance({
            body: this,
        });
        this.Add_Dependencies([
            this.selector,
            this.reader,
        ]);
    }
    Browser() {
        return this.browser;
    }
    Selector() {
        return this.selector;
    }
    Reader() {
        return this.reader;
    }
}
