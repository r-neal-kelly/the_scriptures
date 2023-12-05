import { Index } from "../../../types.js";

import * as Model from "../../../model/buffer/search/segment.js";

import * as Text_Base from "../text_base.js";
import * as Buffer from "./instance.js";
import * as Line from "./line.js";
import * as Column from "./column.js";
import * as Row from "./row.js";
import * as Item from "./item.js";

export class Instance extends Text_Base.Segment.Instance<
    Model.Instance,
    Buffer.Instance,
    Line.Instance,
    Column.Instance,
    Row.Instance
>
{
    constructor(
        {
            row,
            model,
        }: {
            row: Row.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                row: row,
                model: model,
            },
        );

        this.Live();
    }

    Add_Item(
        item_index: Index,
    ):
        void
    {
        new Item.Instance(
            {
                segment: this,
                model: () => this.Model().Item_At(item_index),
            },
        );
    }
}
