import * as Utils from "../../../../utils.js";
import * as Event from "../../../../event.js";

import * as Model from "../../../../model/finder/body/instance.js";

import * as Entity from "../../../entity.js";
import * as Body from "../instance.js";
import * as Tree from "./tree.js";
import * as List from "./list.js";

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
            !this.Has_List()
        ) {
            this.Abort_All_Children();

            new Tree.Instance(
                {
                    results: this,
                    model: () => this.Model(),
                },
            );
            new List.Instance(
                {
                    results: this,
                    model: () => this.Model(),
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

    Has_List():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof List.Instance
        );
    }

    List():
        List.Instance
    {
        Utils.Assert(
            this.Has_List(),
            `Does not have List.`,
        );

        return this.Child(1) as List.Instance;
    }
}
