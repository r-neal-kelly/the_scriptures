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
import * as Book from "./book.js";
export class Instance extends Async.Instance {
    constructor() {
        super();
        this.name = `Data`;
        this.path = this.name;
        this.books_path = `${this.path}/Books`;
        this.info = null;
        this.books = [];
        this.Add_Dependencies([]);
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
    Books_Path() {
        return this.books_path;
    }
    Info() {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        Utils.Assert(this.info != null, `info is null!`);
        return this.info;
    }
    Book(book_name) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        for (const book of this.books) {
            if (book.Name() === book_name) {
                return book;
            }
        }
        Utils.Assert(false, `Invalid book_name.`);
        return this.books[0];
    }
    Book_Count() {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        return this.books.length;
    }
    Book_At(book_index) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        Utils.Assert(book_index > -1, `book_index must be greater than -1.`);
        Utils.Assert(book_index < this.Book_Count(), `book_index must be less than book_count.`);
        return this.books[book_index];
    }
    Books() {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        return Array.from(this.books);
    }
    Names(of) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        if (of.length === 1) {
            Utils.Assert(of[0].Name() == null, `Unusable name.
                A query length of 1 only requires a type.`);
            if (of[0].Type() === Type.BOOKS ||
                of[0].Type() === Type.BOOK) {
                return this.Book_Names();
            }
            else if (of[0].Type() === Type.LANGUAGES ||
                of[0].Type() === Type.LANGUAGE) {
                return this.Language_Names();
            }
            else if (of[0].Type() === Type.VERSIONS ||
                of[0].Type() === Type.VERSION) {
                return this.Version_Names();
            }
            else {
                Utils.Assert(false, `Invalid type.
                    A query length of 1 can only gather Books, Languages, or Versions.`);
                return [];
            }
        }
        else if (of.length === 2) {
            Utils.Assert(of[0].Name() != null, `Missing name.
                A query length of 2 requires a name at index 0.`);
            Utils.Assert(of[1].Name() == null, `Unusable name.
                A query length of 2 only requires a type at index 1.`);
            if ((of[0].Type() === Type.BOOKS ||
                of[0].Type() === Type.BOOK) &&
                (of[1].Type() === Type.LANGUAGES ||
                    of[1].Type() === Type.LANGUAGE)) {
                return this.Book_Language_Names({
                    book_name: of[0].Name(),
                });
            }
            else if ((of[0].Type() === Type.BOOKS ||
                of[0].Type() === Type.BOOK) &&
                (of[1].Type() === Type.VERSIONS ||
                    of[1].Type() === Type.VERSION)) {
                return this.Book_Version_Names({
                    book_name: of[0].Name(),
                });
            }
            else if ((of[0].Type() === Type.LANGUAGES ||
                of[0].Type() === Type.LANGUAGE) &&
                (of[1].Type() === Type.BOOKS ||
                    of[1].Type() === Type.BOOK)) {
                return this.Language_Book_Names({
                    language_name: of[0].Name(),
                });
            }
            else if ((of[0].Type() === Type.LANGUAGES ||
                of[0].Type() === Type.LANGUAGE) &&
                (of[1].Type() === Type.VERSIONS ||
                    of[1].Type() === Type.VERSION)) {
                return this.Language_Version_Names({
                    language_name: of[0].Name(),
                });
            }
            else if ((of[0].Type() === Type.VERSIONS ||
                of[0].Type() === Type.VERSION) &&
                (of[1].Type() === Type.BOOKS ||
                    of[1].Type() === Type.BOOK)) {
                return this.Version_Book_Names({
                    version_name: of[0].Name(),
                });
            }
            else if ((of[0].Type() === Type.VERSIONS ||
                of[0].Type() === Type.VERSION) &&
                (of[1].Type() === Type.LANGUAGES ||
                    of[1].Type() === Type.LANGUAGE)) {
                return this.Version_Language_Names({
                    version_name: of[0].Name(),
                });
            }
            else {
                Utils.Assert(false, `Invalid type.
                    A query length of 2 can only gather a combination of Books, Languages, or Versions.
                    Each index in the query must have a unique type, and cannot contain repeats.`);
                return [];
            }
        }
        else if (of.length === 3) {
            Utils.Assert(of[0].Name() != null &&
                of[1].Name() != null, `Missing name.
                A query length of 3 requires a name for indices 0 and 1.`);
            Utils.Assert(of[2].Name() == null, `Unusable name.
                A query length of 3 only requires a type at index 2.`);
            if ((of[0].Type() === Type.BOOKS ||
                of[0].Type() === Type.BOOK) &&
                (of[1].Type() === Type.LANGUAGES ||
                    of[1].Type() === Type.LANGUAGE) &&
                (of[2].Type() === Type.VERSIONS ||
                    of[2].Type() === Type.VERSION)) {
                return this.Book_Language_Version_Names({
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
                return this.Book_Version_Language_Names({
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
                return this.Language_Book_Version_Names({
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
                return this.Language_Version_Book_Names({
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
                return this.Version_Book_Language_Names({
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
                return this.Version_Language_Book_Names({
                    version_name: of[0].Name(),
                    language_name: of[1].Name(),
                });
            }
            else {
                Utils.Assert(false, `Invalid type.
                    A query length of 3 can only gather a combination of Books, Languages, or Versions.
                    Each index in the query must have a unique type, and cannot contain repeats.`);
                return [];
            }
        }
        else if (of.length === 4) {
            Utils.Assert(of[0].Name() != null &&
                of[1].Name() != null &&
                of[2].Name() != null, `Missing name.
                A query length of 4 must have a name for indices 0, 1, and 2.`);
            Utils.Assert(of[3].Name() == null, `Unusable name.
                A query length of 4 only requires a type at index 3.`);
            Utils.Assert(of[3].Type() === Type.FILES ||
                of[3].Type() === Type.FILE, `Invalid type.
                A query length of 4 requires index 3 to have a type indicated Files.`);
            if ((of[0].Type() === Type.BOOKS ||
                of[0].Type() === Type.BOOK) &&
                (of[1].Type() === Type.LANGUAGES ||
                    of[1].Type() === Type.LANGUAGE) &&
                (of[2].Type() === Type.VERSIONS ||
                    of[2].Type() === Type.VERSION)) {
                return this.File_Names({
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
                return this.File_Names({
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
                return this.File_Names({
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
                return this.File_Names({
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
                return this.File_Names({
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
                return this.File_Names({
                    book_name: of[2].Name(),
                    language_name: of[1].Name(),
                    version_name: of[0].Name(),
                });
            }
            else {
                Utils.Assert(false, `Invalid type.
                    A query length of 4 must have a combination of Books, Languages, Versions, and Files.
                    Each index in the query must have a unique type, and cannot contain repeats.
                    The last index must indicate Files.`);
                return [];
            }
        }
        else {
            Utils.Assert(false, `Invalid query length.
                A query must have a length from 1 to 4.`);
            return [];
        }
    }
    Book_Names() {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        return Array.from(this.Info().unique_book_names);
    }
    Book_Language_Names({ book_name, }) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        const language_names = new Set();
        for (const book of this.Books()) {
            if (book.Name() === book_name) {
                for (const language of book.Languages()) {
                    language_names.add(language.Name());
                }
                break;
            }
        }
        return Array.from(language_names).sort();
    }
    Book_Version_Names({ book_name, }) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        const version_names = new Set();
        for (const book of this.Books()) {
            if (book.Name() === book_name) {
                for (const language of book.Languages()) {
                    for (const version of language.Versions()) {
                        version_names.add(version.Name());
                    }
                }
                break;
            }
        }
        return Array.from(version_names).sort();
    }
    Book_Language_Version_Names({ book_name, language_name, }) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        const version_names = new Set();
        for (const book of this.Books()) {
            if (book.Name() === book_name) {
                for (const language of book.Languages()) {
                    if (language.Name() === language_name) {
                        for (const version of language.Versions()) {
                            version_names.add(version.Name());
                        }
                        break;
                    }
                }
                break;
            }
        }
        return Array.from(version_names).sort();
    }
    Book_Version_Language_Names({ book_name, version_name, }) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        const language_names = new Set();
        for (const book of this.Books()) {
            if (book.Name() === book_name) {
                for (const language of book.Languages()) {
                    for (const version of language.Versions()) {
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
    }
    Language_Names() {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        return Array.from(this.Info().unique_language_names);
    }
    Language_Book_Names({ language_name, }) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        const book_names = new Set();
        for (const book of this.Books()) {
            for (const language of book.Languages()) {
                if (language.Name() === language_name) {
                    book_names.add(book.Name());
                    break;
                }
            }
        }
        return Array.from(book_names).sort();
    }
    Language_Version_Names({ language_name, }) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        const version_names = new Set();
        for (const book of this.Books()) {
            for (const language of book.Languages()) {
                if (language.Name() === language_name) {
                    for (const version of language.Versions()) {
                        version_names.add(version.Name());
                    }
                    break;
                }
            }
        }
        return Array.from(version_names).sort();
    }
    Language_Book_Version_Names({ language_name, book_name, }) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        const version_names = new Set();
        for (const book of this.Books()) {
            if (book.Name() === book_name) {
                for (const language of book.Languages()) {
                    if (language.Name() === language_name) {
                        for (const version of language.Versions()) {
                            version_names.add(version.Name());
                        }
                        break;
                    }
                }
                break;
            }
        }
        return Array.from(version_names).sort();
    }
    Language_Version_Book_Names({ language_name, version_name, }) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        const book_names = new Set();
        for (const book of this.Books()) {
            for (const language of book.Languages()) {
                if (language.Name() === language_name) {
                    for (const version of language.Versions()) {
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
    }
    Version_Names() {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        return Array.from(this.Info().unique_version_names);
    }
    Version_Book_Names({ version_name, }) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        const book_names = new Set();
        for (const book of this.Books()) {
            for (const language of book.Languages()) {
                for (const version of language.Versions()) {
                    if (version.Name() === version_name) {
                        book_names.add(book.Name());
                        break;
                    }
                }
            }
        }
        return Array.from(book_names).sort();
    }
    Version_Language_Names({ version_name, }) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        const language_names = new Set();
        for (const book of this.Books()) {
            for (const language of book.Languages()) {
                for (const version of language.Versions()) {
                    if (version.Name() === version_name) {
                        language_names.add(language.Name());
                        break;
                    }
                }
            }
        }
        return Array.from(language_names).sort();
    }
    Version_Book_Language_Names({ version_name, book_name, }) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        const language_names = new Set();
        for (const book of this.Books()) {
            if (book.Name() === book_name) {
                for (const language of book.Languages()) {
                    for (const version of language.Versions()) {
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
    }
    Version_Language_Book_Names({ version_name, language_name, }) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        const book_names = new Set();
        for (const book of this.Books()) {
            for (const language of book.Languages()) {
                if (language.Name() === language_name) {
                    for (const version of language.Versions()) {
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
    }
    Versions({ book_names = null, language_names = null, version_names = null, }) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        const versions = [];
        if (book_names == null) {
            book_names = this.Book_Names();
        }
        if (language_names == null) {
            language_names = this.Language_Names();
        }
        if (version_names == null) {
            version_names = this.Version_Names();
        }
        for (const book of this.Books()) {
            if (book_names.includes(book.Name())) {
                for (const language of book.Languages()) {
                    if (language_names.includes(language.Name())) {
                        for (const version of language.Versions()) {
                            if (version_names.includes(version.Name())) {
                                versions.push(version);
                            }
                        }
                    }
                }
            }
        }
        return versions;
    }
    Files({ book_name, language_name, version_name, }) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        return this.Book(book_name)
            .Language(language_name)
            .Version(version_name)
            .Files();
    }
    File({ book_name, language_name, version_name, file_name, }) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        return this.Book(book_name)
            .Language(language_name)
            .Version(version_name)
            .File(file_name);
    }
    File_Names({ book_name, language_name, version_name, }) {
        return this.Files({
            book_name,
            language_name,
            version_name,
        }).map(function (file) {
            return file.Name();
        });
    }
    After_Dependencies_Are_Ready() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
            if (response.ok) {
                this.info = JSON.parse(yield response.text());
                for (const book_branch of this.info.tree.books) {
                    this.books.push(new Book.Instance({
                        data: this,
                        branch: book_branch,
                    }));
                }
            }
            else {
                this.info = {
                    tree: {
                        books: [],
                    },
                    unique_book_names: [],
                    unique_language_names: [],
                    unique_version_names: [],
                    unique_part_values: [],
                };
            }
        });
    }
}
const singleton = new Instance();
export function Singleton() {
    return singleton;
}
