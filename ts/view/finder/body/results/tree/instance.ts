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
        this.Add_CSS(
            `
                .Tree {
                    border-style: solid;
                    border-width: 0 1px 1px 0;
                    border-color: hsl(255, 100%, 100%, 0.7);
                }

                .Branches, .Leaves {
                    margin-bottom: 3px;
                    padding-top: 3px;
                    padding-bottom: 3px;
                    padding-left: 6px;

                    border-style: solid;
                    border-width: 0 0 1px 1px;
                    border-color: hsl(255, 100%, 100%, 0.7);
                }

                .Branch_Name {
                    padding: 2px 2px;

                    border-style: solid;
                    border-width: 0 0 1px 0;
                    border-color: hsl(255, 100%, 100%, 0.7);

                    color: hsl(255, 100%, 100%, 0.8);
                    font-size: 0.8em;
                    font-variant: small-caps;

                    cursor: default;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }

                .Leaf {
                    width: 100%;
                    padding: 2px 2px;

                    font-size: 0.8em;

                    cursor: pointer;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }

                .Selected {
                    color: black;

                    background-color: white;
                }

                .Hidden {
                    display: none;
                }
            `,
        );

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
        const classes: Array<string> = [];

        classes.push(`Tree`);
        if (this.Model().Root().Is_Empty()) {
            classes.push(`Hidden`);
        }

        return classes;
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
