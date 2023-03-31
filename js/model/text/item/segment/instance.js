import * as Utils from "../../../../utils.js";
import * as Item from "../instance.js";
import { Type as Item_Type } from "../type.js";
import { Type } from "./type.js";
export class Instance extends Item.Instance {
    constructor({ segment_type, }) {
        super({
            item_type: Item_Type.SEGMENT,
        });
        this.segment_type = segment_type;
        this.items = [];
    }
    Segment_Type() {
        return this.segment_type;
    }
    Item_Count() {
        return this.items.length;
    }
    Has_Item(item) {
        return this.items.indexOf(item) > -1;
    }
    Has_Item_Index(item_index) {
        return (item_index > -1 &&
            item_index < this.items.length);
    }
    Item(item_index) {
        Utils.Assert(this.Has_Item_Index(item_index), `Does not have an item at index ${item_index}.`);
        return this.items[item_index];
    }
    Item_Index(item) {
        const index = this.items.indexOf(item);
        Utils.Assert(index > -1, `Does not have item.`);
        return index;
    }
    Items() {
        return Array.from(this.items);
    }
    Try_Add_Item(item) {
        const segment_type = this.Segment_Type();
        if (segment_type === Type.MICRO) {
            Utils.Assert(item.Is_Part() &&
                (item.Is_Point() ||
                    item.Is_Letter() ||
                    item.Is_Marker() ||
                    item.Is_Command()), `Can only add micro parts to a micro segment.`);
            if (this.items.length === 0) {
                this.items.push(item);
                return true;
            }
            else {
                const part = item;
                const previous_part = this.items[this.items.length - 1];
                if (part.Is_Point()) {
                    if (previous_part.Is_Point()) {
                        this.items.push(part);
                        return true;
                    }
                    else if (previous_part.Is_Letter()) {
                        return false;
                    }
                    else if (previous_part.Is_Marker()) {
                        if (/\S+/.test(previous_part.Value())) {
                            this.items.push(part);
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else if (previous_part.Is_Command()) {
                        if (previous_part.Is_Opening()) {
                            this.items.push(part);
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        Utils.Assert(false, `Invalid previous_part_type.`);
                        return false;
                    }
                }
                else if (part.Is_Letter()) {
                    if (previous_part.Is_Point()) {
                        return false;
                    }
                    else if (previous_part.Is_Letter()) {
                        this.items.push(part);
                        return true;
                    }
                    else if (previous_part.Is_Marker()) {
                        if (/\S+/.test(previous_part.Value())) {
                            this.items.push(part);
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else if (previous_part.Is_Command()) {
                        if (previous_part.Is_Opening()) {
                            this.items.push(part);
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        Utils.Assert(false, `Invalid previous_part_type.`);
                        return false;
                    }
                }
                else if (part.Is_Marker()) {
                    if (previous_part.Is_Point()) {
                        this.items.push(part);
                        return true;
                    }
                    else if (previous_part.Is_Letter()) {
                        this.items.push(part);
                        return true;
                    }
                    else if (previous_part.Is_Marker()) {
                        if (/\S+/.test(previous_part.Value())) {
                            this.items.push(part);
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else if (previous_part.Is_Command()) {
                        this.items.push(part);
                        return true;
                    }
                    else {
                        Utils.Assert(false, `Invalid previous_part_type.`);
                        return false;
                    }
                }
                else if (part.Is_Command()) {
                    if (previous_part.Is_Point()) {
                        if (part.Is_Closing()) {
                            this.items.push(part);
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else if (previous_part.Is_Letter()) {
                        if (part.Is_Closing()) {
                            this.items.push(part);
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else if (previous_part.Is_Marker()) {
                        if (part.Is_Closing()) {
                            this.items.push(part);
                            return true;
                        }
                        else {
                            if (/\S+/.test(previous_part.Value())) {
                                this.items.push(part);
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    }
                    else if (previous_part.Is_Command()) {
                        this.items.push(part);
                        return true;
                    }
                    else {
                        Utils.Assert(false, `Invalid previous_part_type.`);
                        return false;
                    }
                }
                else {
                    Utils.Assert(false, `Invalid part_type.`);
                    return false;
                }
            }
        }
        else if (segment_type === Type.MACRO) {
            Utils.Assert((item.Is_Part() &&
                (item.Is_Point() ||
                    item.Is_Word() ||
                    item.Is_Command())) ||
                item.Is_Split(), `Can only add macro parts to a macro segment.`);
            if (this.items.length === 0) {
                this.items.push(item);
                return true;
            }
            else {
                const previous_item = this.items[this.items.length - 1];
                if (item.Is_Part()) {
                    const part = item;
                    if (part.Is_Point()) {
                        if (previous_item.Is_Part()) {
                            const previous_part = previous_item;
                            if (previous_part.Is_Point()) {
                                this.items.push(part);
                                return true;
                            }
                            else if (previous_part.Is_Word()) {
                                return false;
                            }
                            else if (previous_part.Is_Command()) {
                                if (previous_part.Is_Opening()) {
                                    this.items.push(part);
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                            else {
                                Utils.Assert(false, `Invalid previous_part_type.`);
                                return false;
                            }
                        }
                        else if (previous_item.Is_Split()) {
                            const previous_split = previous_item;
                            if (/\S+/.test(previous_split.Value())) {
                                this.items.push(part);
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            Utils.Assert(false, `Invalid previous_item_type.`);
                            return false;
                        }
                    }
                    else if (part.Is_Word()) {
                        if (previous_item.Is_Part()) {
                            const previous_part = previous_item;
                            if (previous_part.Is_Point()) {
                                return false;
                            }
                            else if (previous_part.Is_Word()) {
                                return false;
                            }
                            else if (previous_part.Is_Command()) {
                                if (previous_part.Is_Opening()) {
                                    this.items.push(part);
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                            else {
                                Utils.Assert(false, `Invalid previous_part_type.`);
                                return false;
                            }
                        }
                        else if (previous_item.Is_Split()) {
                            const previous_split = previous_item;
                            if (/\S+/.test(previous_split.Value())) {
                                this.items.push(part);
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            Utils.Assert(false, `Invalid previous_item_type.`);
                            return false;
                        }
                    }
                    else if (part.Is_Command()) {
                        if (previous_item.Is_Part()) {
                            const previous_part = previous_item;
                            if (previous_part.Is_Point()) {
                                if (part.Is_Closing()) {
                                    this.items.push(part);
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                            else if (previous_part.Is_Word()) {
                                if (part.Is_Closing()) {
                                    this.items.push(part);
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                            else if (previous_part.Is_Command()) {
                                this.items.push(part);
                                return true;
                            }
                            else {
                                Utils.Assert(false, `Invalid previous_part_type.`);
                                return false;
                            }
                        }
                        else if (previous_item.Is_Split()) {
                            const previous_split = previous_item;
                            if (part.Is_Closing()) {
                                this.items.push(part);
                                return true;
                            }
                            else {
                                if (/\S+/.test(previous_split.Value())) {
                                    this.items.push(part);
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                        }
                        else {
                            Utils.Assert(false, `Invalid previous_item_type.`);
                            return false;
                        }
                    }
                    else {
                        Utils.Assert(false, `Invalid part_type.`);
                        return false;
                    }
                }
                else if (item.Is_Split()) {
                    const split = item;
                    if (previous_item.Is_Part()) {
                        const previous_part = previous_item;
                        if (previous_part.Is_Point()) {
                            this.items.push(split);
                            return true;
                        }
                        else if (previous_part.Is_Word()) {
                            this.items.push(split);
                            return true;
                        }
                        else if (previous_part.Is_Command()) {
                            this.items.push(split);
                            return true;
                        }
                        else {
                            Utils.Assert(false, `Invalid previous_part_type.`);
                            return false;
                        }
                    }
                    else if (previous_item.Is_Split()) {
                        const previous_split = previous_item;
                        if (/\S+/.test(previous_split.Value())) {
                            this.items.push(split);
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        Utils.Assert(false, `Invalid previous_item_type.`);
                        return false;
                    }
                }
                else {
                    Utils.Assert(false, `Unknown item_type.`);
                    return false;
                }
            }
        }
        else {
            Utils.Assert(false, `Unknown segment_type.`);
            return false;
        }
    }
    Add_Item(item) {
        const result = this.Try_Add_Item(item);
        Utils.Assert(result === true, `Failed to add item.`);
    }
    Value() {
        let value = ``;
        for (const item of this.items) {
            value += item.Value();
        }
        return value;
    }
}
