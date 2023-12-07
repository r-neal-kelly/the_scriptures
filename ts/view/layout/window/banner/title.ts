import * as Event from "../../../../event.js";

import * as Model from "../../../../model/layout/window/banner/title.js";

import * as Events from "../../../events.js";
import * as Entity from "../../../entity.js";
import * as Banner from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            banner,
        }: {
            model: () => Model.Instance;
            banner: Banner.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: banner,
                event_grid: banner.Event_Grid(),
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
                        this.Banner().Window().ID(),
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

    Banner():
        Banner.Instance
    {
        return this.Parent() as Banner.Instance;
    }
}
