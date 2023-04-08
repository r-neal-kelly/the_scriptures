import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { Name } from "../../types.js";
import { Path } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Language from "./language.js";
import * as Version from "./version.js";

export type Info = {
    names: Array<Name>,
}

export class Instance
{
    private language: Language.Instance;
    private name: Name;
    private path: Path;
    private info: Info | null;
    private versions: Array<Version.Instance>;
    private is_downloading: boolean;

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
        this.is_downloading = false;
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

    async Count():
        Promise<Count>
    {
        await this.Download();

        return this.versions.length;
    }

    async At(
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
            version_index < await this.Count(),
            `version_index must be less than version_count.`,
        );

        return this.versions[version_index];
    }

    async Get(
        version_name: Name,
    ):
        Promise<Version.Instance>
    {
        await this.Download();

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

    async Array():
        Promise<Array<Version.Instance>>
    {
        await this.Download();

        return Array.from(this.versions);
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

        this.is_downloading = false;
    }
}
