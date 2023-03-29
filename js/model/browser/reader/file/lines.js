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
        for (let idx = 0, end = text.Line_Count(); idx < end; idx += 1) {
            this.lines.push(new Line.Instance({
                lines: this,
                index: idx,
                text: text.Line(idx),
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
}
Instance.blank_line = new Line.Instance({
    lines: null,
    index: null,
    text: null,
});
