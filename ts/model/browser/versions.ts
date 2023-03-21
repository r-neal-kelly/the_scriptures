import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Language from "./language.js";
import * as Version from "./version.js";

type Info = {
    names: Array<Name>,
}

export class Instance
{
    private language: Language.Instance;
    private name: Name;
    private path: Path;
    private info: Info | null;
    private versions: Array<Version.Instance>;

    constructor(
        {
            language,
        }: {
            language: Language.Instance,
        },
    )
    {
        this.language = language;
        this.name = `Versions`;
        this.path = `${language.Path()}/${this.name}`;
        this.info = null;
        this.versions = [];
    }

    Language():
        Language.Instance
    {
        return this.language;
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

    async Version_Count():
        Promise<Count>
    {
        await this.Download();

        return this.versions.length;
    }

    async Version(
        version_index: Index,
    ):
        Promise<Version.Instance>
    {
        await this.Download();

        Utils.Assert(
            version_index > -1,
            `version_index must be greater than -1.`,
        );
        Utils.Assert(
            version_index < await this.Version_Count(),
            `version_index must be less than version_count.`,
        );

        return this.versions[version_index];
    }

    async Versions():
        Promise<Array<Version.Instance>>
    {
        await this.Download();

        return Array.from(this.versions);
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
                    this.versions.push(
                        new Version.Instance(
                            {
                                versions: this,
                                name: name,
                            },
                        ),
                    );
                }
            }
        }
    }
}
