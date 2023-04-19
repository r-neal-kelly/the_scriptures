import * as Event from "../../../event.js";

import * as Model from "../../../model/finder.js";

import * as Entity from "../../entity.js";

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
        return [];
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        this.Element().textContent = model.Commander().Filter_Visibility().Symbol();
    }

    override On_Reclass():
        Array<string>
    {
        return [`Filter_Visibility`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }
}
