import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { Name } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Selector from "../instance.js";
import { Type } from "./type.js";
import * as Item from "./item.js";

export class Instance
{
    private selector: Selector.Instance;
    private index: Index;
    private type: Type;
    private name: string;
    private items: Array<Item.Instance>;
    private selected_item: Item.Instance | null;

    constructor(
        {
            selector,
            index,
            type,
            item_names,
            selected_item_name = null,
        }: {
            selector: Selector.Instance,
            index: Index,
            type: Type,
            item_names: Array<Name>,
            selected_item_name?: Name | null,
        },
    )
    {
        this.selector = selector;
        this.index = index;
        this.type = type;
        if (type === Type.LANGUAGES) {
            this.name = `Languages`;
        } else if (type === Type.FONTS) {
            this.name = `Fonts`;
        } else {
            Utils.Assert(
                false,
                `Invalid type.`,
            );
            this.name = ``;
        }
        this.items = [];
        this.selected_item = null;

        for (let idx = 0, end = item_names.length; idx < end; idx += 1) {
            const item_name: string = item_names[idx];
            const item: Item.Instance = new Item.Instance(
                {
                    slot: this,
                    index: idx,
                    name: item_name,
                },
            );
            this.items.push(item);
            if (item_name === selected_item_name) {
                this.selected_item = item;
            }
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

    Name():
        string
    {
        return this.name;
    }

    Has_Item(
        item: Item.Instance,
    ):
        boolean
    {
        return this.items.includes(item);
    }

    Item_Count():
        Count
    {
        return this.items.length;
    }

    Item_At_Index(
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

    Maybe_Item_From_Name(
        name: Name,
    ):
        Item.Instance | null
    {
        for (let idx = 0, end = this.Item_Count(); idx < end; idx += 1) {
            const item: Item.Instance = this.Item_At_Index(idx);
            if (item.Name() === name) {
                return item;
            }
        }

        return null;
    }

    Some_Item_From_Name(
        name: Name,
    ):
        Item.Instance
    {
        const maybe_item: Item.Instance | null = this.Maybe_Item_From_Name(name);

        Utils.Assert(
            maybe_item != null,
            `Does not have an item with the name of ${name}.`,
        );

        return maybe_item as Item.Instance;
    }

    Items():
        Array<Item.Instance>
    {
        return Array.from(this.items);
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
            `Has no selected_item.`,
        );

        return this.selected_item as Item.Instance;
    }

    __Select_Item__(
        {
            item,
        }: {
            item: Item.Instance,
        },
    ):
        void
    {
        Utils.Assert(
            this.Has_Item(item),
            `The item does not belong to this slot.`,
        );

        this.selected_item = item;
    }

    Select_Item(
        item: Item.Instance,
    ):
        void
    {
        this.Selector().__Select_Item__(
            {
                slot: this,
                slot_item: item,
            },
        );
    }
}
