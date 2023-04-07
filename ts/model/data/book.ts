import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Books from "./books.js";
import * as Languages from "./languages.js";

export type Info = {
}

export class Instance
{
    private books: Books.Instance;
    private name: Name;
    private path: Path;
    private languages: Languages.Instance;

    constructor(
        {
            books,
            name,
        }: {
            books: Books.Instance,
            name: Name,
        },
    )
    {
        this.books = books;
        this.name = name;
        this.path = `${books.Path()}/${name}`;
        this.languages = new Languages.Instance(
            {
                book: this,
            },
        );
    }

    Books():
        Books.Instance
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

    Languages():
        Languages.Instance
    {
        return this.languages;
    }
}
