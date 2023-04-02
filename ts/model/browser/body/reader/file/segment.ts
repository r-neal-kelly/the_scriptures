import { Count } from "../../../../../types.js";
import { Index } from "../../../../../types.js";

import * as Utils from "../../../../../utils.js";

import * as Text from "../../../../text.js";

import * as Line from "./line.js";
import * as Item from "./item.js";

export class Instance
{
    private static min_item_count: Count = 2;

    private static blank_item: Item.Instance = new Item.Instance(
        {
            segment: null,
            index: null,
            text: null,
        },
    );

    static Min_Item_Count():
        Count
    {
        return Instance.min_item_count;
    }

    static Set_Min_Item_Count(
        min_item_count: Count,
    ):
        void
    {
        Utils.Assert(
            min_item_count >= 0,
            `min_item_count must be greater than or equal to 0.`,
        );

        Instance.min_item_count = min_item_count;
    }

    private line: Line.Instance | null;
    private index: Index | null;
    private text: Text.Segment.Instance | null;
    private items: Array<Item.Instance>;

    constructor(
        {
            line,
            index,
            text,
        }: {
            line: Line.Instance | null,
            index: Index | null,
            text: Text.Segment.Instance | null,
        },
    )
    {
        this.line = line;
        this.index = index;
        this.text = text;
        this.items = [];

        if (text == null) {
            Utils.Assert(
                line == null,
                `line must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
        } else {
            Utils.Assert(
                line != null,
                `line must not be null.`,
            );
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );

            for (let idx = 0, end = text.Item_Count(); idx < end; idx += 1) {
                this.items.push(
                    new Item.Instance(
                        {
                            segment: this,
                            index: idx,
                            text: text.Item(idx),
                        },
                    ),
                );
            }
        }
    }

    Line():
        Line.Instance
    {
        Utils.Assert(
            this.line != null,
            `Doesn't have line.`,
        );

        return this.line as Line.Instance;
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
        Text.Segment.Instance
    {
        Utils.Assert(
            this.text != null,
            `Doesn't have text.`,
        );

        return this.text as Text.Segment.Instance;
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

    Is_Blank():
        boolean
    {
        return this.text == null;
    }
}
