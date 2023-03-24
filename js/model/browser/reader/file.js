export class Instance {
    constructor({ reader, data, text, }) {
        this.reader = reader;
        this.data = data;
        this.text = text;
    }
    Reader() {
        return this.reader;
    }
    Data() {
        return this.data;
    }
    Text() {
        return this.text;
    }
}
