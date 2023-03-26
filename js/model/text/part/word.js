import * as Part from "./instance.js";
import { Type } from "./type.js";
export class Instance extends Part.Instance {
    constructor({ value, status, style, }) {
        super({
            type: Type.WORD,
            value: value,
            status: status,
            style: style,
        });
    }
}
