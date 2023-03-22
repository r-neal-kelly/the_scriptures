var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "../../../utils.js";
import * as Language from "./language.js";
export class Instance {
    constructor({ book, }) {
        this.book = book;
        this.name = `Languages`;
        this.path = `${book.Path()}/${this.name}`;
        this.info = null;
        this.languages = [];
    }
    Book() {
        return this.book;
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
    Count() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            return this.languages.length;
        });
    }
    At(language_index) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            Utils.Assert(language_index > -1, `language_index must be greater than -1.`);
            Utils.Assert(language_index < (yield this.Count()), `language_index must be less than language_count.`);
            return this.languages[language_index];
        });
    }
    Get(language_name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            for (const language of this.languages) {
                if (language.Name() === language_name) {
                    return language;
                }
            }
            Utils.Assert(false, `Invalid language_name.`);
            return this.languages[0];
        });
    }
    Array() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            return Array.from(this.languages);
        });
    }
    Download() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.info == null) {
                const response = yield fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
                if (response.ok) {
                    this.info = JSON.parse(yield response.text());
                    for (const name of this.info.names) {
                        this.languages.push(new Language.Instance({
                            languages: this,
                            name: name,
                        }));
                    }
                }
            }
        });
    }
}
