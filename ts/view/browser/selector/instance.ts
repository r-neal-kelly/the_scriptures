import { Count } from "../../../types.js";
import { Delta } from "../../../types.js";

import * as Entity from "../../../entity.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/browser/selector/instance.js";

import * as Browser from "../instance.js";
import * as Slot from "./slot.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;

    constructor(
        {
            model,
            browser,
        }: {
            model: Model.Instance,
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

    override async On_Life():
        Promise<Array<Event.Listener_Info>>
    {
        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.ON, "Selector_Slot_Item_Select"),
                    event_handler: this.On_Selector_Slot_Item_Select.bind(this),
                    event_priority: 0,
                },
            ),
        ];
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return `
            display: grid;
            grid-template-rows: 1fr;
            grid-template-columns: repeat(4, auto);
            justify-content: start;

            width: 100%;
            height: 100%;

            overflow-x: hidden;
            overflow-y: hidden;
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        const model: Model.Instance = this.Model();
        const slot_count: Count = model.Slot_Count();
        const child_count: Count = this.Child_Count();
        const slot_delta: Delta = slot_count - child_count;

        if (slot_delta > 0) {
            for (let idx = child_count, end = slot_count; idx < end;) {
                new Slot.Instance(
                    {
                        model: model.Slot(idx),
                        selector: this,
                    },
                );

                idx += 1;
            }
        } else if (slot_delta < 0) {
            for (let idx = this.Child_Count(), end = 0; idx > end;) {
                idx -= 1;

                this.Abort_Child(this.Child(idx));
            }
        }
    }

    async On_Selector_Slot_Item_Select():
        Promise<void>
    {
        await this.Refresh();
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Browser():
        Browser.Instance
    {
        return this.Parent() as Browser.Instance;
    }
}
