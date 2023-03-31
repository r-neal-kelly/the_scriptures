import { Count } from "../../../../types.js";
import { Index } from "../../../../types.js";

import * as Utils from "../../../../utils.js";

import * as Text from "../../../text.js";

import * as File from "./instance.js";
import * as Item from "./item.js";

export class Instance
{
    private static blank_item: Item.Instance = new Item.Instance(
        {
            line: null,
            index: null,
            text: null,
        },
    );

    static Min_Item_Count():
        Count
    {
        return File.Instance.Min_Item_Count();
    }

    private file: File.Instance | null;
    private index: Index | null;
    private text: Text.Line.Instance | null;
    private items: Array<Item.Instance>;

    constructor(
        {
            file,
            index,
            text,
        }: {
            file: File.Instance | null,
            index: Index | null,
            text: Text.Line.Instance | null,
        },
    )
    {
        this.file = file;
        this.index = index;
        this.text = text;
        this.items = [];

        if (text == null) {
            Utils.Assert(
                file == null,
                `file must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
        } else {
            Utils.Assert(
                file != null,
                `file must not be null.`,
            );
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );

            for (let idx = 0, end = text.Macro_Item_Count(); idx < end; idx += 1) {
                this.items.push(
                    new Item.Instance(
                        {
                            line: this,
                            index: idx,
                            text: text.Macro_Item(idx),
                        },
                    ),
                );
            }
        }
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
    }

    File():
        File.Instance
    {
        Utils.Assert(
            this.file != null,
            `Doesn't have file.`,
        );

        return this.file as File.Instance;
    }

    Index():
        Index
    {
        Utils.Assert(
            this.index != null,
            `Doesn't have an index.`,
        );

        return this.index as Index;
    }

    Text():
        Text.Line.Instance
    {
        Utils.Assert(
            this.text != null,
            `Doesn't have text.`,
        );

        return this.text as Text.Line.Instance;
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
            `item_index (${item_index}) must be greater than -1.`,
        );

        if (item_index < this.Item_Count()) {
            return this.items[item_index];
        } else {
            return Instance.blank_item;
        }
    }
}
