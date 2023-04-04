import * as Event from "../../../event.js";

import * as Model from "../../../model/browser/commander.js";

import * as Entity from "../../entity.js";
import * as Browser from "../instance.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            browser,
        }: {
            model: () => Model.Instance,
            browser: Browser.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: browser,
                event_grid: browser.Event_Grid(),
            },
        );

        this.model = model;
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
                        `Selector_Toggle`,
                        this.ID(),
                    ),
                    event_handler: this.On_Selector_Toggle,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        `Selector_Toggle`,
                        this.ID(),
                    ),
                    event_handler: this.After_Selector_Toggle,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        if (model.Is_Selector_Open()) {
            this.Element().textContent = `<<`;
        } else {
            this.Element().textContent = `>>`;
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Commander`];
    }

    async On_Click(
        event: MouseEvent,
    ):
        Promise<void>
    {
        await this.Send(
            new Event.Info(
                {
                    affix: `Selector_Toggle`,
                    suffixes: [
                        `${this.ID()}`,
                        `${this.Browser().ID()}`,
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );
    }

    async On_Selector_Toggle():
        Promise<void>
    {
        this.Model().Toggle_Selector();
    }

    async After_Selector_Toggle():
        Promise<void>
    {
        this.Refresh();
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Browser():
        Browser.Instance
    {
        return this.Parent() as Browser.Instance;
    }
}
