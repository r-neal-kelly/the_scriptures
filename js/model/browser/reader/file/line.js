export class Instance {
    constructor({ lines, index, text_line, }) {
        this.lines = lines;
        this.index = index;
        this.text_line = text_line;
    }
    Lines() {
        return this.lines;
    }
    Index() {
        return this.index;
    }
    Text() {
        return this.text_line.Value().replaceAll(/  /g, `  `);
    }
}
