export class Instance {
    constructor({ parts, index, text, }) {
        this.parts = parts;
        this.index = index;
        this.text = text;
    }
    Parts() {
        return this.parts;
    }
    Index() {
        return this.index;
    }
    Text() {
        return this.text;
    }
}
