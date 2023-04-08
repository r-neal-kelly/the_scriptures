import * as Types from "../../../types.js";

export class Name
{
    private book: Types.Name;
    private language: Types.Name;
    private version: Types.Name;

    constructor(
        {
            book,
            language,
            version,
        }: {
            book: Types.Name;
            language: Types.Name;
            version: Types.Name;
        },
    )
    {
        this.book = book;
        this.language = language;
        this.version = version;

        Object.freeze(this);
    }

    Book():
        Types.Name
    {
        return this.book;
    }

    Language():
        Types.Name
    {
        return this.language;
    }

    Version():
        Types.Name
    {
        return this.version;
    }

    String():
        Types.Name
    {
        return `${this.Book()} - ${this.Language()} - ${this.Version()}`;
    }
}
