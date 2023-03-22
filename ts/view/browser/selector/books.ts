import * as Entity from "../../entity.js";

import * as Model from "../../model/browser/books.js";

import * as Browser from "./instance.js";
import * as Book from "./book.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;
    private browser: Browser.Instance;
    private books: Array<Book.Instance>;

    constructor(
        {
            model,
            browser,
        }: {
            model: Model.Instance,
            browser: Browser.Instance,
        },
    )
    {
        super(`div`, browser.Event_Grid());

        this.model = model;
        this.browser = browser;
        this.books = [];
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        for (const book_model of await this.Model().Books()) {
            const book_view: Book.Instance = new Book.Instance(
                {
                    model: book_model,
                    books: this,
                },
            );
            this.books.push(book_view);
            this.Add_Child(book_view);
        }
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Browser():
        Browser.Instance
    {
        return this.browser;
    }
}
