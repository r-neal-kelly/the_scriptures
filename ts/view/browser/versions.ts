import * as Entity from "../../entity.js";

import * as Model from "../../model/browser/versions.js";

import * as Language from "./language.js";
import * as Version from "./version.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;
    private language: Language.Instance;
    private versions: Array<Version.Instance>;

    constructor(
        {
            model,
            language,
        }: {
            model: Model.Instance,
            language: Language.Instance,
        },
    )
    {
        super(`div`, language.Event_Grid());

        this.model = model;
        this.language = language;
        this.versions = [];
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        for (const version_model of await this.Model().Versions()) {
            const version_view: Version.Instance = new Version.Instance(
                {
                    model: version_model,
                    versions: this,
                },
            );
            this.versions.push(version_view);
            this.Add_Child(version_view);
        }
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Language():
        Language.Instance
    {
        return this.language;
    }
}
