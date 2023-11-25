import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Text from "../../text.js";
import * as Search from "../../search.js";

import * as Text_Base from "../text_base.js";
import * as Buffer from "./instance.js";
import * as Row from "./row.js";
import * as Item from "./item.js";

export class Instance extends Text_Base.Segment.Instance<
    Buffer.Instance,
    Row.Instance,
    Item.Instance
>
{
    private static blank_item: Item.Instance = new Item.Instance(
        {
            segment: null,
            index: null,
            text: null,
        },
    );

    constructor(
        {
            row,
            index,
            text,
        }: {
            row: Row.Instance | null,
            index: Index | null,
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

    Blank_Item():
        Item.Instance
    {
        return Instance.blank_item;
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
