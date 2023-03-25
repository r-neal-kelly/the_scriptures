import * as Line from "./line.js";
export class Instance {
    constructor({ dictionary, value, }) {
        this.dictionary = dictionary;
        this.value = value;
        this.lines = [];
        let line_index = 0;
        for (const value_line of value.split(/\r?\n/g)) {
            this.lines.push(new Line.Instance({
                text: this,
                index: line_index++,
                value: value_line,
            }));
        }
    }
    Dictionary() {
        return this.dictionary;
    }
    Value() {
        return this.value;
    }
    Lines() {
        return Array.from(this.lines);
    }
}
