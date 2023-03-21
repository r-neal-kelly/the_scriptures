import * as Entity from "../../entity.js";

import * as Model from "../../model/browser/files.js";

import * as Version from "./version.js";
import * as File from "./file.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;
    private version: Version.Instance;
    private files: Array<File.Instance>;

    constructor(
        {
            model,
            version,
        }: {
            model: Model.Instance,
            version: Version.Instance,
        },
    )
    {
        super(`div`, version.Event_Grid());

        this.model = model;
        this.version = version;
        this.files = [];
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        for (const file_model of await this.Model().Files()) {
            const file_view: File.Instance = new File.Instance(
                {
                    model: file_model,
                    files: this,
                },
            );
            this.files.push(file_view);
            this.Add_Child(file_view);
        }
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Version():
        Version.Instance
    {
        return this.version;
    }
}
