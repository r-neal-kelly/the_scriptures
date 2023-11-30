import { ID } from "../../../types.js";

import * as Event from "../../../event.js";

import * as Model from "../../../model/selector/settings.js";

import * as Events from "../../events.js";
import * as Entity from "../../entity.js";
import * as Settings from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            settings,
            model,
        }: {
            settings: Settings.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: settings,
                event_grid: settings.Event_Grid(),
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
                        Events.SELECTOR_SETTINGS_TOGGLE,
                        this.ID(),
                    ),
                    event_handler: this.On_Selector_Settings_Toggle,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        if (this.Is_Visible()) {
            this.Element().textContent = this.Model().Toggle_Symbol();
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Toggle`);
        if (!this.Is_Visible()) {
            classes.push(`Invisible`);
        } else {
            if (model.Is_Toggled()) {
                classes.push(`Toggled_Toggle`);
            }
        }

        return classes;
    }

    private async On_Click(
        event: MouseEvent,
    ):
        Promise<void>
    {
        await this.Send(
            new Event.Info(
                {
                    affix: Events.SELECTOR_SETTINGS_TOGGLE,
                    suffixes: [
                        this.ID(),
                        this.Event_Grid_ID(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );
    }

    private async On_Selector_Settings_Toggle():
        Promise<void>
    {
        this.Model().Toggle();
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Event_Grid_ID():
        ID
    {
        return this.Settings().Event_Grid_ID();
    }

    Settings():
        Settings.Instance
    {
        return this.Parent() as Settings.Instance;
    }

    Is_Visible():
        boolean
    {
        return this.Settings().Is_Visible();
    }
}
