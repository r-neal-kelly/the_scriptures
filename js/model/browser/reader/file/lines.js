import * as Utils from "../../../../utils.js";
import * as Line from "./line.js";
export class Instance {
    constructor({ file, text, }) {
        this.file = file;
        this.lines = [];
        let line_index = 0;
        for (const line of text) {
            this.lines.push(new Line.Instance({
                lines: this,
                index: line_index++,
                text: line,
            }));
        }
    }
    File() {
        return this.file;
    }
    Count() {
        return this.lines.length;
    }
    At(line_index) {
        Utils.Assert(line_index > -1, `line_index (${line_index}) must be greater than -1.`);
        Utils.Assert(line_index < this.Count(), `line_index (${line_index}) must be less than line_count (${this.Count()}).`);
        return this.lines[line_index];
    }
    Array() {
        return Array.from(this.lines);
    }
}
