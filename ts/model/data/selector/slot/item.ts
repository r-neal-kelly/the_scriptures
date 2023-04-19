import { Index } from "../../../../types.js";
import { Name } from "../../../../types.js";

import * as Data from "../../../data.js";

import * as Entity from "../../../entity.js";
import * as Slot from "./instance.js";

export class Instance extends Entity.Instance
{
    private slot: Slot.Instance;
    private index: Index;
    private name: Name;
    private file: Data.File.Instance | null;

    constructor(
        {
            slot,
            index,
            name,
            file,
        }: {
            slot: Slot.Instance,
            index: Index,
            name: Name,
            file: Data.File.Instance | null,
        },
    )
    {
        super();

        this.slot = slot;
        this.index = index;
        this.name = name;
        this.file = file;

        this.Add_Dependencies(
            [
            ],
        );
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

    Title():
        Name
    {
        if (this.file != null) {
            return this.file.Title();
        } else {
            return this.name;
        }
    }

    Is_Selected():
        boolean
    {
        return (
            this.Slot().Has_Selected_Item() &&
            this.Slot().Selected_Item() === this
        );
    }

    __Select__():
        void
    {
    }

    Select():
        void
    {
        this.Slot().Select_Item(this);
    }
}
