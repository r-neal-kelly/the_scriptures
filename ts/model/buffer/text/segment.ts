import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Text from "../../text.js";
import * as Buffer from "./instance.js";
import * as Row from "./row.js";
import * as Item from "./item.js";

export class Instance extends Entity.Instance
{
    private buffer: Buffer.Instance;
    private row: Row.Instance | null;
    private index: Index | null;
    private text: Text.Segment.Instance | null;
    private items: Array<Item.Instance>;

    constructor(
        {
            buffer,
            row,
            index,
            text,
        }: {
            buffer: Buffer.Instance,
            row: Row.Instance | null,
            index: Index | null,
            text: Text.Segment.Instance | null,
        },
    )
    {
        super();

        this.buffer = buffer;
        this.row = row;
        this.index = index;
        this.text = text;
        this.items = [];

        if (text == null) {
            Utils.Assert(
                row == null,
                `row must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
        } else {
            Utils.Assert(
                row != null,
                `row must not be null.`,
            );
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );

            for (let idx = 0, end = text.Item_Count(); idx < end; idx += 1) {
                this.items.push(
                    new Item.Instance(
                        {
                            buffer: this.buffer,
                            segment: this,
                            index: idx,
                            text: text.Item(idx),
                        },
                    ),
                );
            }
        }

        this.Add_Dependencies(
            this.items,
        );
    }

    Buffer():
        Buffer.Instance
    {
        return this.buffer;
    }

    Row():
        Row.Instance
    {
        Utils.Assert(
            this.row != null,
            `Doesn't have row.`,
        );

        return this.row as Row.Instance;
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

    Min_Item_Count():
        Count
    {
        return this.Buffer().Min_Item_Count();
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
            return this.Buffer().Blank_Item();
        }
    }

    Is_Blank():
        boolean
    {
        return this.text == null;
    }

    Has_Left_To_Right_Style():
        boolean
    {
        return this.Text().Segment_Type() === Text.Segment.Type.MACRO_LEFT_TO_RIGHT;
    }

    Has_Right_To_Left_Style():
        boolean
    {
        return this.Text().Segment_Type() === Text.Segment.Type.MACRO_RIGHT_TO_LEFT;
    }
}
