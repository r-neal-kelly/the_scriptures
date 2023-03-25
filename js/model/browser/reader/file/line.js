export class Instance {
    constructor({ lines, index, text, }) {
        this.lines = lines;
        this.index = index;
        this.text = text.replaceAll(/  /g, `  `);
    }
    Lines() {
        return this.lines;
    }
    Index() {
        return this.index;
    }
    Text() {
        return this.text;
    }
}
