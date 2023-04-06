import * as Entity from "../../entity.js";
import * as Previous from "./previous.js";
import * as Selector from "./selector.js";
import * as Next from "./next.js";
export class Instance extends Entity.Instance {
    constructor({ browser, is_selector_open, }) {
        super();
        this.browser = browser;
        this.previous = new Previous.Instance({
            commander: this,
        });
        this.selector = new Selector.Instance({
            commander: this,
            is_activated: is_selector_open,
        });
        this.next = new Next.Instance({
            commander: this,
        });
        this.Is_Ready_After([
            this.previous,
            this.selector,
            this.next,
        ]);
    }
    Browser() {
        return this.browser;
    }
    Previous() {
        return this.previous;
    }
    Selector() {
        return this.selector;
    }
    Next() {
        return this.next;
    }
}
