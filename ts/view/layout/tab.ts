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
                        Event.Prefix.AFTER,
                        Events.WINDOW_ACTIVATE,
                        this.Window().Wall().ID(),
                    ),
                    event_handler: this.After_Window_Activate,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.WINDOW_DEACTIVATE,
                        this.Window().Wall().ID(),
                    ),
                    event_handler: this.After_Window_Deactivate,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.WINDOW_REFRESH_TITLE,
                        this.Window().ID(),
                    ),
                    event_handler: this.After_Window_Refresh_Title,
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
        const model: Model.Instance = this.Model();

        if (model.Window().Is_Minimized()) {
            await this.Send(
                new Event.Info(
                    {
                        affix: Events.WINDOW_TOGGLE_MINIMIZATION,
                        suffixes: [
                            this.Window().ID(),
                            this.Window().Wall().ID(),
                            this.Window().Wall().Layout().ID(),
                        ],
                        type: Event.Type.EXCLUSIVE,
                        data: {},
                    },
                ),
            );
        }

        await this.Send(
            new Event.Info(
                {
                    affix: Events.WINDOW_ACTIVATE,
                    suffixes: [
                        this.Window().ID(),
                        this.Window().Wall().ID(),
                        this.Window().Wall().Layout().ID(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );
    }

    private async After_Window_Activate():
        Promise<void>
    {
        this.Refresh();
    }

    private async After_Window_Deactivate():
        Promise<void>
    {
        this.Refresh();
    }

    private async After_Window_Refresh_Title():
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
        return this.Tabs().Taskbar().Layout().Wall().Window_With_Model(this.Model().Window());
    }
}
