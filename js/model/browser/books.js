var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "../../utils.js";
import * as Book from "./book.js";
export class Instance {
    constructor({ browser, }) {
        this.browser = browser;
        this.name = `Books`;
        this.path = `${browser.Path()}/${this.name}`;
        this.info = null;
        this.books = [];
    }
    Browser() {
        return this.browser;
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
    Info() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            if (this.info != null) {
                return this.info;
            }
            else {
                return ({
                    names: [],
                });
            }
        });
    }
    Book_Count() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            return this.books.length;
        });
    }
    Book(book_index) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            Utils.Assert(book_index > -1, `book_index must be greater than -1.`);
            Utils.Assert(book_index < (yield this.Book_Count()), `book_index must be less than book_count.`);
            return this.books[book_index];
        });
    }
    Books() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            return Array.from(this.books);
        });
    }
    Download() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.info == null) {
                const response = yield fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
                if (response.ok) {
                    this.info = JSON.parse(yield response.text());
                    for (const name of this.info.names) {
                        this.books.push(new Book.Instance({
                            books: this,
                            name: name,
                        }));
                    }
                }
            }
        });
    }
}
