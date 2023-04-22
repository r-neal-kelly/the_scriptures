import * as Utils from "../../../../../utils.js";
import * as Event from "../../../../../event.js";

import * as Model from "../../../../../model/finder/body/results/tree/branch.js";

import * as Entity from "../../../../entity.js";
import * as Branch from "./branch.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            branch,
            model,
        }: {
            branch: Branch.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: branch,
                event_grid: branch.Event_Grid(),
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
        this.Element().textContent = this.Model().Name();
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Branch_Name`);
        if (model.Is_Selected()) {
            classes.push(`Selected`);
        }

        return classes;
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Has_Branch():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Branch.Instance
        );
    }

    Branch():
        Branch.Instance
    {
        Utils.Assert(
            this.Has_Branch(),
            `Does not have Branch.`,
        );

        return this.Child(0) as Branch.Instance;
    }
}
