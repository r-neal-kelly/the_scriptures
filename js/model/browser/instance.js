import * as Async from "../../async.js";
import * as Data from "./data.js";
import * as Selector from "./selector.js";
import * as Reader from "./reader.js";
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
        this.reader = new Reader.Instance({
            browser: this,
        });
        this.Is_Ready_After([
            this.data,
            this.selector,
            this.reader,
        ]);
    }
    Data() {
        return this.data;
    }
    Selector() {
        return this.selector;
    }
    Reader() {
        return this.reader;
    }
}
