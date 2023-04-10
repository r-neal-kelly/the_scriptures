import * as Utils from "../../../../../utils.js";
import * as Entity from "../../../../entity.js";
import { Type } from "./type.js";
export class Instance extends Entity.Instance {
    constructor({ slot, type, }) {
        super();
        this.slot = slot;
        if (type === Type.BOOKS) {
            this.value = `Books`;
        }
        else if (type === Type.LANGUAGES) {
            this.value = `Languages`;
        }
        else if (type === Type.VERSIONS) {
            this.value = `Versions`;
        }
        else if (type === Type.FILES) {
            this.value = `Files`;
        }
        else {
            Utils.Assert(false, `Invalid type.`);
            this.value = ``;
        }
        this.Add_Dependencies([]);
    }
    Slot() {
        return this.slot;
    }
    Value() {
        return this.value;
    }
}
