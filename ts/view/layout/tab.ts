import * as Event from "../../event.js";

import * as Model from "../../model/layout/tab.js";

import * as Events from "../events.js";
import * as Entity from "../entity.js";
import * as Tabs from "./tabs.js";
import * as Window from "./window/instance.js";

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

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.WINDOW_REFRESH_TAB,
                        this.Window().ID(),
                    ),
                    event_handler: this.On_Window_Refresh_Title,
                    event_priority: 0,
                },
            ),
        ];
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

    private async On_Click():
        Promise<void>
    {
        this.Model().Tabs().Bar().Layout().Set_Active_Window(this.Model().Window());
        this.Tabs().Bar().Layout().Refresh();
    }

    private async On_Window_Refresh_Title():
        Promise<void>
    {
        this.Refresh();
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

    Window():
        Window.Instance
    {
        return this.Tabs().Bar().Layout().Wall().Window_With_Model(this.Model().Window());
    }
}
