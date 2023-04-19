import * as Types from "../../types.js";

export class Name
{
    private book: Types.Name;
    private language: Types.Name;
    private version: Types.Name;
    private file: Types.Name;

    constructor(
        {
            book,
            language,
            version,
            file,
        }: {
            book: Types.Name;
            language: Types.Name;
            version: Types.Name;
            file: Types.Name;
        },
    )
    {
        this.book = book;
        this.language = language;
        this.version = version;
        this.file = file;

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

    File():
        Types.Name
    {
        return this.file;
    }
}

export class Index
{
    private book: Types.Index;
    private language: Types.Index;
    private version: Types.Index;
    private file: Types.Index;

    constructor(
        {
            book,
            language,
            version,
            file,
        }: {
            book: Types.Index;
            language: Types.Index;
            version: Types.Index;
            file: Types.Index;
        },
    )
    {
        this.book = book;
        this.language = language;
        this.version = version;
        this.file = file;

        Object.freeze(this);
    }

    Book():
        Types.Index
    {
        return this.book;
    }

    Language():
        Types.Index
    {
        return this.language;
    }

    Version():
        Types.Index
    {
        return this.version;
    }

    File():
        Types.Index
    {
        return this.file;
    }
}
