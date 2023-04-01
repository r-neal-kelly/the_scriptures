import * as Utils from "../../utils.js";
import * as Entity from "../../entity.js";

import * as Model from "../../model/layout/bar.js";

import * as Layout from "./instance.js";
import * as Tabs from "./tabs.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            layout,
        }: {
            model: () => Model.Instance;
            layout: Layout.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: layout,
                event_grid: layout.Event_Grid(),
            },
        );

        this.model = model;
    }

    override On_Refresh():
        void
    {
        if (!this.Has_Tabs()) {
            this.Abort_All_Children();

            new Tabs.Instance(
                {
                    model: () => this.Model().Tabs(),
                    bar: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Bar`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Layout():
        Layout.Instance
    {
        return this.Parent() as Layout.Instance;
    }

    Has_Tabs():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Tabs.Instance
        );
    }

    Tabs():
        Tabs.Instance
    {
        Utils.Assert(
            this.Has_Tabs(),
            `Does not have tabs.`,
        );

        return this.Child(0) as Tabs.Instance;
    }
}
