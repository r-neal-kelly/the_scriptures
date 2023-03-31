import * as Utils from "../../../utils.js";
import { Type } from "./type.js";
export class Instance {
    constructor({ item_type, }) {
        this.item_type = item_type;
    }
    Item_Type() {
        return this.item_type;
    }
    Is_Part() {
        return this.item_type === Type.PART;
    }
    Is_Split() {
        return this.item_type === Type.SPLIT;
    }
    Value() {
        Utils.Assert(false, `This method must be overridden to be used.`);
        return ``;
    }
}
