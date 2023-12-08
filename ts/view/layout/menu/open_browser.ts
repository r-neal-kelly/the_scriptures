import * as Event from "../../../event.js";

import * as Model from "../../../model/layout/menu/open_browser.js";

import * as Events from "../../events.js";
import * as Entity from "../../entity.js";
import * as Menu from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            menu,
        }: {
            model: () => Model.Instance;
            menu: Menu.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: menu,
                event_grid: menu.Event_Grid(),
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
                        Events.OPEN_BROWSER,
                        this.ID(),
                    ),
                    event_handler: this.On_Open_Browser,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        this.Element().textContent = this.Model().Text();
    }

    override On_Reclass():
        Array<string>
    {
        return [`Open_Browser`];
    }

    private async On_Click(
        event: MouseEvent,
    ):
        Promise<void>
    {
        await this.Send(
            new Event.Info(
                {
                    affix: Events.OPEN_BROWSER,
                    suffixes: [
                        this.ID(),
                        this.Menu().ID(),
                        this.Menu().Desktop().ID(),
                        this.Menu().Desktop().Layout().ID(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );
    }

    private async On_Open_Browser():
        Promise<void>
    {
        await this.Menu().Animate_Button(this);
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Menu():
        Menu.Instance
    {
        return this.Parent() as Menu.Instance;
    }
}
