import { Index } from "../../../types.js";

import * as Model from "../../../model/buffer/text/column.js";

import * as Text_Base from "../text_base.js";
import * as Buffer from "./instance.js";
import * as Line from "./line.js";
import * as Row from "./row.js";

export class Instance extends Text_Base.Column.Instance<
    Model.Instance,
    Buffer.Instance,
    Line.Instance
>
{
    constructor(
        {
            line,
            model,
        }: {
            line: Line.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                line: line,
                model: model,
            },
        );

        this.Live();
    }

    Add_Row(
        row_index: Index,
    ):
        void
    {
        new Row.Instance(
            {
                column: this,
                model: () => this.Model().Row_At(row_index),
            },
        );
    }
}
