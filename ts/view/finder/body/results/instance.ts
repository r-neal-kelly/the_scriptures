import * as Utils from "../../../../utils.js";
import * as Event from "../../../../event.js";

import * as Model from "../../../../model/finder/body/results/instance.js";

import * as Entity from "../../../entity.js";
import * as Buffer from "../../../buffer/search.js";
import * as Body from "../instance.js";
import * as Tree from "./tree.js";

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
        return [];
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Tree() ||
            !this.Has_Buffer()
        ) {
            this.Abort_All_Children();

            new Tree.Instance(
                {
                    results: this,
                    model: () => this.Model().Tree(),
                },
            );
            new Buffer.Instance(
                {
                    parent: this,
                    model: () => this.Model().Buffer(),
                    event_grid_id: () => this.Body().Finder().ID(),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Results`];
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

    Has_Tree():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Tree.Instance
        );
    }

    Tree():
        Tree.Instance
    {
        Utils.Assert(
            this.Has_Tree(),
            `Does not have Tree.`,
        );

        return this.Child(0) as Tree.Instance;
    }

    Has_Buffer():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Buffer.Instance
        );
    }

    Buffer():
        Buffer.Instance
    {
        Utils.Assert(
            this.Has_Buffer(),
            `Does not have Buffer.`,
        );

        return this.Child(1) as Buffer.Instance;
    }
}
