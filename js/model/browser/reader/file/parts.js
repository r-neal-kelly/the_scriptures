import * as Utils from "../../../../utils.js";
import * as File from "./instance.js";
import * as Part from "./part.js";
export class Instance {
    static Min_Count() {
        return File.Instance.Min_Part_Count();
    }
    constructor({ segment, text, }) {
        this.segment = segment;
        this.parts = [];
        if (text != null) {
            for (let idx = 0, end = text.Part_Count(); idx < end; idx += 1) {
                this.parts.push(new Part.Instance({
                    parts: this,
                    index: idx,
                    text: text.Part(idx),
                }));
            }
        }
    }
    Segment() {
        return this.segment;
    }
    Count() {
        return this.parts.length;
    }
    At(part_index) {
        Utils.Assert(part_index > -1, `part_index (${part_index}) must be greater than -1.`);
        if (part_index < this.Count()) {
            return this.parts[part_index];
        }
        else {
            return Instance.blank_part;
        }
    }
}
Instance.blank_part = new Part.Instance({
    parts: null,
    index: null,
    text: null,
});
