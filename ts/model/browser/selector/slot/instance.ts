import { Index } from "../../../../types.js";
import { Name } from "../../../../types.js";

import * as Data from "../../../data.js";

import * as Slots from "../slots.js";
import { Type } from "./type.js";
import * as Title from "./title.js";
import * as Items from "./items.js";

export class Instance
{
    private slots: Slots.Instance;
    private index: Index;
    private type: Type;
    private title: Title.Instance;
    private items: Items.Instance;

    constructor(
        {
            slots,
            index,
            type,
            item_names,
            item_files,
        }: {
            slots: Slots.Instance,
            index: Index,
            type: Type,
            item_names: Array<Name>,
            item_files: Array<Data.File.Instance> | null,
        },
    )
    {
        this.slots = slots;
        this.index = index;
        this.type = type;
        this.title = new Title.Instance(
            {
                slot: this,
                type: type,
            },
        );
        this.items = new Items.Instance(
            {
                slot: this,
                item_names: item_names,
                item_files: item_files,
            },
        );
    }

    Slots():
        Slots.Instance
    {
        return this.slots;
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

    Title():
        Title.Instance
    {
        return this.title;
    }

    Items():
        Items.Instance
    {
        return this.items;
    }
}
