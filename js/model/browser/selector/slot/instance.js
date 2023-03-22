import * as Utils from "../../../../utils.js";
import * as Item from "./item.js";
export class Instance {
    constructor({ selector, type, item_names, }) {
        this.selector = selector;
        this.type = type;
        this.items = [];
        this.selected_item = null;
        for (let idx = 0, end = item_names.length; idx < end; idx += 1) {
            this.items.push(new Item.Instance({
                slot: this,
                index: idx,
                name: item_names[idx],
            }));
        }
    }
    Selector() {
        return this.selector;
    }
    Type() {
        return this.type;
    }
    Items() {
        return Array.from(this.items);
    }
    Item_Count() {
        return this.items.length;
    }
    Item_At(item_index) {
        Utils.Assert(item_index > -1, `item_index must be greater than -1.`);
        Utils.Assert(item_index < this.Item_Count(), `item_index must be less than item_count.`);
        return this.items[item_index];
    }
    Has_Selected_Item() {
        return this.selected_item != null;
    }
    Selected_Item() {
        return this.selected_item;
    }
    Select_Item(item_index) {
        this.selected_item = this.Item_At(item_index);
    }
}
