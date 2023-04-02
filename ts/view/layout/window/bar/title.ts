import * as Event from "../../../../event.js";
import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/layout/window/bar/title.js";

import * as Bar from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            bar,
        }: {
            model: () => Model.Instance;
            bar: Bar.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: bar,
                event_grid: bar.Event_Grid(),
            },
        );

        this.model = model;
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.AFTER, `Selector_Slot_Item_Select`, `${this.Bar().Window().View().ID()}`),
                    event_handler: this.After_Selector_Slot_Item_Select,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        this.Element().textContent = model.Value();
    }

    override On_Reclass():
        Array<string>
    {
        return [`Title`];
    }

    async After_Selector_Slot_Item_Select():
        Promise<void>
    {
        this.Refresh();
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Bar():
        Bar.Instance
    {
        return this.Parent() as Bar.Instance;
    }
}
