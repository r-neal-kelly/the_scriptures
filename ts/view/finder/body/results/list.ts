import * as Utils from "../../../../utils.js";
import * as Event from "../../../../event.js";

import * as Model from "../../../../model/finder/body/results/instance.js";

import * as Events from "../../../events.js";
import * as Entity from "../../../entity.js";
import * as Buffer from "../../../buffer/search.js";
import * as Results from "./instance.js";

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
        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.FINDER_BODY_TREE_LEAF_SELECT,
                        this.Results().Body().Finder().ID(),
                    ),
                    event_handler: this.On_Finder_Body_Tree_Leaf_Select,
                    event_priority: 10,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Buffer()
        ) {
            this.Abort_All_Children();

            new Buffer.Instance(
                {
                    parent: this,
                    model: () => this.Model().Buffer(),
                    event_grid_id: () => this.Results().Body().Finder().ID(),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`List`];
    }

    private async On_Finder_Body_Tree_Leaf_Select():
        Promise<void>
    {
        this.Element().scrollTo(0, 0);
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

    Has_Buffer():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Buffer.Instance
        );
    }

    Buffer():
        Buffer.Instance
    {
        Utils.Assert(
            this.Has_Buffer(),
            `Does not have Buffer.`,
        );

        return this.Child(0) as Buffer.Instance;
    }
}
