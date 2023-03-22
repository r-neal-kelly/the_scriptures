import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/selector/slot/item.js";

import * as Slot from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;
    private slot: Slot.Instance;

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
        super(`div`, slot.Event_Grid());

        this.model = model;
        this.slot = slot;
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return `
            display: flex;

            width: 100%;
            height: 100%;

            overflow-x: hidden;
            overflow-y: hidden;

            color: white;

            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-elect: none;
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        this.Element().textContent = this.Model().Name();
    }

    Model():
        Model.Instance
    {
        return this.model;
    }
}
