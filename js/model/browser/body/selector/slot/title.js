import * as Utils from "../../../../../utils.js";
import { Type } from "./type.js";
export class Instance {
    constructor({ slot, type, }) {
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
    }
    Slot() {
        return this.slot;
    }
    Value() {
        return this.value;
    }
}
