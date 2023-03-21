var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Entity from "../../entity.js";
import * as Book from "./book.js";
export class Instance extends Entity.Instance {
    constructor({ model, browser, }) {
        super(`div`, browser.Event_Grid());
        this.model = model;
        this.browser = browser;
        this.books = [];
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            for (const book_model of yield this.Model().Books()) {
                const book_view = new Book.Instance({
                    model: book_model,
                    books: this,
                });
                this.books.push(book_view);
                this.Add_Child(book_view);
            }
        });
    }
    Model() {
        return this.model;
    }
    Browser() {
        return this.browser;
    }
}
