import { Index } from "../../../../types.js";
import { Name } from "../../../../types.js";

import * as Data from "../../data.js";
import * as Selector from "../instance.js";
import { Type } from "./type.js";
import * as Title from "./title.js";
import * as Items from "./items.js";

export class Instance
{
    private selector: Selector.Instance;
    private index: Index;
    private type: Type;
    private title: Title.Instance;
    private items: Items.Instance;

    constructor(
        {
            selector,
            index,
            type,
            item_names,
            item_files,
        }: {
            selector: Selector.Instance,
            index: Index,
            type: Type,
            item_names: Array<Name>,
            item_files: Array<Data.File.Instance> | null,
        },
    )
    {
        this.selector = selector;
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
