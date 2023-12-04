import * as Event from "../../../../event.js";

import * as Model from "../../../../model/layout/window/bar/title.js";

import * as Events from "../../../events.js";
import * as Entity from "../../../entity.js";
import * as Bar from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            bar,
        }: {
            model: () => Model.Instance;
            bar: Bar.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: bar,
                event_grid: bar.Event_Grid(),
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
                        Events.WINDOW_REFRESH_TITLE,
                        this.Bar().Window().ID(),
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
        this.Element().textContent = this.Model().Value();
    }

    override On_Reclass():
        Array<string>
    {
        return [`Title`];
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

    Bar():
        Bar.Instance
    {
        return this.Parent() as Bar.Instance;
    }
}
