import * as Utils from "../../utils.js";
import * as Entity from "../../entity.js";

import * as Model from "../../model/browser/version.js";

import * as Versions from "./versions.js";
import * as Files from "./files.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;
    private versions: Versions.Instance;
    private files: Files.Instance | null;

    constructor(
        {
            model,
            versions,
        }: {
            model: Model.Instance,
            versions: Versions.Instance,
        },
    )
    {
        super(`div`, versions.Event_Grid());

        this.model = model;
        this.versions = versions;
        this.files = null;
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        this.files = new Files.Instance(
            {
                model: this.Model().Files(),
                version: this,
            },
        );
        this.Add_Child(this.files);
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Versions():
        Versions.Instance
    {
        return this.versions;
    }

    Files():
        Files.Instance
    {
        Utils.Assert(
            this.files != null,
            `Does not have files.`,
        );

        return this.files as Files.Instance;
    }
}
