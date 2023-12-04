import { Index } from "../../../types.js";
import { Name } from "../../../types.js";

import * as Entity from "../../entity.js";
import * as Slot from "./instance.js";
import { Type as Slot_Type } from "./type.js";

export class Instance extends Entity.Instance
{
    private slot: Slot.Instance;
    private index: Index;
    private name: Name;

    constructor(
        {
            slot,
            index,
            name,
        }: {
            slot: Slot.Instance,
            index: Index,
            name: Name,
        },
    )
    {
        super();

        this.slot = slot;
        this.index = index;
        this.name = name;
    }

    Slot():
        Slot.Instance
    {
        return this.slot;
    }

    Index():
        Index
    {
        return this.index;
    }

    Name():
        Name
    {
        return this.name;
    }

    Is_Selected():
        boolean
    {
        return (
            this.Slot().Has_Selected_Item() &&
            this.Slot().Selected_Item() === this
        );
    }

    Select():
        void
    {
        this.Slot().Select_Item(this);
    }

    Is_In_Fonts_Slot():
        boolean
    {
        return this.Slot().Type() === Slot_Type.FONTS;
    }
}
