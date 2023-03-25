import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/selector/slot/title.js";

import * as Slot from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;

    constructor(
        {
            model,
            slot,
        }: {
            model: Model.Instance,
            slot: Slot.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: slot,
                event_grid: slot.Event_Grid(),
            },
        );

        this.model = model;
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return `
            width: 100%;
                
            overflow-x: hidden;
            overflow-y: hidden;

            background-color: black;
            color: white;

            border-color: white;
            border-style: solid;
            border-width: 0 0 1px 0;

            font-variant: small-caps;

            cursor: default;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        const model: Model.Instance = this.Model();

        this.Element().textContent = model.Value();
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Slot():
        Slot.Instance
    {
        return this.Parent() as Slot.Instance;
    }
}
