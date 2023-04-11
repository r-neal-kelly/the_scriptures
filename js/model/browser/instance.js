import * as Entity from "../entity.js";
import * as Commander from "./commander.js";
import * as Body from "./body.js";
export class Instance extends Entity.Instance {
    constructor({ selection = null, selector_slot_order = Body.Selector.Slot.Order.BOOKS_LANGUAGES_VERSIONS, is_selector_open = false, } = {}) {
        super();
        this.commander = new Commander.Instance({
            browser: this,
            is_selector_open: is_selector_open,
        });
        this.body = new Body.Instance({
            browser: this,
            selection: selection,
            selector_slot_order: selector_slot_order,
        });
        this.Add_Dependencies([
            this.commander,
            this.body,
        ]);
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
    Short_Title() {
        const slots_as_short_string = this.Body().Selector().Slots().As_Short_String();
        if (slots_as_short_string != null) {
            return slots_as_short_string;
        }
        else {
            return `Browser`;
        }
    }
}
