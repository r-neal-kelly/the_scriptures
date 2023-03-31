import * as Utils from "../../../../utils.js";
import * as File from "./instance.js";
import * as Item from "./item.js";
export class Instance {
    static Min_Item_Count() {
        return File.Instance.Min_Item_Count();
    }
    constructor({ file, index, text, }) {
        this.file = file;
        this.index = index;
        this.text = text;
        this.items = [];
        if (text == null) {
            Utils.Assert(file == null, `file must be null.`);
            Utils.Assert(index == null, `index must be null.`);
        }
        else {
            Utils.Assert(file != null, `file must not be null.`);
            Utils.Assert(index != null && index > -1, `index must not be null, and must be greater than -1.`);
            for (let idx = 0, end = text.Macro_Item_Count(); idx < end; idx += 1) {
                this.items.push(new Item.Instance({
                    line: this,
                    index: idx,
                    text: text.Macro_Item(idx),
                }));
            }
        }
    }
    Is_Blank() {
        return this.text == null;
    }
    File() {
        Utils.Assert(this.file != null, `Doesn't have file.`);
        return this.file;
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
}
Instance.blank_item = new Item.Instance({
    line: null,
    index: null,
    text: null,
});
