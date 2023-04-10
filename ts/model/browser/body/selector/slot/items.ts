import { Count } from "../../../../../types.js";
import { Index } from "../../../../../types.js";
import { Name } from "../../../../../types.js";

import * as Utils from "../../../../../utils.js";

import * as Data from "../../../../data.js";

import * as Entity from "../../../../entity.js";
import * as Slot from "./instance.js";
import * as Item from "./item.js";

export class Instance extends Entity.Instance
{
    private slot: Slot.Instance;
    private items: Array<Item.Instance>;
    private selected: Item.Instance | null;

    constructor(
        {
            slot,
            item_names,
            item_files,
        }: {
            slot: Slot.Instance,
            item_names: Array<Name>,
            item_files: Array<Data.File.Instance> | null,
        },
    )
    {
        super();

        this.slot = slot;
        this.items = [];
        this.selected = null;

        for (let idx = 0, end = item_names.length; idx < end; idx += 1) {
            this.items.push(
                new Item.Instance(
                    {
                        items: this,
                        index: idx,
                        name: item_names[idx],
                        file: item_files != null ?
                            item_files[idx] :
                            null,
                    },
                ),
            );
        }

        this.Add_Dependencies(
            this.items,
        );
    }

    Slot():
        Slot.Instance
    {
        return this.slot;
    }

    Has(
        item: Item.Instance,
    ):
        boolean
    {
        return this.items.includes(item);
    }

    Count():
        Count
    {
        return this.items.length;
    }

    At(
        item_index: Index,
    ):
        Item.Instance
    {
        Utils.Assert(
            item_index > -1,
            `item_index must be greater than -1.`,
        );
        Utils.Assert(
            item_index < this.Count(),
            `item_index must be less than item_count.`,
        );

        return this.items[item_index];
    }

    Maybe_From(
        name: Name,
    ):
        Item.Instance | null
    {
        for (let idx = 0, end = this.Count(); idx < end; idx += 1) {
            const item: Item.Instance = this.At(idx);
            if (item.Name() === name) {
                return item;
            }
        }

        return null;
    }

    From(
        name: Name,
    ):
        Item.Instance
    {
        const maybe_item: Item.Instance | null = this.Maybe_From(name);

        Utils.Assert(
            maybe_item != null,
            `Does not have an item with the name of ${name}.`,
        );

        return maybe_item as Item.Instance;
    }

    Array():
        Array<Item.Instance>
    {
        return Array.from(this.items);
    }

    Has_Selected():
        boolean
    {
        return this.selected != null;
    }

    Selected():
        Item.Instance
    {
        Utils.Assert(
            this.Has_Selected(),
            `Has no selected item.`,
        );

        return this.selected as Item.Instance;
    }

    async Select(
        item: Item.Instance,
    ):
        Promise<void>
    {
        Utils.Assert(
            this.Has(item),
            `The item does not belong to this slot.`,
        );

        this.selected = item;

        await this.Slot().Slots().Select_Item_Internally(
            {
                slot: this.Slot(),
            },
        );
    }
}
