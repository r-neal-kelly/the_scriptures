import * as Utils from "../../utils.js";
import * as Entity from "../../entity.js";

import * as Model from "../../model/browser/language.js";

import * as Languages from "./languages.js";
import * as Versions from "./versions.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;
    private languages: Languages.Instance;
    private versions: Versions.Instance | null;

    constructor(
        {
            model,
            languages,
        }: {
            model: Model.Instance,
            languages: Languages.Instance,
        },
    )
    {
        super(`div`, languages.Event_Grid());

        this.model = model;
        this.languages = languages;
        this.versions = null;
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        this.versions = new Versions.Instance(
            {
                model: this.Model().Versions(),
                language: this,
            },
        );
        this.Add_Child(this.versions);
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Languages():
        Languages.Instance
    {
        return this.languages;
    }

    Versions():
        Versions.Instance
    {
        Utils.Assert(
            this.versions != null,
            `Does not have versions.`,
        );

        return this.versions as Versions.Instance;
    }
}
