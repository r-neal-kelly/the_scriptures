import * as Event from "../../../../event.js";

import * as Model from "../../../../model/layout/window/bar/close.js";

import * as Events from "../../../events.js";
import * as Entity from "../../../entity.js";
import * as Commands from "./commands.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            commands,
        }: {
            model: () => Model.Instance;
            commands: Commands.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: commands,
                event_grid: commands.Event_Grid(),
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
                        Events.WINDOW_CLOSE,
                        this.ID(),
                    ),
                    event_handler: this.On_Window_Close,
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
        return [`Button`];
    }

    private async On_Click(
        event: MouseEvent,
    ):
        Promise<void>
    {
        await this.Send(
            new Event.Info(
                {
                    affix: Events.WINDOW_CLOSE,
                    suffixes: [
                        this.ID(),
                        this.Commands().Bar().Window().Wall().Layout().ID(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );
    }

    private async On_Window_Close():
        Promise<void>
    {
        await this.Model().Click();
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Commands():
        Commands.Instance
    {
        return this.Parent() as Commands.Instance;
    }
}
