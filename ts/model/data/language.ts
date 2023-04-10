import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Book from "./book.js";
import * as Version from "./version.js";

export type Branch = {
    name: Name,
    versions: Array<Version.Branch>,
};

export class Instance
{
    private book: Book.Instance;
    private name: Name;
    private path: Path;
    private versions: Array<Version.Instance>;

    constructor(
        {
            book,
            branch,
        }: {
            book: Book.Instance,
            branch: Branch,
        },
    )
    {
        this.book = book;
        this.name = branch.name;
        this.path = `${book.Path()}/${branch.name}`;
        this.versions = [];
        for (const version_branch of branch.versions) {
            this.versions.push(
                new Version.Instance(
                    {
                        language: this,
                        branch: version_branch,
                    },
                ),
            );
        }
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

    Version(
        version_name: Name,
    ):
        Version.Instance
    {
        for (const version of this.versions) {
            if (version.Name() === version_name) {
                return version;
            }
        }

        Utils.Assert(
            false,
            `Invalid version_name.`,
        );

        return this.versions[0];
    }

    Version_Count():
        Count
    {
        return this.versions.length;
    }

    Version_At(
        version_index: Index,
    ):
        Version.Instance
    {
        Utils.Assert(
            version_index > -1,
            `version_index must be greater than -1.`,
        );
        Utils.Assert(
            version_index < this.Version_Count(),
            `version_index must be less than version_count.`,
        );

        return this.versions[version_index];
    }

    Versions():
        Array<Version.Instance>
    {
        return Array.from(this.versions);
    }
}
