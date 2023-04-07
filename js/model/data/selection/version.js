export class Name {
    constructor({ book, language, version, }) {
        this.book = book;
        this.language = language;
        this.version = version;
        Object.freeze(this);
    }
    Book() {
        return this.book;
    }
    Language() {
        return this.language;
    }
    Version() {
        return this.version;
    }
}
