import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/selector/slot/instance.js";

import * as Selector from "../instance.js";
import * as Item from "./item.js";

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

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return `
            width: 100%;

            overflow-x: auto;
            overflow-y: auto;
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        const model: Model.Instance = this.Model();

        if (this.Child_Count() !== model.Item_Count()) {
            this.Abort_All_Children();

            for (const item_model of this.Model().Items()) {
                new Item.Instance(
                    {
                        model: item_model,
                        slot: this,
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

    Selector():
        Selector.Instance
    {
        return this.Parent() as Selector.Instance;
    }
}
