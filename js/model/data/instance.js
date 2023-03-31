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
import * as Async from "../../async.js";
import { Type } from "./type.js";
import * as Books from "./books.js";
export class Instance extends Async.Instance {
    constructor() {
        super();
        this.name = `Data`;
        this.path = this.name;
        this.books = new Books.Instance({
            data: this,
        });
        this.book_names = null;
        this.language_names = null;
        this.version_names = null;
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
    // we should probably have this info cached in a downloaded info file
    // and for the more specific ones, in each of their directories.
    // for right now we're doing it here till we get it working.
    Cache_Names() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.book_names == null ||
                this.language_names == null ||
                this.version_names == null) {
                const book_names = new Set();
                const language_names = new Set();
                const version_names = new Set();
                for (const book of yield this.Books().Array()) {
                    book_names.add(book.Name());
                    for (const language of yield book.Languages().Array()) {
                        language_names.add(language.Name());
                        for (const version of yield language.Versions().Array()) {
                            version_names.add(version.Name());
                        }
                    }
                }
                this.book_names = Array.from(book_names).sort();
                this.language_names = Array.from(language_names).sort();
                this.version_names = Array.from(version_names).sort();
            }
        });
    }
    Names(of) {
        return __awaiter(this, void 0, void 0, function* () {
            if (of.length === 1) {
                Utils.Assert(of[0].Name() == null, `Unusable name.`);
                if (of[0].Type() === Type.BOOKS ||
                    of[0].Type() === Type.BOOK) {
                    return yield this.Book_Names();
                }
                else if (of[0].Type() === Type.LANGUAGES ||
                    of[0].Type() === Type.LANGUAGE) {
                    return yield this.Language_Names();
                }
                else if (of[0].Type() === Type.VERSIONS ||
                    of[0].Type() === Type.VERSION) {
                    return yield this.Version_Names();
                }
                else {
                    Utils.Assert(false, `Invalid type.`);
                    return [];
                }
            }
            else if (of.length === 2) {
                Utils.Assert(of[0].Name() != null, `Missing name.`);
                Utils.Assert(of[1].Name() == null, `Unusable name.`);
                if ((of[0].Type() === Type.BOOKS ||
                    of[0].Type() === Type.BOOK) &&
                    (of[1].Type() === Type.LANGUAGES ||
                        of[1].Type() === Type.LANGUAGE)) {
                    return yield this.Book_Language_Names({
                        book_name: of[0].Name(),
                    });
                }
                else if ((of[0].Type() === Type.BOOKS ||
                    of[0].Type() === Type.BOOK) &&
                    (of[1].Type() === Type.VERSIONS ||
                        of[1].Type() === Type.VERSION)) {
                    return yield this.Book_Version_Names({
                        book_name: of[0].Name(),
                    });
                }
                else if ((of[0].Type() === Type.LANGUAGES ||
                    of[0].Type() === Type.LANGUAGE) &&
                    (of[1].Type() === Type.BOOKS ||
                        of[1].Type() === Type.BOOK)) {
                    return yield this.Language_Book_Names({
                        language_name: of[0].Name(),
                    });
                }
                else if ((of[0].Type() === Type.LANGUAGES ||
                    of[0].Type() === Type.LANGUAGE) &&
                    (of[1].Type() === Type.VERSIONS ||
                        of[1].Type() === Type.VERSION)) {
                    return yield this.Language_Version_Names({
                        language_name: of[0].Name(),
                    });
                }
                else if ((of[0].Type() === Type.VERSIONS ||
                    of[0].Type() === Type.VERSION) &&
                    (of[1].Type() === Type.BOOKS ||
                        of[1].Type() === Type.BOOK)) {
                    return yield this.Version_Book_Names({
                        version_name: of[0].Name(),
                    });
                }
                else if ((of[0].Type() === Type.VERSIONS ||
                    of[0].Type() === Type.VERSION) &&
                    (of[1].Type() === Type.LANGUAGES ||
                        of[1].Type() === Type.LANGUAGE)) {
                    return yield this.Version_Language_Names({
                        version_name: of[0].Name(),
                    });
                }
                else {
                    Utils.Assert(false, `Invalid type.`);
                    return [];
                }
            }
            else if (of.length === 3) {
                Utils.Assert(of[0].Name() != null &&
                    of[1].Name() != null, `Missing name.`);
                Utils.Assert(of[2].Name() == null, `Unusable name.`);
                if ((of[0].Type() === Type.BOOKS ||
                    of[0].Type() === Type.BOOK) &&
                    (of[1].Type() === Type.LANGUAGES ||
                        of[1].Type() === Type.LANGUAGE) &&
                    (of[2].Type() === Type.VERSIONS ||
                        of[2].Type() === Type.VERSION)) {
                    return yield this.Book_Language_Version_Names({
                        book_name: of[0].Name(),
                        language_name: of[1].Name(),
                    });
                }
                else if ((of[0].Type() === Type.BOOKS ||
                    of[0].Type() === Type.BOOK) &&
                    (of[1].Type() === Type.VERSIONS ||
                        of[1].Type() === Type.VERSION) &&
                    (of[2].Type() === Type.LANGUAGES ||
                        of[2].Type() === Type.LANGUAGE)) {
                    return yield this.Book_Version_Language_Names({
                        book_name: of[0].Name(),
                        version_name: of[1].Name(),
                    });
                }
                else if ((of[0].Type() === Type.LANGUAGES ||
                    of[0].Type() === Type.LANGUAGE) &&
                    (of[1].Type() === Type.BOOKS ||
                        of[1].Type() === Type.BOOK) &&
                    (of[2].Type() === Type.VERSIONS ||
                        of[2].Type() === Type.VERSION)) {
                    return yield this.Language_Book_Version_Names({
                        language_name: of[0].Name(),
                        book_name: of[1].Name(),
                    });
                }
                else if ((of[0].Type() === Type.LANGUAGES ||
                    of[0].Type() === Type.LANGUAGE) &&
                    (of[1].Type() === Type.VERSIONS ||
                        of[1].Type() === Type.VERSION) &&
                    (of[2].Type() === Type.BOOKS ||
                        of[2].Type() === Type.BOOK)) {
                    return yield this.Language_Version_Book_Names({
                        language_name: of[0].Name(),
                        version_name: of[1].Name(),
                    });
                }
                else if ((of[0].Type() === Type.VERSIONS ||
                    of[0].Type() === Type.VERSION) &&
                    (of[1].Type() === Type.BOOKS ||
                        of[1].Type() === Type.BOOK) &&
                    (of[2].Type() === Type.LANGUAGES ||
                        of[2].Type() === Type.LANGUAGE)) {
                    return yield this.Version_Book_Language_Names({
                        version_name: of[0].Name(),
                        book_name: of[1].Name(),
                    });
                }
                else if ((of[0].Type() === Type.VERSIONS ||
                    of[0].Type() === Type.VERSION) &&
                    (of[1].Type() === Type.LANGUAGES ||
                        of[1].Type() === Type.LANGUAGE) &&
                    (of[2].Type() === Type.BOOKS ||
                        of[2].Type() === Type.BOOK)) {
                    return yield this.Version_Language_Book_Names({
                        version_name: of[0].Name(),
                        language_name: of[1].Name(),
                    });
                }
                else {
                    Utils.Assert(false, `Invalid type.`);
                    return [];
                }
            }
            else if (of.length === 4) {
                Utils.Assert(of[0].Name() != null &&
                    of[1].Name() != null &&
                    of[2].Name() != null, `Missing name.`);
                Utils.Assert(of[3].Name() == null, `Unusable name.`);
                Utils.Assert(of[3].Type() === Type.FILES ||
                    of[3].Type() === Type.FILE, `Invalid type.`);
                if ((of[0].Type() === Type.BOOKS ||
                    of[0].Type() === Type.BOOK) &&
                    (of[1].Type() === Type.LANGUAGES ||
                        of[1].Type() === Type.LANGUAGE) &&
                    (of[2].Type() === Type.VERSIONS ||
                        of[2].Type() === Type.VERSION)) {
                    return yield this.File_Names({
                        book_name: of[0].Name(),
                        language_name: of[1].Name(),
                        version_name: of[2].Name(),
                    });
                }
                else if ((of[0].Type() === Type.BOOKS ||
                    of[0].Type() === Type.BOOK) &&
                    (of[1].Type() === Type.VERSIONS ||
                        of[1].Type() === Type.VERSION) &&
                    (of[2].Type() === Type.LANGUAGES ||
                        of[2].Type() === Type.LANGUAGE)) {
                    return yield this.File_Names({
                        book_name: of[0].Name(),
                        language_name: of[2].Name(),
                        version_name: of[1].Name(),
                    });
                }
                else if ((of[0].Type() === Type.LANGUAGES ||
                    of[0].Type() === Type.LANGUAGE) &&
                    (of[1].Type() === Type.BOOKS ||
                        of[1].Type() === Type.BOOK) &&
                    (of[2].Type() === Type.VERSIONS ||
                        of[2].Type() === Type.VERSION)) {
                    return yield this.File_Names({
                        book_name: of[1].Name(),
                        language_name: of[0].Name(),
                        version_name: of[2].Name(),
                    });
                }
                else if ((of[0].Type() === Type.LANGUAGES ||
                    of[0].Type() === Type.LANGUAGE) &&
                    (of[1].Type() === Type.VERSIONS ||
                        of[1].Type() === Type.VERSION) &&
                    (of[2].Type() === Type.BOOKS ||
                        of[2].Type() === Type.BOOK)) {
                    return yield this.File_Names({
                        book_name: of[2].Name(),
                        language_name: of[0].Name(),
                        version_name: of[1].Name(),
                    });
                }
                else if ((of[0].Type() === Type.VERSIONS ||
                    of[0].Type() === Type.VERSION) &&
                    (of[1].Type() === Type.BOOKS ||
                        of[1].Type() === Type.BOOK) &&
                    (of[2].Type() === Type.LANGUAGES ||
                        of[2].Type() === Type.LANGUAGE)) {
                    return yield this.File_Names({
                        book_name: of[1].Name(),
                        language_name: of[2].Name(),
                        version_name: of[0].Name(),
                    });
                }
                else if ((of[0].Type() === Type.VERSIONS ||
                    of[0].Type() === Type.VERSION) &&
                    (of[1].Type() === Type.LANGUAGES ||
                        of[1].Type() === Type.LANGUAGE) &&
                    (of[2].Type() === Type.BOOKS ||
                        of[2].Type() === Type.BOOK)) {
                    return yield this.File_Names({
                        book_name: of[2].Name(),
                        language_name: of[1].Name(),
                        version_name: of[0].Name(),
                    });
                }
                else {
                    Utils.Assert(false, `Invalid type.`);
                    return [];
                }
            }
            else {
                Utils.Assert(false, `Invalid query length.`);
                return [];
            }
        });
    }
    // we should have an option on how the names are sorted
    Book_Names() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.book_names == null) {
                yield this.Cache_Names();
            }
            return Array.from(this.book_names);
        });
    }
    Book_Language_Names({ book_name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const language_names = new Set();
            for (const book of yield this.Books().Array()) {
                if (book.Name() === book_name) {
                    for (const language of yield book.Languages().Array()) {
                        language_names.add(language.Name());
                    }
                    break;
                }
            }
            return Array.from(language_names).sort();
        });
    }
    Book_Version_Names({ book_name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const version_names = new Set();
            for (const book of yield this.Books().Array()) {
                if (book.Name() === book_name) {
                    for (const language of yield book.Languages().Array()) {
                        for (const version of yield language.Versions().Array()) {
                            version_names.add(version.Name());
                        }
                    }
                    break;
                }
            }
            return Array.from(version_names).sort();
        });
    }
    Book_Language_Version_Names({ book_name, language_name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const version_names = new Set();
            for (const book of yield this.Books().Array()) {
                if (book.Name() === book_name) {
                    for (const language of yield book.Languages().Array()) {
                        if (language.Name() === language_name) {
                            for (const version of yield language.Versions().Array()) {
                                version_names.add(version.Name());
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            return Array.from(version_names).sort();
        });
    }
    Book_Version_Language_Names({ book_name, version_name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const language_names = new Set();
            for (const book of yield this.Books().Array()) {
                if (book.Name() === book_name) {
                    for (const language of yield book.Languages().Array()) {
                        for (const version of yield language.Versions().Array()) {
                            if (version.Name() === version_name) {
                                language_names.add(language.Name());
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            return Array.from(language_names).sort();
        });
    }
    Language_Names() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.language_names == null) {
                yield this.Cache_Names();
            }
            return Array.from(this.language_names);
        });
    }
    Language_Book_Names({ language_name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const book_names = new Set();
            for (const book of yield this.Books().Array()) {
                for (const language of yield book.Languages().Array()) {
                    if (language.Name() === language_name) {
                        book_names.add(book.Name());
                        break;
                    }
                }
            }
            return Array.from(book_names).sort();
        });
    }
    Language_Version_Names({ language_name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const version_names = new Set();
            for (const book of yield this.Books().Array()) {
                for (const language of yield book.Languages().Array()) {
                    if (language.Name() === language_name) {
                        for (const version of yield language.Versions().Array()) {
                            version_names.add(version.Name());
                        }
                        break;
                    }
                }
            }
            return Array.from(version_names).sort();
        });
    }
    Language_Book_Version_Names({ language_name, book_name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const version_names = new Set();
            for (const book of yield this.Books().Array()) {
                if (book.Name() === book_name) {
                    for (const language of yield book.Languages().Array()) {
                        if (language.Name() === language_name) {
                            for (const version of yield language.Versions().Array()) {
                                version_names.add(version.Name());
                            }
                            break;
                        }
                    }
                    break;
                }
            }
            return Array.from(version_names).sort();
        });
    }
    Language_Version_Book_Names({ language_name, version_name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const book_names = new Set();
            for (const book of yield this.Books().Array()) {
                for (const language of yield book.Languages().Array()) {
                    if (language.Name() === language_name) {
                        for (const version of yield language.Versions().Array()) {
                            if (version.Name() === version_name) {
                                book_names.add(book.Name());
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            return Array.from(book_names).sort();
        });
    }
    Version_Names() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.version_names == null) {
                yield this.Cache_Names();
            }
            return Array.from(this.version_names);
        });
    }
    Version_Book_Names({ version_name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const book_names = new Set();
            for (const book of yield this.Books().Array()) {
                for (const language of yield book.Languages().Array()) {
                    for (const version of yield language.Versions().Array()) {
                        if (version.Name() === version_name) {
                            book_names.add(book.Name());
                            break;
                        }
                    }
                }
            }
            return Array.from(book_names).sort();
        });
    }
    Version_Language_Names({ version_name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const language_names = new Set();
            for (const book of yield this.Books().Array()) {
                for (const language of yield book.Languages().Array()) {
                    for (const version of yield language.Versions().Array()) {
                        if (version.Name() === version_name) {
                            language_names.add(language.Name());
                            break;
                        }
                    }
                }
            }
            return Array.from(language_names).sort();
        });
    }
    Version_Book_Language_Names({ version_name, book_name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const language_names = new Set();
            for (const book of yield this.Books().Array()) {
                if (book.Name() === book_name) {
                    for (const language of yield book.Languages().Array()) {
                        for (const version of yield language.Versions().Array()) {
                            if (version.Name() === version_name) {
                                language_names.add(language.Name());
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            return Array.from(language_names).sort();
        });
    }
    Version_Language_Book_Names({ version_name, language_name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const book_names = new Set();
            for (const book of yield this.Books().Array()) {
                for (const language of yield book.Languages().Array()) {
                    if (language.Name() === language_name) {
                        for (const version of yield language.Versions().Array()) {
                            if (version.Name() === version_name) {
                                book_names.add(book.Name());
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            return Array.from(book_names).sort();
        });
    }
    File({ book_name, language_name, version_name, file_name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield this.Books().Get(book_name);
            const language = yield book.Languages().Get(language_name);
            const version = yield language.Versions().Get(version_name);
            const file = yield version.Files().Get(file_name);
            return file;
        });
    }
    Files({ book_name, language_name, version_name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = yield this.Books().Get(book_name);
            const language = yield book.Languages().Get(language_name);
            const version = yield language.Versions().Get(version_name);
            return version.Files();
        });
    }
    File_Names({ book_name, language_name, version_name, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this.Files({
                book_name,
                language_name,
                version_name,
            });
            return (yield files.Array()).map(function (file) {
                return file.Name();
            });
        });
    }
}
