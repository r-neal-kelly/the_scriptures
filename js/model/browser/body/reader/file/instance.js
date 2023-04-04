import * as Utils from "../../../../../utils.js";
import * as Entity from "../../../../entity.js";
import * as Line from "./line.js";
export class Instance extends Entity.Instance {
    static Min_Line_Count() {
        return Instance.min_line_count;
    }
    static Set_Min_Line_Count(min_line_count) {
        Utils.Assert(min_line_count >= 0, `min_line_count must be greater than or equal to 0.`);
        Instance.min_line_count = min_line_count;
    }
    constructor({ reader, data, text, }) {
        super();
        this.reader = reader;
        this.data = data;
        this.text = text;
        this.lines = [];
        for (let idx = 0, end = text.Line_Count(); idx < end; idx += 1) {
            this.lines.push(new Line.Instance({
                file: this,
                index: idx,
                text: text.Line(idx),
            }));
        }
        this.Is_Ready_After(this.lines);
    }
    Reader() {
        return this.reader;
    }
    Data() {
        Utils.Assert(this.data != null, `Has no data.`);
        return this.data;
    }
    Maybe_Data() {
        return this.data;
    }
    Text() {
        return this.text;
    }
    Line_Count() {
        return this.lines.length;
    }
    Line_At(line_index) {
        Utils.Assert(line_index > -1, `line_index (${line_index}) must be greater than -1.`);
        if (line_index < this.Line_Count()) {
            return this.lines[line_index];
        }
        else {
            return Instance.blank_line;
        }
    }
}
Instance.min_line_count = 50;
Instance.blank_line = new Line.Instance({
    file: null,
    index: null,
    text: null,
});
