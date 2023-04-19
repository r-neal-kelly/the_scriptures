import { Index } from "../../../../../types.js";
import { Name } from "../../../../../types.js";

import * as Data from "../../../../data.js";

import * as Entity from "../../../../entity.js";
import * as Items from "./items.js";

export class Instance extends Entity.Instance
{
    private items: Items.Instance;
    private index: Index;
    private name: Name;
    private file: Data.File.Instance | null;

    constructor(
        {
            items,
            index,
            name,
            file,
        }: {
            items: Items.Instance,
            index: Index,
            name: Name,
            file: Data.File.Instance | null,
        },
    )
    {
        super();

        this.items = items;
        this.index = index;
        this.name = name;
        this.file = file;

        this.Add_Dependencies(
            [
            ],
        );
    }

    Items():
        Items.Instance
    {
        return this.items;
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
            this.Items().Has_Selected() &&
            this.Items().Selected() === this
        );
    }

    async Select():
        Promise<void>
    {
        await this.Items().Select(this);
    }
}
