import * as Entity from "../../entity.js";

import * as Model from "../../model/browser/languages.js";

import * as Book from "./book.js";
import * as Language from "./language.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;
    private book: Book.Instance;
    private languages: Array<Language.Instance>;

    constructor(
        {
            model,
            book,
        }: {
            model: Model.Instance,
            book: Book.Instance,
        },
    )
    {
        super(`div`, book.Event_Grid());

        this.model = model;
        this.book = book;
        this.languages = [];
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        for (const language_model of await this.Model().Languages()) {
            const language_view: Language.Instance = new Language.Instance(
                {
                    model: language_model,
                    languages: this,
                },
            );
            this.languages.push(language_view);
            this.Add_Child(language_view);
        }
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Book():
        Book.Instance
    {
        return this.book;
    }
}
