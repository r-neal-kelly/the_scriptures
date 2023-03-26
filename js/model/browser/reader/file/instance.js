import * as Lines from "./lines.js";
export class Instance {
    constructor({ reader, data, text, }) {
        this.reader = reader;
        this.data = data;
        this.text = text;
        this.lines = new Lines.Instance({
            file: this,
            text_lines: text.Lines(),
        });
    }
    Reader() {
        return this.reader;
    }
    Data() {
        return this.data;
    }
    Lines() {
        return this.lines;
    }
}
