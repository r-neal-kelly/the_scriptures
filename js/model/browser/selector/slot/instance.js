var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "../../../../utils.js";
import * as Item from "./item.js";
export class Instance {
    constructor({ selector, index, type, item_names, }) {
        this.selector = selector;
        this.index = index;
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
    Index() {
        return this.index;
    }
    Type() {
        return this.type;
    }
    Has_Item(item) {
        return this.items.includes(item);
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
    Select_Item_Internally(item) {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(this.Has_Item(item), `The item does not belong to this slot.`);
            this.selected_item = item;
            yield this.Selector().Select_Item_Internally({
                slot: this,
                item: item,
            });
        });
    }
}
