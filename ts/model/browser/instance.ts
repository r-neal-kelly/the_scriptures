import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Books from "./books.js";

export class Instance
{
    private name: Name;
    private path: Path;
    private books: Books.Instance;

    constructor()
    {
        this.name = `Browser`;
        this.path = this.name;
        this.books = new Books.Instance(
            {
                browser: this,
            },
        );
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
}
