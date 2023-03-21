import * as Books from "./books.js";
export class Instance {
    constructor() {
        this.name = `Browser`;
        this.path = this.name;
        this.books = new Books.Instance({
            browser: this,
        });
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
    Books() {
        return this.books;
    }
}
