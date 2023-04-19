import * as Utils from "../../../../utils.js";
import * as Event from "../../../../event.js";

import * as Model from "../../../../model/finder.js";

import * as Entity from "../../../entity.js";
import * as Tree from "./tree.js";
import * as List from "./list.js";

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
        if (
            !this.Has_Tree() ||
            !this.Has_List()
        ) {
            this.Abort_All_Children();

            new Tree.Instance(
                {
                    model: () => this.Model(),
                    parent: this,
                },
            );
            new List.Instance(
                {
                    model: () => this.Model(),
                    parent: this,
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
