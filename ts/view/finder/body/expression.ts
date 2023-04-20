import * as Event from "../../../event.js";

import * as Model from "../../../model/finder.js";

import * as Entity from "../../entity.js";
import * as Body from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            body,
            model,
        }: {
            body: Body.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: body,
                event_grid: body.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Element().setAttribute(`contentEditable`, `true`);
        this.Element().setAttribute(`spellcheck`, `false`);

        return [];
    }

    override On_Refresh():
        void
    {
    }

    override On_Reclass():
        Array<string>
    {
        return [`Expression`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Body():
        Body.Instance
    {
        return this.Parent() as Body.Instance;
    }
}
