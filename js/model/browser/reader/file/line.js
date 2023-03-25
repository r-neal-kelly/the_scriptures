export class Instance {
    constructor({ lines, text, }) {
        this.lines = lines;
        this.text = text.replaceAll(/  /g, `  `);
    }
    Lines() {
        return this.lines;
    }
    Text() {
        return this.text;
    }
}
