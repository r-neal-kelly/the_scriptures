import * as Part from "./instance.js";
import { Type } from "./type.js";
export class Instance extends Part.Instance {
    constructor({ value, status, style, }) {
        super({
            part_type: Type.BREAK,
            value: value,
            status: status,
            style: style,
        });
    }
}