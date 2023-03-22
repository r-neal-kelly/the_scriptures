import { Name } from "../../../types.js";

import { Type } from "./type.js";

export class Type_And_Name
{
    private type: Type;
    private name: Name | null;

    constructor(
        {
            type,
            name = null,
        }: {
            type: Type,
            name?: Name | null,
        },
    )
    {
        this.type = type;
        this.name = name;
    }

    Type():
        Type
    {
        return this.type;
    }

    Name():
        Name | null
    {
        return this.name;
    }
}
