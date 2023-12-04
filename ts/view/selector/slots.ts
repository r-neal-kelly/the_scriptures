import { Count } from "../../types.js";
import { Delta } from "../../types.js";

import * as Model from "../../model/selector.js";

import * as Entity from "../entity.js";
import * as Selector from "./instance.js";
import * as Slot from "./slot.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            selector,
            model,
        }: {
            selector: Selector.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: selector,
                event_grid: selector.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Refresh():
        void
    {
        if (this.Is_Visible()) {
            const model: Model.Instance = this.Model();
            const target: Count = model.Slot_Count();
            const count: Count = this.Child_Count();
            const delta: Delta = target - count;

            if (delta < 0) {
                for (let idx = count, end = count + delta; idx > end;) {
                    idx -= 1;

                    this.Abort_Child(this.Child(idx));
                }
            } else if (delta > 0) {
                for (let idx = count, end = count + delta; idx < end; idx += 1) {
                    new Slot.Instance(
                        {
                            slots: this,
                            model: () => this.Model().Slot_At_Index(idx),
                        },
                    );
                }
            }
        } else {
            this.Skip_Children();
        }
    }

    override On_Reclass():
        Array<string>
    {
        const classes: Array<string> = [];

        classes.push(`Slots`);
        if (!this.Is_Visible()) {
            classes.push(`Invisible`);
        }

        return classes;
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Selector():
        Selector.Instance
    {
        return this.Parent() as Selector.Instance;
    }

    Is_Visible():
        boolean
    {
        return this.Selector().Is_Visible();
    }
}
