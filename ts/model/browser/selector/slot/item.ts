import { Index } from "../../../../types.js";
import { Name } from "../../../../types.js";

import * as Data from "../../../data.js";

import * as Items from "./items.js";

export class Instance
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
        this.items = items;
        this.index = index;
        this.name = name;
        this.file = file;
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
