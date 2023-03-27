import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/selector/slot/items.js";

import * as Slot from "./instance.js";
import * as Item from "./item.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;

    constructor(
        {
            model,
            slot,
        }: {
            model: Model.Instance,
            slot: Slot.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: slot,
                event_grid: slot.Event_Grid(),
            },
        );

        this.model = model;
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return `
            width: 100%;

            padding: 2px 2px;

            overflow-x: auto;
            overflow-y: auto;
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        const model: Model.Instance = this.Model();

        if (this.Child_Count() !== model.Count()) {
            this.Abort_All_Children();

            for (const item_model of this.Model().Array()) {
                new Item.Instance(
                    {
                        model: item_model,
                        items: this,
                    },
                );
            }
        }
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Slot():
        Slot.Instance
    {
        return this.Parent() as Slot.Instance;
    }
}
