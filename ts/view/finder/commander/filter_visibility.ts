import * as Event from "../../../event.js";

import * as Model from "../../../model/finder/commander/filter_visibility.js";

import * as Events from "../../events.js";
import * as Entity from "../../entity.js";
import * as Commander from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            commander,
            model,
        }: {
            commander: Commander.Instance,
            model: () => Model.Instance,
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
                        Events.SELECTOR_TOGGLE,
                        this.ID(),
                    ),
                    event_handler: this.On_Selector_Toggle,
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
        return [`Filter_Visibility`];
    }

    private async On_Click(
        event: MouseEvent,
    ):
        Promise<void>
    {
        await this.Send(
            new Event.Info(
                {
                    affix: Events.SELECTOR_TOGGLE,
                    suffixes: [
                        this.ID(),
                        this.Commander().ID(),
                        this.Commander().Finder().ID(),
                        this.Commander().Finder().Body().ID(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );
    }

    private async On_Selector_Toggle():
        Promise<void>
    {
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
