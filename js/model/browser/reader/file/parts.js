import * as Utils from "../../../../utils.js";
import * as Part from "./part.js";
export class Instance {
    constructor({ line, text, }) {
        this.line = line;
        this.parts = [];
        let part_index = 0;
        for (const part of text) {
            this.parts.push(new Part.Instance({
                parts: this,
                index: part_index++,
                text: part,
            }));
        }
    }
    Line() {
        return this.line;
    }
    Count() {
        return this.parts.length;
    }
    At(part_index) {
        Utils.Assert(part_index > -1, `part_index (${part_index}) must be greater than -1.`);
        Utils.Assert(part_index < this.Count(), `part_index (${part_index}) must be less than part_count (${this.Count()}).`);
        return this.parts[part_index];
    }
    Array() {
        return Array.from(this.parts);
    }
}
