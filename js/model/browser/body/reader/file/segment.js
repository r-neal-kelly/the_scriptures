import * as Utils from "../../../../../utils.js";
import * as Entity from "../../../../entity.js";
import * as Item from "./item.js";
export class Instance extends Entity.Instance {
    static Min_Item_Count() {
        return Instance.min_item_count;
    }
    static Set_Min_Item_Count(min_item_count) {
        Utils.Assert(min_item_count >= 0, `min_item_count must be greater than or equal to 0.`);
        Instance.min_item_count = min_item_count;
    }
    constructor({ line, index, text, }) {
        super();
        this.line = line;
        this.index = index;
        this.text = text;
        this.items = [];
        if (text == null) {
            Utils.Assert(line == null, `line must be null.`);
            Utils.Assert(index == null, `index must be null.`);
        }
        else {
            Utils.Assert(line != null, `line must not be null.`);
            Utils.Assert(index != null && index > -1, `index must not be null, and must be greater than -1.`);
            for (let idx = 0, end = text.Item_Count(); idx < end; idx += 1) {
                this.items.push(new Item.Instance({
                    segment: this,
                    index: idx,
                    text: text.Item(idx),
                }));
            }
        }
        this.Add_Dependencies(this.items);
    }
    Line() {
        Utils.Assert(this.line != null, `Doesn't have line.`);
        return this.line;
    }
    Index() {
        Utils.Assert(this.index != null, `Doesn't have an index.`);
        return this.index;
    }
    Text() {
        Utils.Assert(this.text != null, `Doesn't have text.`);
        return this.text;
    }
    Item_Count() {
        return this.items.length;
    }
    Item_At(item_index) {
        Utils.Assert(item_index > -1, `item_index (${item_index}) must be greater than -1.`);
        if (item_index < this.Item_Count()) {
            return this.items[item_index];
        }
        else {
            return Instance.blank_item;
        }
    }
    Is_Blank() {
        return this.text == null;
    }
}
Instance.min_item_count = 2;
Instance.blank_item = new Item.Instance({
    segment: null,
    index: null,
    text: null,
});
