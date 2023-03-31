import * as Async from "../../../async.js";
export class Instance extends Async.Instance {
    constructor({ selector, is_open, }) {
        super();
        this.selector = selector;
        this.is_open = is_open;
    }
    Selector() {
        return this.selector;
    }
    Is_Open() {
        return this.is_open;
    }
    Is_Closed() {
        return !this.Is_Open();
    }
    Open() {
        this.is_open = true;
    }
    Close() {
        this.is_open = false;
    }
    Toggle() {
        if (this.Is_Open()) {
            this.Close();
        }
        else {
            this.Open();
        }
    }
}
