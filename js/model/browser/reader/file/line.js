import * as Parts from "./parts.js";
export class Instance {
    constructor({ lines, index, text, }) {
        this.lines = lines;
        this.index = index;
        this.text = text;
        this.parts = new Parts.Instance({
            line: this,
            text: text.Parts(),
        });
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
    Parts() {
        return this.parts;
    }
}
