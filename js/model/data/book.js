import * as Languages from "./languages.js";
export class Instance {
    constructor({ books, name, }) {
        this.books = books;
        this.name = name;
        this.path = `${books.Path()}/${name}`;
        this.languages = new Languages.Instance({
            book: this,
        });
    }
    Books() {
        return this.books;
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
    Languages() {
        return this.languages;
    }
}
