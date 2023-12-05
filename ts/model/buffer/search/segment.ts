import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Text from "../../text.js";
import * as Search from "../../search.js";

import * as Text_Base from "../text_base.js";
import * as Buffer from "./instance.js";
import * as Line from "./line.js";
import * as Column from "./column.js";
import * as Row from "./row.js";
import * as Item from "./item.js";

export class Instance extends Text_Base.Segment.Instance<
    Buffer.Instance,
    Line.Instance,
    Column.Instance,
    Row.Instance,
    Item.Instance
>
{
    constructor(
        {
            row,
            index,
            text,
        }: {
            row: Row.Instance,
            index: Index,
            text: Text.Segment.Instance | null,
        },
    )
    {
        super(
            {
                row: row,
                index: index,
                text: text,
            },
        );

        if (!this.Is_Blank()) {
            for (let idx = 0, end = this.Text().Item_Count(); idx < end; idx += 1) {
                this.Push_Item(
                    new Item.Instance(
                        {
                            segment: this,
                            index: idx,
                            text: this.Text().Item(idx),
                        },
                    ),
                );
            }
        }
    }

    Blank_Item(
        item_index: Index,
    ):
        Item.Instance
    {
        return new Item.Instance(
            {
                segment: this,
                index: item_index,
                text: null,
            },
        );
    }

    Result():
        Search.Result.Instance
    {
        Utils.Assert(
            !this.Is_Blank(),
            `segment is blank.`,
        );

        return this.Row().Result();
    }
}
