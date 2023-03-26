import * as Part from "./instance.js";
import { Type } from "./type.js";
import { Status } from "./status.js";
export class Instance extends Part.Instance {
    constructor({ value, style, }) {
        super({
            type: Type.MARKER,
            value: value,
            status: Status.GOOD,
            style: style,
        });
    }
}
