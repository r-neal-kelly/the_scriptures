import { Index } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Model from "../../../model/buffer/text.js";

import * as Entity from "../../entity.js";
import * as Text_Base from "../text_base.js";
import * as Line from "./line.js";

export class Instance extends Text_Base.Instance<
    Model.Instance
>
{
    constructor(
        {
            parent,
            model,
            event_grid_hook,
        }: {
            parent: Entity.Instance,
            model: () => Model.Instance,
            event_grid_hook: () => ID,
        },
    )
    {
        super(
            {
                parent: parent,
                model: model,
                event_grid_hook: event_grid_hook,
            },
        );

        this.Live();
    }

    Add_Line(
        line_index: Index,
    ):
        void
    {
        new Line.Instance(
            {
                buffer: this,
                model: () => this.Model().Line_At(line_index),
                index: line_index,
            },
        );
    }
}
