import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Data from "./instance.js";
import * as Language from "./language.js";

export type Branch = {
    name: Name,
    languages: Array<Language.Branch>,
};

export class Instance
{
    private data: Data.Instance;
    private name: Name;
    private path: Path;
    private languages: Array<Language.Instance>;

    constructor(
        {
            data,
            branch,
        }: {
            data: Data.Instance,
            branch: Branch,
        },
    )
    {
        this.data = data;
        this.name = branch.name;
        this.path = `${data.Books_Path()}/${branch.name}`;
        this.languages = [];
        for (const language_branch of branch.languages) {
            this.languages.push(
                new Language.Instance(
                    {
                        book: this,
                        branch: language_branch,
                    },
                ),
            );
        }
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

    Language(
        language_name: Name,
    ):
        Language.Instance
    {
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

    Language_Count():
        Count
    {
        return this.languages.length;
    }

    Language_At(
        language_index: Index,
    ):
        Language.Instance
    {
        Utils.Assert(
            language_index > -1,
            `language_index must be greater than -1.`,
        );
        Utils.Assert(
            language_index < this.Language_Count(),
            `language_index must be less than language_count.`,
        );

        return this.languages[language_index];
    }

    Languages():
        Array<Language.Instance>
    {
        return Array.from(this.languages);
    }
}
