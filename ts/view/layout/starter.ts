import * as Event from "../../event.js";

import * as Model from "../../model/layout/starter.js";

import * as Events from "../events.js";
import * as Entity from "../entity.js";
import * as Taskbar from "./taskbar.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            taskbar,
        }: {
            model: () => Model.Instance;
            taskbar: Taskbar.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: taskbar,
                event_grid: taskbar.Event_Grid(),
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
                        Events.MENU_OPEN,
                        this.Taskbar().Layout().ID(),
                    ),
                    event_handler: this.After_Taskbar_Menu_Open,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.MENU_CLOSE,
                        this.Taskbar().Layout().ID(),
                    ),
                    event_handler: this.After_Taskbar_Menu_Close,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        this.Element().textContent = this.Model().Symbol();
    }

    override On_Reclass():
        Array<string>
    {
        return [`Starter`];
    }

    private async On_Click(
        event: MouseEvent,
    ):
        Promise<void>
    {
        event.stopPropagation();

        const model: Model.Instance = this.Model();

        if (model.Should_Open()) {
            await this.Send(
                new Event.Info(
                    {
                        affix: Events.MENU_OPEN,
                        suffixes: [
                            this.ID(),
                            this.Taskbar().ID(),
                            this.Taskbar().Layout().ID(),
                        ],
                        type: Event.Type.EXCLUSIVE,
                        data: {},
                    },
                ),
            );
        } else {
            await this.Send(
                new Event.Info(
                    {
                        affix: Events.MENU_CLOSE,
                        suffixes: [
                            this.ID(),
                            this.Taskbar().ID(),
                            this.Taskbar().Layout().ID(),
                        ],
                        type: Event.Type.EXCLUSIVE,
                        data: {},
                    },
                ),
            );
        }
    }

    private async After_Taskbar_Menu_Open():
        Promise<void>
    {
        this.Refresh();
    }

    private async After_Taskbar_Menu_Close():
        Promise<void>
    {
        this.Refresh();
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Taskbar():
        Taskbar.Instance
    {
        return this.Parent() as Taskbar.Instance;
    }
}
