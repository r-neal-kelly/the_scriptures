import * as Async from "../../async.js";
import * as Data from "./data.js";
import * as Selector from "./selector.js";
export class Instance extends Async.Instance {
    constructor() {
        super();
        this.data = new Data.Instance({
            browser: this,
        });
        this.selector = new Selector.Instance({
            browser: this,
            order: Selector.Order.BOOKS_LANGUAGES_VERSIONS,
        });
        this.Is_Ready_After([
            this.data,
            this.selector,
        ]);
    }
    Data() {
        return this.data;
    }
    Selector() {
        return this.selector;
    }
}
