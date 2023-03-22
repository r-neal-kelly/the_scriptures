import { Index } from "../../../../types.js";
import { Name } from "../../../../types.js";

import * as Slot from "./instance.js";

export class Instance
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
}
