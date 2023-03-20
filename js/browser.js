var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "./utils.js";
import * as Event from "./event.js";
import * as Entity from "./entity.js";
class Body extends Entity.Instance {
    constructor() {
        super(document.body, new Event.Grid());
        this.browser = null;
    }
    On_Life() {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Create_Style_Element(`
            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            *:focus {
                outline: 0;
            }
            
            html, body {
                width: 100%;
                height: 100%;

                background-color: black;

                font-family: sans-serif;
            }

            span {
                display: inline-block;
            }

            .ITALIC {
                font-style: italic;
            }

            .BOLD {
                font-weight: bold;
            }

            .UNDERLINE {
                text-decoration: underline;
            }
            
            .SMALL_CAPS {
                font-variant: small-caps;
            }
        `);
            return [];
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            this.browser = new Browser({
                root: this,
                name: `Browser`,
            });
            this.Add_Child(this.browser);
        });
    }
    Document() {
        return document;
    }
    Name() {
        return ``;
    }
    Path() {
        return ``;
    }
}
class Browser extends Entity.Instance {
    constructor({ root, name, }) {
        super(`div`, root.Event_Grid());
        this.root = root;
        this.name = name;
        this.path = name;
        this.books = null;
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return ({
                "display": `grid`,
                "width": `100%`,
                "height": `100%`,
                "overflow-x": `auto`,
                "overflow-y": `auto`,
                "color": `white`,
            });
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            this.books = new Books({
                browser: this,
                name: `Books`,
            });
            this.Add_Child(this.books);
        });
    }
    Root() {
        return this.root;
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
}
class Books extends Entity.Instance {
    constructor({ browser, name, }) {
        super(`div`, browser.Event_Grid());
        this.browser = browser;
        this.name = name;
        this.path = `${browser.Path()}/${name}`;
        this.info = null;
        this.books = [];
    }
    On_Life() {
        return __awaiter(this, void 0, void 0, function* () {
            const info_response = yield fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
            if (info_response.ok) {
                this.info = JSON.parse(yield info_response.text());
            }
            return [];
        });
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            if (this.info) {
                for (const name of this.info.folder_names) {
                    const book = new Book({
                        books: this,
                        name: name,
                    });
                    this.books.push(book);
                    this.Add_Child(book);
                }
            }
        });
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
}
class Book extends Entity.Instance {
    constructor({ books, name, }) {
        super(`div`, books.Event_Grid());
        this.books = books;
        this.name = name;
        this.path = `${books.Path()}/${name}`;
        this.languages = null;
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            this.languages = new Languages({
                book: this,
                name: `Languages`,
            });
            this.Add_Child(this.languages);
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
}
class Languages extends Entity.Instance {
    constructor({ book, name, }) {
        super(`div`, book.Event_Grid());
        this.book = book;
        this.name = name;
        this.path = `${book.Path()}/${name}`;
        this.info = null;
        this.languages = [];
    }
    On_Life() {
        return __awaiter(this, void 0, void 0, function* () {
            const info_response = yield fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
            if (info_response.ok) {
                this.info = JSON.parse(yield info_response.text());
            }
            return [];
        });
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            if (this.info) {
                for (const name of this.info.folder_names) {
                    const language = new Language({
                        languages: this,
                        name: name,
                    });
                    this.languages.push(language);
                    this.Add_Child(language);
                }
            }
        });
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
}
class Language extends Entity.Instance {
    constructor({ languages, name, }) {
        super(`div`, languages.Event_Grid());
        this.languages = languages;
        this.name = name;
        this.path = `${languages.Path()}/${name}`;
        this.versions = null;
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            this.versions = new Versions({
                language: this,
                name: `Versions`,
            });
            this.Add_Child(this.versions);
        });
    }
    Languages() {
        return this.languages;
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
}
class Versions extends Entity.Instance {
    constructor({ language, name, }) {
        super(`div`, language.Event_Grid());
        this.language = language;
        this.name = name;
        this.path = `${language.Path()}/${name}`;
        this.info = null;
        this.versions = [];
    }
    On_Life() {
        return __awaiter(this, void 0, void 0, function* () {
            const info_response = yield fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
            if (info_response.ok) {
                this.info = JSON.parse(yield info_response.text());
            }
            return [];
        });
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            if (this.info) {
                for (const name of this.info.folder_names) {
                    const version = new Version({
                        versions: this,
                        name: name,
                    });
                    this.versions.push(version);
                    this.Add_Child(version);
                }
            }
        });
    }
    Language() {
        return this.language;
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
}
class Version extends Entity.Instance {
    constructor({ versions, name, }) {
        super(`div`, versions.Event_Grid());
        this.versions = versions;
        this.name = name;
        this.path = `${versions.Path()}/${name}`;
        this.files = null;
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            this.files = new Files({
                version: this,
                name: `Files`,
            });
            this.Add_Child(this.files);
        });
    }
    Versions() {
        return this.versions;
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
}
class Files extends Entity.Instance {
    constructor({ version, name, }) {
        super(`div`, version.Event_Grid());
        this.version = version;
        this.name = name;
        this.path = `${version.Path()}/${name}`;
        this.info = null;
        this.files = [];
    }
    On_Life() {
        return __awaiter(this, void 0, void 0, function* () {
            const info_response = yield fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
            if (info_response.ok) {
                this.info = JSON.parse(yield info_response.text());
            }
            return [];
        });
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            if (this.info) {
                for (const name of this.info.file_names) {
                    const file = new File({
                        files: this,
                        name: name,
                    });
                    this.files.push(file);
                    this.Add_Child(file);
                }
            }
        });
    }
    Version() {
        return this.version;
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
}
class File extends Entity.Instance {
    constructor({ files, name, }) {
        super(`div`, files.Event_Grid());
        this.files = files;
        this.name = name;
        this.path = `${files.Path()}/${name}`;
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            this.Add_Child(new Line({ text: this.Name() }));
            this.Add_Child(new Line({ text: `` }));
            const file_response = yield fetch(Utils.Resolve_Path(this.Path()));
            if (file_response.ok) {
                const file_text = yield file_response.text();
                for (const file_line of file_text.split(/\r?\n/g)) {
                    this.Add_Child(new Line({ text: file_line }));
                }
                this.Add_Child(new Line({ text: `` }));
            }
        });
    }
    Files() {
        return this.files;
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
}
class Lines extends Entity.Instance {
    constructor() {
        super(`div`, new Event.Grid());
    }
}
class Line extends Entity.Instance {
    constructor({ text, }) {
        super(`div`, new Event.Grid());
        this.text = text;
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return ({
                "color": this.text === `` ?
                    `transparent` :
                    `inherit`,
            });
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.text === ``) {
                this.Element().textContent = `_`;
            }
            else {
                this.Element().textContent = this.text.replaceAll(/  /g, `  `);
            }
        });
    }
}
class Word extends Entity.Instance {
    constructor() {
        super(`span`, new Event.Grid());
    }
}
class Break extends Entity.Instance {
    constructor() {
        super(`span`, new Event.Grid());
    }
}
const body = new Body();
window.addEventListener(`beforeunload`, function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        yield body.Die();
    });
});
