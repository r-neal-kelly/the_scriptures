import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Book from "./book.js";
import * as Language from "./language.js";

export type Info = {
    names: Array<Name>,
}

export class Instance
{
    private book: Book.Instance;
    private name: Name;
    private path: Path;
    private info: Info | null;
    private languages: Array<Language.Instance>;
    private is_downloading: boolean;

    constructor(
        {
            book,
        }: {
            book: Book.Instance,
        },
    )
    {
        this.book = book;
        this.name = `Languages`;
        this.path = `${book.Path()}/${this.name}`;
        this.info = null;
        this.languages = [];
        this.is_downloading = false;
    }

    Book():
        Book.Instance
    {
        return this.book;
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

        return this.languages.length;
    }

    async At(
        language_index: Index,
    ):
        Promise<Language.Instance>
    {
        await this.Download();

        Utils.Assert(
            language_index > -1,
            `language_index must be greater than -1.`,
        );
        Utils.Assert(
            language_index < await this.Count(),
            `language_index must be less than language_count.`,
        );

        return this.languages[language_index];
    }

    async Get(
        language_name: Name,
    ):
        Promise<Language.Instance>
    {
        await this.Download();

        for (const language of this.languages) {
            if (language.Name() === language_name) {
                return language;
            }
        }

        Utils.Assert(
            false,
            `Invalid language_name.`,
        );

        return this.languages[0];
    }

    async Array():
        Promise<Array<Language.Instance>>
    {
        await this.Download();

        return Array.from(this.languages);
    }

    private async Download():
        Promise<void>
    {
        while (this.is_downloading) {
            await Utils.Wait_Milliseconds(1);
        }
        this.is_downloading = true;

        if (this.info == null) {
            const response: Response =
                await fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
            if (response.ok) {
                this.info = JSON.parse(await response.text()) as Info;

                for (const name of this.info.names) {
                    this.languages.push(
                        new Language.Instance(
                            {
                                languages: this,
                                name: name,
                            },
                        ),
                    );
                }
            }
        }

        this.is_downloading = false;
    }
}
