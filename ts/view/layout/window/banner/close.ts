import * as Event from "../../../../event.js";

import * as Model from "../../../../model/layout/window/banner/close.js";

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
        await this.Send(
            new Event.Info(
                {
                    affix: Events.WINDOW_CLOSE,
                    suffixes: [
                        this.ID(),
                        this.Commands().ID(),
                        this.Commands().Banner().ID(),
                        this.Commands().Banner().Window().ID(),
                        this.Commands().Banner().Window().Wall().ID(),
                        this.Commands().Banner().Window().Wall().Desktop().ID(),
                        this.Commands().Banner().Window().Wall().Desktop().Layout().ID(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {
                        window_index: this.Model().Commands().Banner().Window().Index(),
                    } as Events.WINDOW_CLOSE_DATA,
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
