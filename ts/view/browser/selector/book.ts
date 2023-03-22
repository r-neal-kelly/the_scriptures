import * as Utils from "../../utils.js";
import * as Entity from "../../entity.js";

import * as Model from "../../model/browser/book.js";

import * as Books from "./books.js";
import * as Languages from "./languages.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;
    private books: Books.Instance;
    private languages: Languages.Instance | null;

    constructor(
        {
            model,
            books,
        }: {
            model: Model.Instance,
            books: Books.Instance,
        },
    )
    {
        super(`div`, books.Event_Grid());

        this.model = model;
        this.books = books;
        this.languages = null;
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        this.languages = new Languages.Instance(
            {
                model: this.Model().Languages(),
                book: this,
            },
        );
        this.Add_Child(this.languages);
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Books():
        Books.Instance
    {
        return this.books;
    }

    Languages():
        Languages.Instance
    {
        Utils.Assert(
            this.languages != null,
            `Does not have languages.`,
        );

        return this.languages as Languages.Instance;
    }
}
