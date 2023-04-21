import { Index } from "../../../types.js";

import { Value } from "../value.js";
import { Type } from "./type.js";

export interface Instance
{
    Item_Type(): Type;

    Is_Part(): boolean;
    Is_Split(): boolean;

    Index(): Index;
    Part_Index(): Index;

    Value(): Value;
}
