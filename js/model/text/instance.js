import * as Utils from "../../utils.js";
import * as Line from "./line.js";
export class Instance {
    constructor({ dictionary, value, }) {
        this.dictionary = dictionary;
        this.value = value;
        this.lines = [];
        for (const line_value of value.split(/\r?\n/g)) {
            this.lines.push(new Line.Instance({
                text: this,
                value: line_value,
            }));
        }
    }
    Dictionary() {
        return this.dictionary;
    }
    Value() {
        return this.value;
    }
    Has_Line(line) {
        return this.lines.indexOf(line) > -1;
    }
    Has_Line_Index(line_index) {
        return (line_index > -1 &&
            line_index < this.lines.length);
    }
    Line(line_index) {
        Utils.Assert(this.Has_Line_Index(line_index), `Text does not have line at the index.`);
        return this.lines[line_index];
    }
    Line_Index(line) {
        const index = this.lines.indexOf(line);
        Utils.Assert(index > -1, `Text does not have the line.`);
        return index;
    }
    Lines() {
        return Array.from(this.lines);
    }
}
