import { Name } from "../../../types.js";
import { Path } from "../../../types.js";

import * as Browser from "../instance.js";
import * as Books from "./books.js";
import * as Book from "./book.js";
import * as Language from "./language.js";
import * as Version from "./version.js";
import * as Files from "./files.js";

export class Instance
{
    private browser: Browser.Instance;
    private name: Name;
    private path: Path;
    private books: Books.Instance;

    private book_names: Array<Name> | null;
    private language_names: Array<Name> | null;
    private version_names: Array<Name> | null;

    constructor(
        {
            browser,
        }: {
            browser: Browser.Instance,
        },
    )
    {
        this.browser = browser;
        this.name = `Browser`;
        this.path = this.name;
        this.books = new Books.Instance(
            {
                data: this,
            },
        );

        this.book_names = null;
        this.language_names = null;
        this.version_names = null;
    }

    Browser():
        Browser.Instance
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

    Books():
        Books.Instance
    {
        return this.books;
    }

    // we should probably have this info cached in a downloaded info file
    private async Cache_Names():
        Promise<void>
    {
        if (
            this.book_names == null ||
            this.language_names == null ||
            this.version_names == null
        ) {
            const book_names: Set<Name> = new Set();
            const language_names: Set<Name> = new Set();
            const version_names: Set<Name> = new Set();

            for (const book of await this.Books().Array()) {
                book_names.add(book.Name());
                for (const language of await book.Languages().Array()) {
                    language_names.add(language.Name());
                    for (const version of await language.Versions().Array()) {
                        version_names.add(version.Name());
                    }
                }
            }

            this.book_names = Array.from(book_names).sort();
            this.language_names = Array.from(language_names).sort();
            this.version_names = Array.from(version_names).sort();
        }
    }

    // we should have an option on how the names are sorted
    async Book_Names():
        Promise<Array<Name>>
    {
        if (this.book_names == null) {
            await this.Cache_Names();
        }

        return Array.from(this.book_names as Array<Name>);
    }

    async Language_Names():
        Promise<Array<Name>>
    {
        if (this.language_names == null) {
            await this.Cache_Names();
        }

        return Array.from(this.language_names as Array<Name>);
    }

    async Version_Names():
        Promise<Array<Name>>
    {
        if (this.version_names == null) {
            await this.Cache_Names();
        }

        return Array.from(this.version_names as Array<Name>);
    }

    async Files(
        {
            book_name,
            language_name,
            version_name,
        }: {
            book_name: Name,
            language_name: Name,
            version_name: Name,
        }
    ):
        Promise<Files.Instance>
    {
        const book: Book.Instance = await this.Books().Get(book_name);
        const language: Language.Instance = await book.Languages().Get(language_name);
        const version: Version.Instance = await language.Versions().Get(version_name);

        return version.Files();
    }
}
