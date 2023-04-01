export class Name {
    constructor({ book, language, version, file, }) {
        this.book = book;
        this.language = language;
        this.version = version;
        this.file = file;
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
    File() {
        return this.file;
    }
}
export class Index {
    constructor({ book, language, version, file, }) {
        this.book = book;
        this.language = language;
        this.version = version;
        this.file = file;
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
    File() {
        return this.file;
    }
}
