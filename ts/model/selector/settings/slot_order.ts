import { Index } from "../../../types.js";
import { Name } from "../../../types.js";

import * as Entity from "../../entity.js";
import * as Slot from "../slot.js";
import * as Settings from "./instance.js";

export class Instance extends Entity.Instance
{
    private settings: Settings.Instance;
    private index: Index;
    private value: Slot.Order;
    private name: Name;

    constructor(
        {
            settings,
            index,
            value,
            name,
        }: {
            settings: Settings.Instance,
            index: Index,
            value: Slot.Order,
            name: Name,
        },
    )
    {
        super();

        this.settings = settings;
        this.index = index;
        this.value = value;
        this.name = name;

        this.Add_Dependencies(
            [
            ],
        );
    }

    Settings():
        Settings.Instance
    {
        return this.settings;
    }

    Index():
        Index
    {
        return this.index;
    }

    Value():
        Slot.Order
    {
        return this.value;
    }

    Name():
        Name
    {
        return this.name;
    }

    Is_Selected():
        boolean
    {
        return this.Settings().Current_Slot_Order_Index() === this.Index();
    }

    Select():
        void
    {
        this.Settings().__Select_Current_Slot_Order_Index__(this.Index());
    }
}
