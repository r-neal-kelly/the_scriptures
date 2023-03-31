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
    constructor({ slot, item_names, item_files, }) {
        this.slot = slot;
        this.items = [];
        this.selected = null;
        for (let idx = 0, end = item_names.length; idx < end; idx += 1) {
            this.items.push(new Item.Instance({
                items: this,
                index: idx,
                name: item_names[idx],
                file: item_files != null ?
                    item_files[idx] :
                    null,
            }));
        }
    }
    Slot() {
        return this.slot;
    }
    Has(item) {
        return this.items.includes(item);
    }
    Count() {
        return this.items.length;
    }
    At(item_index) {
        Utils.Assert(item_index > -1, `item_index must be greater than -1.`);
        Utils.Assert(item_index < this.Count(), `item_index must be less than item_count.`);
        return this.items[item_index];
    }
    Array() {
        return Array.from(this.items);
    }
    Has_Selected() {
        return this.selected != null;
    }
    Selected() {
        Utils.Assert(this.Has_Selected(), `Has no selected item.`);
        return this.selected;
    }
    Select(item) {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(this.Has(item), `The item does not belong to this slot.`);
            this.selected = item;
            yield this.Slot().Slots().Select_Item_Internally({
                slot: this.Slot(),
                item: item,
            });
        });
    }
}
