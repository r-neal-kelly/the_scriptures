import * as Event from "../../../../../event.js";

import * as Model from "../../../../../model/finder/body/instance.js";

import * as Entity from "../../../../entity.js";
import * as Results from "../instance.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            results,
            model,
        }: {
            results: Results.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: results,
                event_grid: results.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        return [];
    }

    override On_Refresh():
        void
    {
    }

    override On_Reclass():
        Array<string>
    {
        return [`Tree`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Results():
        Results.Instance
    {
        return this.Parent() as Results.Instance;
    }
}
