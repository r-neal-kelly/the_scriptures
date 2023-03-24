import { Count } from "../../../../types.js";
import { Index } from "../../../../types.js";
import { Name } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Data from "../../data.js";
import * as Selector from "../instance.js";
import { Type } from "./type.js";
import * as Item from "./item.js";

export class Instance
{
    private selector: Selector.Instance;
    private index: Index;
    private type: Type;
    private items: Array<Item.Instance>;
    private selected_item: Item.Instance | null;

    constructor(
        {
            selector,
            index,
            type,
            item_names,
        }: {
            selector: Selector.Instance,
            index: Index,
            type: Type,
            item_names: Array<Name>,
        },
    )
    {
        this.selector = selector;
        this.index = index;
        this.type = type;
        this.items = [];
        this.selected_item = null;

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

    Index():
        Index
    {
        return this.index;
    }

    Type():
        Type
    {
        return this.type;
    }

    Has_Item(
        item: Item.Instance,
    ):
        boolean
    {
        return this.items.includes(item);
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

    Item_At(
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

    Has_Selected_Item():
        boolean
    {
        return this.selected_item != null;
    }

    Selected_Item():
        Item.Instance
    {
        Utils.Assert(
            this.Has_Selected_Item(),
            `Has no selected item.`,
        );

        return this.selected_item as Item.Instance;
    }

    async Select_Item_Internally(
        item: Item.Instance,
    ):
        Promise<void>
    {
        Utils.Assert(
            this.Has_Item(item),
            `The item does not belong to this slot.`,
        );

        this.selected_item = item;

        await this.Selector().Select_Item_Internally(
            {
                slot: this,
                item: item,
            },
        );
    }
}
