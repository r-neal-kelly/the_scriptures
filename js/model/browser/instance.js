import * as Async from "../../async.js";
import * as Data from "../data.js";
import * as Selection from "./selection.js";
import * as Commander from "./commander.js";
import * as Body from "./body.js";
export class Instance extends Async.Instance {
    constructor({ selection = new Selection.Name({
        book: `Jubilees`,
        language: `English`,
        version: `R. H. Charles`,
        file: `Chapter 01.txt`,
    }), selector_slot_order = Body.Selector.Slot.Order.BOOKS_LANGUAGES_VERSIONS, is_selector_open = false, } = {}) {
        super();
        this.data = new Data.Instance();
        this.commander = new Commander.Instance({
            browser: this,
            is_selector_open: is_selector_open,
        });
        this.body = new Body.Instance({
            browser: this,
            selection: selection,
            selector_slot_order: selector_slot_order,
        });
        this.Is_Ready_After([
            this.data,
            this.commander,
            this.body,
        ]);
    }
    Data() {
        return this.data;
    }
    Commander() {
        return this.commander;
    }
    Body() {
        return this.body;
    }
    Title() {
        const slots_as_string = this.Body().Selector().Slots().As_String();
        if (slots_as_string != null) {
            return slots_as_string;
        }
        else {
            return `Browser`;
        }
    }
}
