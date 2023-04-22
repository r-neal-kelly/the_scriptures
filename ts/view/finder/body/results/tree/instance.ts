import * as Utils from "../../../../../utils.js";
import * as Event from "../../../../../event.js";

import * as Model from "../../../../../model/finder/body/results/tree/instance.js";

import * as Entity from "../../../../entity.js";
import * as Results from "../instance.js";
import * as Root from "./branch.js";

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
        if (
            !this.Has_Root()
        ) {
            this.Abort_All_Children();

            new Root.Instance(
                {
                    parent: this,
                    model: () => this.Model().Root(),
                },
            );
        }
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

    Has_Root():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Root.Instance
        );
    }

    Root():
        Root.Instance
    {
        Utils.Assert(
            this.Has_Root(),
            `Does not have Root.`,
        );

        return this.Child(0) as Root.Instance;
    }
}
