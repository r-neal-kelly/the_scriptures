import * as Part from "./instance.js";
import { Type } from "./type.js";
import { Status } from "./status.js";
export class Instance extends Part.Instance {
    constructor({ value, style, }) {
        super({
            part_type: Type.LETTER,
            value: value,
            status: Status.GOOD,
            style: style,
        });
    }
}
