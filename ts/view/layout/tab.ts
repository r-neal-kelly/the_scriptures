import * as Model from "../../model/layout/tab.js";

import * as Entity from "../entity.js";
import * as Tabs from "./tabs.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            tabs,
        }: {
            model: () => Model.Instance;
            tabs: Tabs.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: tabs,
                event_grid: tabs.Event_Grid(),
            },
        );

        this.model = model;
    }

    override On_Refresh():
        void
    {
        this.Element().textContent = `Tab`;
    }

    override On_Reclass():
        Array<string>
    {
        return [`Tab`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Tabs():
        Tabs.Instance
    {
        return this.Parent() as Tabs.Instance;
    }
}
