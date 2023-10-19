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

    Has_Meta_Value(): boolean;
    Value(): Value;

    Has_Image_Value(): boolean;
    Is_Image_Value_Inline(): boolean;
    Image_Value(): Value;
}
