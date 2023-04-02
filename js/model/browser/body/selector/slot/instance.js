import * as Title from "./title.js";
import * as Items from "./items.js";
export class Instance {
    constructor({ slots, index, type, item_names, item_files, }) {
        this.slots = slots;
        this.index = index;
        this.type = type;
        this.title = new Title.Instance({
            slot: this,
            type: type,
        });
        this.items = new Items.Instance({
            slot: this,
            item_names: item_names,
            item_files: item_files,
        });
    }
    Slots() {
        return this.slots;
    }
    Index() {
        return this.index;
    }
    Type() {
        return this.type;
    }
    Title() {
        return this.title;
    }
    Items() {
        return this.items;
    }
}
