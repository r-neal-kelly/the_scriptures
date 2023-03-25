import * as Utils from "../../../../utils.js";
import * as Line from "./line.js";
export class Instance {
    constructor({ file, text, }) {
        this.file = file;
        this.lines = [];
        let line_index = 0;
        this.lines.push(new Line.Instance({
            lines: this,
            index: line_index++,
            text: file.Data().Title(),
        }));
        this.lines.push(new Line.Instance({
            lines: this,
            index: line_index++,
            text: ``,
        }));
        for (const line_text of text.split(/\r?\n/g)) {
            this.lines.push(new Line.Instance({
                lines: this,
                index: line_index++,
                text: line_text,
            }));
        }
        this.lines.push(new Line.Instance({
            lines: this,
            index: line_index++,
            text: ``,
        }));
    }
    File() {
        return this.file;
    }
    Count() {
        return this.lines.length;
    }
    At(line_index) {
        Utils.Assert(line_index > -1, `line_index must be greater than -1.`);
        Utils.Assert(line_index < this.Count(), `line_index must be less than line_count.`);
        return this.lines[line_index];
    }
    Array() {
        return Array.from(this.lines);
    }
}
