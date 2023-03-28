import * as Utils from "../../../../utils.js";
import * as File from "./instance.js";
import * as Line from "./line.js";
export class Instance {
    static Min_Count() {
        return File.Instance.Min_Line_Count();
    }
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
        if (line_index < this.Count()) {
            return this.lines[line_index];
        }
        else {
            return Instance.blank_line;
        }
    }
    Array() {
        return Array.from(this.lines);
    }
}
Instance.blank_line = new Line.Instance({
    lines: null,
    index: null,
    text: null,
});
