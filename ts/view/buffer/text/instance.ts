import { Count } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Model from "../../../model/buffer/text.js";

import * as Entity from "../../entity.js";
import * as Text_Base from "../text_base.js";
import * as Line from "./line.js";

export class Instance extends Text_Base.Instance<Model.Instance>
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
                event_grid_id: event_grid_id
            },
        );

        this.Live();
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();
        const target: Count = Math.max(Model.Instance.Min_Line_Count(), model.Line_Count());
        const count: Count = this.Child_Count();

        for (let idx = count, end = target; idx < end; idx += 1) {
            new Line.Instance(
                {
                    text: this,
                    model: () => this.Model().Line_At(idx),
                },
            );
        }
    }
}
