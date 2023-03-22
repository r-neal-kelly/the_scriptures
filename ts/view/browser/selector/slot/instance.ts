import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/selector/slot/instance.js";

import * as Selector from "../instance.js";
import * as Item from "./item.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;
    private selector: Selector.Instance;
    private items: Array<Item.Instance> | null;

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
        super(`div`, selector.Event_Grid());

        this.model = model;
        this.selector = selector;
        this.items = null;
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return ({
            "display": `flex`,

            "width": `100%`,
            "height": `100%`,

            "overflow-x": `auto`,
            "overflow-y": `auto`,

            "color": `white`,
        });
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        this.items = [];
        for (const item_model of this.Model().Items()) {
            const item_view: Item.Instance = new Item.Instance(
                {
                    model: item_model,
                    slot: this,
                },
            );
            this.items.push(item_view);
            this.Add_Child(item_view);
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
        return this.selector;
    }
}
