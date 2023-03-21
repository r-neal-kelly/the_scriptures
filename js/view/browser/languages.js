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
import * as Language from "./language.js";
export class Instance extends Entity.Instance {
    constructor({ model, book, }) {
        super(`div`, book.Event_Grid());
        this.model = model;
        this.book = book;
        this.languages = [];
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            for (const language_model of yield this.Model().Languages()) {
                const language_view = new Language.Instance({
                    model: language_model,
                    languages: this,
                });
                this.languages.push(language_view);
                this.Add_Child(language_view);
            }
        });
    }
    Model() {
        return this.model;
    }
    Book() {
        return this.book;
    }
}
