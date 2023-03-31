import * as Utils from "../../../utils.js";

import { Value } from "../value.js";

import { Type } from "./type.js";

export class Instance
{
    private item_type: Type;

    constructor(
        {
            item_type,
        }: {
            item_type: Type,
        },
    )
    {
        this.item_type = item_type;
    }

    Item_Type():
        Type
    {
        return this.item_type;
    }

    Is_Part():
        boolean
    {
        return this.item_type === Type.PART;
    }

    Is_Split():
        boolean
    {
        return this.item_type === Type.SPLIT;
    }

    Value():
        Value
    {
        Utils.Assert(
            false,
            `This method must be overridden to be used.`,
        );

        return ``;
    }
}
