import * as Entity from "../../../entity.js";

import * as Model from "../../../model/browser/selector/toggle.js";

import * as Selector from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;

    constructor(
        {
            model,
            selector,
        }: {
            model: Model.Instance,
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
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        if (model.Is_Open()) {
            this.Element().textContent = `<<`;
        } else {
            this.Element().textContent = `>>`;
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Toggle`];
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Selector():
        Selector.Instance
    {
        return this.Parent() as Selector.Instance;
    }
}
