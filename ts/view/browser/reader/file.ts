import * as Utils from "../../../utils.js";
import * as Event from "../../../event.js";
import * as Entity from "../../../entity.js";

import * as Model from "../../../model/browser/reader/file.js";

import * as Reader from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;

    constructor(
        {
            model,
            reader,
        }: {
            model: Model.Instance,
            reader: Reader.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: reader,
                event_grid: reader.Event_Grid()
            },
        );

        this.model = model;
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return `
            width: 100%;
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        this.Abort_All_Children();

        this.Adopt_Child(new Line({ text: this.Model().Data().Title() }));
        this.Adopt_Child(new Line({ text: `` }));

        for (const file_line of this.Model().Text().split(/\r?\n/g)) {
            this.Adopt_Child(new Line({ text: file_line }));
        }
        this.Adopt_Child(new Line({ text: `` }));
    }

    Model():
        Model.Instance
    {
        return this.model;
    }
}

// this class needs to be moved to its own file
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
        super(
            {
                element: `div`,
                parent: null,
                event_grid: new Event.Grid()
            },
        );

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
