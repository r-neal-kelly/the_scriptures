import * as Event from "../../event.js";

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

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Element().addEventListener(
            `click`,
            this.On_Click.bind(this),
        );

        return [];
    }

    override On_Refresh():
        void
    {
        this.Element().textContent = this.Model().Title();
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Tab`);
        if (model.Window().Is_Active()) {
            classes.push(`Active_Tab`)
        }

        return classes;
    }

    async On_Click():
        Promise<void>
    {
        this.Model().Tabs().Bar().Layout().Set_Active_Window(this.Model().Window());
        this.Tabs().Bar().Layout().Refresh();
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
