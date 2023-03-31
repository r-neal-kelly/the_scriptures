import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Data from "./instance.js";
import * as Book from "./book.js";

type Info = {
    names: Array<Name>,
}

export class Instance
{
    private data: Data.Instance;
    private name: Name;
    private path: Path;
    private info: Info | null;
    private books: Array<Book.Instance>;

    constructor(
        {
            data,
        }: {
            data: Data.Instance,
        },
    )
    {
        this.data = data;
        this.name = `Books`;
        this.path = `${data.Path()}/${this.name}`;
        this.info = null;
        this.books = [];
    }

    Data():
        Data.Instance
    {
        return this.data;
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

    private async Info():
        Promise<Info>
    {
        await this.Download();

        if (this.info != null) {
            return this.info;
        } else {
            return (
                {
                    names: [],
                }
            );
        }
    }

    async Count():
        Promise<Count>
    {
        await this.Download();

        return this.books.length;
    }

    async At(
        book_index: Index,
    ):
        Promise<Book.Instance>
    {
        await this.Download();

        Utils.Assert(
            book_index > -1,
            `book_index must be greater than -1.`,
        );
        Utils.Assert(
            book_index < await this.Count(),
            `book_index must be less than book_count.`,
        );

        return this.books[book_index];
    }

    async Get(
        book_name: Name,
    ):
        Promise<Book.Instance>
    {
        await this.Download();

        for (const book of this.books) {
            if (book.Name() === book_name) {
                return book;
            }
        }

        Utils.Assert(
            false,
            `Invalid book_name.`,
        );

        return this.books[0];
    }

    async Array():
        Promise<Array<Book.Instance>>
    {
        await this.Download();

        return Array.from(this.books);
    }

    private async Download():
        Promise<void>
    {
        if (this.info == null) {
            const response: Response =
                await fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
            if (response.ok) {
                this.info = JSON.parse(await response.text()) as Info;

                for (const name of this.info.names) {
                    this.books.push(
                        new Book.Instance(
                            {
                                books: this,
                                name: name,
                            },
                        ),
                    );
                }
            }
        }
    }
}
