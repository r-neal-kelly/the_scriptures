import * as Event from "../../../event.js";

import * as Model from "../../../model/browser/commander/allow_errors.js";

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
                        Events.TOGGLE_ALLOW_ERRORS,
                        this.Commander().Browser().ID(),
                    ),
                    event_handler: this.On_Toggle_Allow_Errors,
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
        return [`Commander_Allow_Errors`];
    }

    private async On_Click(
        event: MouseEvent,
    ):
        Promise<void>
    {
        await this.Send(
            new Event.Info(
                {
                    affix: Events.TOGGLE_ALLOW_ERRORS,
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

    private async On_Toggle_Allow_Errors():
        Promise<void>
    {
        await this.Commander().Animate_Button(this);
        this.Model().Toggle();
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
