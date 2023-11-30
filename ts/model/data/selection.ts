import * as Types from "../../types.js";

import * as Utils from "../../utils.js";

export class Name
{
    private book: Types.Name | null;
    private language: Types.Name | null;
    private version: Types.Name | null;
    private file: Types.Name | null;

    constructor(
        {
            book,
            language,
            version,
            file,
        }: {
            book: Types.Name | null;
            language: Types.Name | null;
            version: Types.Name | null;
            file: Types.Name | null;
        },
    )
    {
        this.book = book;
        this.language = language;
        this.version = version;
        this.file = file;

        Object.freeze(this);
    }

    Has_Book():
        boolean
    {
        return this.book != null;
    }

    Book():
        Types.Name
    {
        Utils.Assert(
            this.Has_Book(),
            `doesn't have book`,
        );

        return this.book as Types.Name;
    }

    Has_Language():
        boolean
    {
        return this.language != null;
    }

    Language():
        Types.Name
    {
        Utils.Assert(
            this.Has_Language(),
            `doesn't have language`,
        );

        return this.language as Types.Name;
    }

    Has_Version():
        boolean
    {
        return this.version != null;
    }

    Version():
        Types.Name
    {
        Utils.Assert(
            this.Has_Version(),
            `doesn't have version`,
        );

        return this.version as Types.Name;
    }

    Has_File():
        boolean
    {
        return this.file != null;
    }

    File():
        Types.Name
    {
        Utils.Assert(
            this.Has_File(),
            `doesn't have file`,
        );

        return this.file as Types.Name;
    }
}

export class Index
{
    private book: Types.Index | null;
    private language: Types.Index | null;
    private version: Types.Index | null;
    private file: Types.Index | null;

    constructor(
        {
            book,
            language,
            version,
            file,
        }: {
            book: Types.Index | null;
            language: Types.Index | null;
            version: Types.Index | null;
            file: Types.Index | null;
        },
    )
    {
        this.book = book;
        this.language = language;
        this.version = version;
        this.file = file;

        Object.freeze(this);
    }

    Has_Book():
        boolean
    {
        return this.book != null;
    }

    Book():
        Types.Index
    {
        Utils.Assert(
            this.Has_Book(),
            `doesn't have book`,
        );

        return this.book as Types.Index;
    }

    Has_Language():
        boolean
    {
        return this.language != null;
    }

    Language():
        Types.Index
    {
        Utils.Assert(
            this.Has_Language(),
            `doesn't have language`,
        );

        return this.language as Types.Index;
    }

    Has_Version():
        boolean
    {
        return this.version != null;
    }

    Version():
        Types.Index
    {
        Utils.Assert(
            this.Has_Version(),
            `doesn't have version`,
        );

        return this.version as Types.Index;
    }

    Has_File():
        boolean
    {
        return this.file != null;
    }

    File():
        Types.Index
    {
        Utils.Assert(
            this.Has_File(),
            `doesn't have file`,
        );

        return this.file as Types.Index;
    }
}
