import * as Entity from "../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ browser, is_selector_open, }) {
        super();
        this.browser = browser;
        this.is_selector_open = is_selector_open;
        this.Is_Ready_After([]);
    }
    Browser() {
        return this.browser;
    }
    Is_Selector_Open() {
        return this.is_selector_open;
    }
    Is_Selector_Closed() {
        return !this.Is_Selector_Open();
    }
    Open_Selector() {
        this.is_selector_open = true;
    }
    Close_Selector() {
        this.is_selector_open = false;
    }
    Toggle_Selector() {
        if (this.Is_Selector_Open()) {
            this.Close_Selector();
        }
        else {
            this.Open_Selector();
        }
    }
}
