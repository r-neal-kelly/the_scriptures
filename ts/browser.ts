import { Name } from "./types.js"
import { Path } from "./types.js"

import * as Utils from "./utils.js"
import * as Entity from "./entity.js"

class Body extends Entity.Instance
{
    private browser: Browser | null;

    constructor()
    {
        super(document.body as HTMLBodyElement);

        this.browser = null;
    }

    override async On_Life():
        Promise<void>
    {
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
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        this.browser = new Browser({
            body: this,
            name: `Browser`,
        });

        this.Add_Child(this.browser);
    }

    Document():
        Document
    {
        return document;
    }

    Name():
        Name
    {
        return ``;
    }

    Path():
        Path
    {
        return ``;
    }
}

class Browser extends Entity.Instance
{
    private body: Body;
    private name: Name;
    private path: Path;
    private books: Books | null;

    constructor(
        {
            body,
            name,
        }: {
            body: Body,
            name: Name,
        }
    )
    {
        super(`div`);

        this.body = body;
        this.name = name;
        this.path = `${body.Path()}/${name}`;
        this.books = null;
    }

    override async On_Restyle():
        Promise<Entity.Styles>
    {
        return ({
            "display": `grid`,

            "width": `100%`,
            "height": `100%`,

            "overflow-x": `auto`, // hidden
            "overflow-y": `auto`, // hidden

            "color": `white`,
        });
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        this.books = new Books({
            browser: this,
            name: `Books`,
        });

        this.Add_Child(this.books);
    }

    Body():
        Body
    {
        return this.body;
    }

    Name():
        Name
    {
        return this.name;
    }

    Path():
        Path
    {
        return this.path;
    }
}

type Books_Info = {
    folder_names: Array<Name>,
}

class Books extends Entity.Instance
{
    private browser: Browser;
    private name: Name;
    private path: Path;
    private info: Books_Info | null;
    private books: Array<Book>;

    constructor(
        {
            browser,
            name,
        }: {
            browser: Browser,
            name: Name,
        }
    )
    {
        super(`div`);

        this.browser = browser;
        this.name = name;
        this.path = `${browser.Path()}/${name}`;
        this.info = null;
        this.books = [];
    }

    override async On_Life():
        Promise<void>
    {
        const info_response: Response =
            await fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
        if (info_response.ok) {
            this.info = JSON.parse(await info_response.text());
        }
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return `
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        if (this.info) {
            for (const name of this.info.folder_names) {
                const book: Book = new Book({
                    books: this,
                    name: name,
                });
                this.books.push(book);

                this.Add_Child(book);
            }
        }
    }

    Browser():
        Browser
    {
        return this.browser;
    }

    Name():
        Name
    {
        return this.name;
    }

    Path():
        Path
    {
        return this.path;
    }
}

class Book extends Entity.Instance
{
    private books: Books;
    private name: Name;
    private path: Path;
    private languages: Languages | null;

    constructor(
        {
            books,
            name,
        }: {
            books: Books,
            name: Name,
        }
    )
    {
        super(`div`);

        this.books = books;
        this.name = name;
        this.path = `${books.Path()}/${name}`;
        this.languages = null;
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return `
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        this.languages = new Languages({
            book: this,
            name: `Languages`,
        });

        this.Add_Child(this.languages);
    }

    Books():
        Books
    {
        return this.books;
    }

    Name():
        Name
    {
        return this.name;
    }

    Path():
        Path
    {
        return this.path;
    }
}

type Languages_Info = {
    folder_names: Array<Name>,
}

class Languages extends Entity.Instance
{
    private book: Book;
    private name: Name;
    private path: Path;
    private info: Languages_Info | null;
    private languages: Array<Language>;

    constructor(
        {
            book,
            name,
        }: {
            book: Book,
            name: Name,
        }
    )
    {
        super(`div`);

        this.book = book;
        this.name = name;
        this.path = `${book.Path()}/${name}`;
        this.info = null;
        this.languages = [];
    }

    override async On_Life():
        Promise<void>
    {
        const info_response: Response =
            await fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
        if (info_response.ok) {
            this.info = JSON.parse(await info_response.text());
        }
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return `
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        if (this.info) {
            for (const name of this.info.folder_names) {
                const language: Language = new Language({
                    languages: this,
                    name: name,
                });
                this.languages.push(language);

                this.Add_Child(language);
            }
        }
    }

    Book():
        Book
    {
        return this.book;
    }

    Name():
        Name
    {
        return this.name;
    }

    Path():
        Path
    {
        return this.path;
    }
}

class Language extends Entity.Instance
{
    private languages: Languages;
    private name: Name;
    private path: Path;
    private versions: Versions | null;

    constructor(
        {
            languages,
            name,
        }: {
            languages: Languages,
            name: Name,
        }
    )
    {
        super(`div`);

        this.languages = languages;
        this.name = name;
        this.path = `${languages.Path()}/${name}`;
        this.versions = null;
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return `
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        this.versions = new Versions({
            language: this,
            name: `Versions`,
        });

        this.Add_Child(this.versions);
    }

    Languages():
        Languages
    {
        return this.languages;
    }

    Name():
        Name
    {
        return this.name;
    }

    Path():
        Path
    {
        return this.path;
    }
}

type Versions_Info = {
    folder_names: Array<Name>,
}

class Versions extends Entity.Instance
{
    private language: Language;
    private name: Name;
    private path: Path;
    private info: Versions_Info | null;
    private versions: Array<Version>;

    constructor(
        {
            language,
            name,
        }: {
            language: Language,
            name: Name,
        }
    )
    {
        super(`div`);

        this.language = language;
        this.name = name;
        this.path = `${language.Path()}/${name}`;
        this.info = null;
        this.versions = [];
    }

    override async On_Life():
        Promise<void>
    {
        const info_response: Response =
            await fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
        if (info_response.ok) {
            this.info = JSON.parse(await info_response.text());
        }
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return `
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        if (this.info) {
            for (const name of this.info.folder_names) {
                const version: Version = new Version({
                    versions: this,
                    name: name,
                });
                this.versions.push(version);

                this.Add_Child(version);
            }
        }
    }

    Language():
        Language
    {
        return this.language;
    }

    Name():
        Name
    {
        return this.name;
    }

    Path():
        Path
    {
        return this.path;
    }
}

class Version extends Entity.Instance
{
    private versions: Versions;
    private name: Name;
    private path: Path;
    private files: Files | null;

    constructor(
        {
            versions,
            name,
        }: {
            versions: Versions,
            name: Name,
        }
    )
    {
        super(`div`);

        this.versions = versions;
        this.name = name;
        this.path = `${versions.Path()}/${name}`;
        this.files = null;
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return `
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        this.files = new Files({
            version: this,
            name: `Files`,
        });

        this.Add_Child(this.files);
    }

    Versions():
        Versions
    {
        return this.versions;
    }

    Name():
        Name
    {
        return this.name;
    }

    Path():
        Path
    {
        return this.path;
    }
}

type Files_Info = {
    file_names: Array<Name>,
}

class Files extends Entity.Instance
{
    private version: Version;
    private name: Name;
    private path: Path;
    private info: Files_Info | null;
    private files: Array<File>;

    constructor(
        {
            version,
            name,
        }: {
            version: Version,
            name: Name,
        }
    )
    {
        super(`div`);

        this.version = version;
        this.name = name;
        this.path = `${version.Path()}/${name}`;
        this.info = null;
        this.files = [];
    }

    override async On_Life():
        Promise<void>
    {
        const info_response: Response =
            await fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
        if (info_response.ok) {
            this.info = JSON.parse(await info_response.text());
        }
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return `
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        if (this.info) {
            for (const name of this.info.file_names) {
                const file: File = new File({
                    files: this,
                    name: name,
                });
                this.files.push(file);

                this.Add_Child(file);
            }
        }
    }

    Version():
        Version
    {
        return this.version;
    }

    Name():
        Name
    {
        return this.name;
    }

    Path():
        Path
    {
        return this.path;
    }
}

class File extends Entity.Instance
{
    private files: Files;
    private name: Name;
    private path: Path;

    constructor(
        {
            files,
            name,
        }: {
            files: Files,
            name: Name,
        }
    )
    {
        super(`div`);

        this.files = files;
        this.name = name;
        this.path = `${files.Path()}/${name}`;
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return `
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        this.Add_Child(new Line(this.Name()));
        this.Add_Child(new Line(``));

        const file_response: Response =
            await fetch(Utils.Resolve_Path(this.Path()));
        if (file_response.ok) {
            const file_text: string = await file_response.text();
            for (const file_line of file_text.split(/\r?\n/g)) {
                this.Add_Child(new Line(file_line));
            }
            this.Add_Child(new Line(``));
        }
    }

    Files():
        Files
    {
        return this.files;
    }

    Name():
        Name
    {
        return this.name;
    }

    Path():
        Path
    {
        return this.path;
    }
}

class Lines extends Entity.Instance
{
    constructor()
    {
        super(`div`);
    }
}

class Line extends Entity.Instance
{
    private text: string;

    constructor(
        text: string,
    )
    {
        super(`div`);

        this.text = text;
    }

    override async On_Restyle():
        Promise<Entity.Styles>
    {
        return ({
            "color": this.text === `` ?
                `transparent` :
                `inherit`,
        });
    }

    override async On_Refresh():
        Promise<void>
    {
        if (this.text === ``) {
            this.Element().textContent = `_`;
        } else {
            this.Element().textContent = this.text.replaceAll(/  /g, `  `);
        }
    }
}

class Word extends Entity.Instance
{
    constructor()
    {
        super(`span`);
    }
}

class Break extends Entity.Instance
{
    constructor()
    {
        super(`span`);
    }
}

const body: Body = new Body();

window.addEventListener(
    `beforeunload`,
    async function (
        event: BeforeUnloadEvent,
    ):
        Promise<void>
    {
        await body.Die();
    }
)
