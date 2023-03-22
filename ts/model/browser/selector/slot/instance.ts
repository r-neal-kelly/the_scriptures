import { Count } from "../../../../types.js";
import { Index } from "../../../../types.js";
import { Name } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Selector from "../instance.js";
import { Type } from "./type.js";
import * as Item from "./item.js";

export class Instance
{
    private selector: Selector.Instance;
    private type: Type;
    private items: Array<Item.Instance>;
    private current_item: Item.Instance | null;

    constructor(
        {
            selector,
            type,
            item_names,
        }: {
            selector: Selector.Instance,
            type: Type,
            item_names: Array<Name>,
        },
    )
    {
        this.selector = selector;
        this.type = type;
        this.items = [];
        this.current_item = null;

        for (let idx = 0, end = item_names.length; idx < end; idx += 1) {
            this.items.push(
                new Item.Instance(
                    {
                        slot: this,
                        index: idx,
                        name: item_names[idx],
                    },
                ),
            );
        }
    }

    Selector():
        Selector.Instance
    {
        return this.selector;
    }

    Type():
        Type
    {
        return this.type;
    }

    Items():
        Array<Item.Instance>
    {
        return Array.from(this.items);
    }

    Item_Count():
        Count
    {
        return this.items.length;
    }

    Item(
        item_index: Index,
    ):
        Item.Instance
    {
        Utils.Assert(
            item_index > -1,
            `item_index must be greater than -1.`,
        );
        Utils.Assert(
            item_index < this.Item_Count(),
            `item_index must be less than item_count.`,
        );

        return this.items[item_index];
    }

    Current_Item():
        Item.Instance | null
    {
        return this.current_item;
    }

    Select_Current_Item(
        item_index: Index,
    ):
        void
    {
        this.current_item = this.Item(item_index);
    }
}
