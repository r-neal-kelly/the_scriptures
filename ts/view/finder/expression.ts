import * as Utils from "../../utils.js";
import * as Event from "../../event.js";

import * as Model from "../../model/finder/instance.js";
import * as Layout from "../../model/layout.js";

import * as Events from "../events.js";
import * as Entity from "../entity.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            parent,
        }: {
            model: () => Model.Instance,
            parent: Entity.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: parent,
                event_grid: parent.Event_Grid(),
            },
        );

        this.model = model;
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
}
