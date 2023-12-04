import * as Event from "../../../event.js";

import * as Model from "../../../model/browser/commander/previous.js";

import * as Events from "../../events.js";
import * as Entity from "../../entity.js";
import * as Commander from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            commander,
        }: {
            model: () => Model.Instance,
            commander: Commander.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: commander,
                event_grid: commander.Event_Grid(),
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
                        Events.BROWSER_COMMANDER_PREVIOUS,
                        this.ID(),
                    ),
                    event_handler: this.On,
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
        return [`Commander_Previous`];
    }

    private async On_Click(
        event: MouseEvent,
    ):
        Promise<void>
    {
        if (this.Model().Can_Activate()) {
            await this.Send(
                new Event.Info(
                    {
                        affix: Events.BROWSER_COMMANDER_PREVIOUS,
                        suffixes: [
                            this.ID(),
                            this.Commander().ID(),
                            this.Commander().Browser().ID(),
                            this.Commander().Browser().Event_Grid_Hook(),
                        ],
                        type: Event.Type.EXCLUSIVE,
                        data: {},
                    },
                ),
            );
        }
    }

    private async On():
        Promise<void>
    {
        await this.Model().Activate();
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Commander():
        Commander.Instance
    {
        return this.Parent() as Commander.Instance;
    }
}
