import * as Utils from "../../utils.js";
import * as Event from "../../event.js";
import * as Entity from "../../entity.js";

import * as Model from "../../model/browser/file.js";

import * as Files from "./files.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;
    private files: Files.Instance;

    constructor(
        {
            model,
            files,
        }: {
            model: Model.Instance,
            files: Files.Instance,
        },
    )
    {
        super(`div`, files.Event_Grid());

        this.model = model;
        this.files = files;
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        this.Add_Child(new Line({ text: this.Model().Name() }));
        this.Add_Child(new Line({ text: `` }));

        const file_response: Response =
            await fetch(Utils.Resolve_Path(this.Model().Path()));
        if (file_response.ok) {
            const file_text: string = await file_response.text();
            for (const file_line of file_text.split(/\r?\n/g)) {
                this.Add_Child(new Line({ text: file_line }));
            }
            this.Add_Child(new Line({ text: `` }));
        }
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Files():
        Files.Instance
    {
        return this.files;
    }
}

// this class is temporary, for testing
class Line extends Entity.Instance
{
    private text: string;

    constructor(
        {
            text,
        }: {
            text: string,
        },
    )
    {
        super(`div`, new Event.Grid());

        this.text = text;
    }

    override async On_Restyle():
        Promise<Entity.Styles>
    {
        return ({
            "color": this.text === `` ?
                `transparent` :
                `inherit`,
        });
    }

    override async On_Refresh():
        Promise<void>
    {
        if (this.text === ``) {
            this.Element().textContent = `_`;
        } else {
            this.Element().textContent = this.text.replaceAll(/  /g, `  `);
        }
    }
}