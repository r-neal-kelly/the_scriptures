import * as Utils from "../../../utils.js";
import * as Event from "../../../event.js";
import * as Entity from "../../../entity.js";

import * as Model from "../../../model/browser/data/file.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;

    constructor(
        {
            model,
        }: {
            model: Model.Instance,
        },
    )
    {
        super(`div`, new Event.Grid());

        this.model = model;
    }

    override async On_Refresh():
        Promise<void>
    {
        this.Abort_All_Children();

        this.Adopt_Child(new Line({ text: this.Model().Name() }));
        this.Adopt_Child(new Line({ text: `` }));

        const file_response: Response =
            await fetch(Utils.Resolve_Path(this.Model().Path()));
        if (file_response.ok) {
            const file_text: string = await file_response.text();
            for (const file_line of file_text.split(/\r?\n/g)) {
                this.Adopt_Child(new Line({ text: file_line }));
            }
            this.Adopt_Child(new Line({ text: `` }));
        }
    }

    Model():
        Model.Instance
    {
        return this.model;
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
        Promise<Entity.Styles | string>
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
