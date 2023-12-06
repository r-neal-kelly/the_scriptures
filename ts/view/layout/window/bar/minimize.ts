import * as Event from "../../../../event.js";

import * as Model from "../../../../model/layout/window/bar/minimize.js";

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

        return [];
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
        event.stopPropagation();

        await this.Send(
            new Event.Info(
                {
                    affix: Events.WINDOW_TOGGLE_MINIMIZATION,
                    suffixes: [
                        this.ID(),
                        this.Commands().ID(),
                        this.Commands().Bar().ID(),
                        this.Commands().Bar().Window().ID(),
                        this.Commands().Bar().Window().Wall().ID(),
                        this.Commands().Bar().Window().Wall().Layout().ID(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );

        await this.Send(
            new Event.Info(
                {
                    affix: Events.WINDOW_DEACTIVATE,
                    suffixes: [
                        this.ID(),
                        this.Commands().ID(),
                        this.Commands().Bar().ID(),
                        this.Commands().Bar().Window().ID(),
                        this.Commands().Bar().Window().Wall().ID(),
                        this.Commands().Bar().Window().Wall().Layout().ID(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );
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
