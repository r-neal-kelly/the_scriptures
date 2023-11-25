import { Index } from "../../../types.js";

import * as Model from "../../../model/buffer/text/line.js";

import * as Text_Base from "../text_base.js";
import * as Buffer from "./instance.js";
import * as Column from "./column.js";

export class Instance extends Text_Base.Line.Instance<
    Model.Instance,
    Buffer.Instance
>
{
    constructor(
        {
            buffer,
            model,
        }: {
            buffer: Buffer.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                buffer: buffer,
                model: model,
            },
        );

        this.Live();
    }

    Add_Column(
        column_index: Index,
    ):
        void
    {
        new Column.Instance(
            {
                line: this,
                model: () => this.Model().Column_At(column_index),
            },
        );
    }
}
