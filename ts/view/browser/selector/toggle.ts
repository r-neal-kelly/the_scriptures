import * as Event from "../../../event.js";
import * as Entity from "../../../entity.js";

import * as Model from "../../../model/browser/selector/toggle.js";

import * as Selector from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;

    constructor(
        {
            model,
            selector,
        }: {
            model: Model.Instance,
            selector: Selector.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: selector,
                event_grid: selector.Event_Grid(),
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
                    event_name: new Event.Name(Event.Prefix.ON, `Selector_Toggle`, `${this.ID()}`,),
                    event_handler: this.On_Selector_Toggle,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        if (model.Is_Open()) {
            this.Element().textContent = `<<`;
        } else {
            this.Element().textContent = `>>`;
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Toggle`];
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
                        `${this.Selector().Browser().ID()}`,
                        `${this.ID()}`,
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
        this.Model().Toggle();
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Selector():
        Selector.Instance
    {
        return this.Parent() as Selector.Instance;
    }
}
