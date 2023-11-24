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
            event_grid_id,
        }: {
            parent: Entity.Instance,
            model: () => Model.Instance,
            event_grid_id: () => ID,
        },
    )
    {
        super(
            {
                parent: parent,
                model: model,
                event_grid_id: event_grid_id,
                line_class: Line.Instance,
            },
        );

        this.Live();
    }
}
