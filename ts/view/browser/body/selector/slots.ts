import { Count } from "../../../../types.js";
import { Delta } from "../../../../types.js";

import * as Model from "../../../../model/browser/body/selector/slots.js";

import * as Entity from "../../../entity.js";
import * as Selector from "./instance.js";
import * as Slot from "./slot.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            selector,
        }: {
            model: () => Model.Instance,
            selector: Selector.Instance,
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
        const model: Model.Instance = this.Model();
        if (model.Selector().Body().Browser().Commander().Selector().Is_Activated()) {
            const target: Count = model.Count();
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
                            model: () => this.Model().At(idx),
                            slots: this,
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
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Slots`);
        if (model.Selector().Body().Browser().Commander().Selector().Is_Deactivated()) {
            classes.push(`Hidden`);
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
}
