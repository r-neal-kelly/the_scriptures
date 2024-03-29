import { Index } from "../../../types.js";

import * as Model from "../../../model/buffer/search/row.js";

import * as Text_Base from "../text_base.js";
import * as Buffer from "./instance.js";
import * as Line from "./line.js";
import * as Column from "./column.js";
import * as Segment from "./segment.js";

export class Instance extends Text_Base.Row.Instance<
    Model.Instance,
    Buffer.Instance,
    Line.Instance,
    Column.Instance
>
{
    constructor(
        {
            column,
            model,
        }: {
            column: Column.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                column: column,
                model: model,
            },
        );

        this.Live();
    }

    Add_Segment(
        segment_index: Index,
    ):
        void
    {
        new Segment.Instance(
            {
                row: this,
                model: () => this.Model().Segment_At(segment_index),
            },
        );
    }
}
