import { Float } from "../../types.js";
import { Index } from "../../types.js";

import * as Utils from "../../utils.js";

import { Value } from "./value.js";
import * as Item from "./item.js";
import * as Part from "./part";

export function From(
    break_: Part.Break.Instance,
):
    Array<Instance>
{
    const splits: Array<Instance> = [];

    const matches: RegExpMatchArray | null =
        break_.Value().match(/\S+|\s/g);
    if (matches != null) {
        let unit_idx: Index = 0;
        for (
            let match_idx = 0, match_end = matches.length;
            match_idx < match_end;
            match_idx += 1
        ) {
            splits.push(
                new Instance(
                    {
                        break_:
                            break_,
                        index:
                            match_idx,
                        first_unit_index:
                            unit_idx,
                        end_unit_index:
                            unit_idx += matches[match_idx].length,
                    },
                ),
            );
        }
    }

    return splits;
}

export class Instance implements Item.Instance
{
    private break_: Part.Break.Instance;
    private index: Index;
    private first_unit_index: Index;
    private end_unit_index: Index;
    private value: Value;

    constructor(
        {
            break_,
            index,
            first_unit_index,
            end_unit_index,
        }: {
            break_: Part.Break.Instance,
            index: Index,
            first_unit_index: Index,
            end_unit_index: Index,
        }
    )
    {
        Utils.Assert(
            index > -1,
            `index must be greater than -1.`,
        );
        Utils.Assert(
            first_unit_index > -1,
            `first_unit_index must be greater than -1.`,
        );
        Utils.Assert(
            end_unit_index > first_unit_index,
            `end_unit_index must be greater than first_unit_index.`,
        );
        Utils.Assert(
            end_unit_index <= break_.Value().length,
            `end_unit_index must be less than or equal to break_value_length.`,
        );

        this.break_ = break_;
        this.index = index;
        this.first_unit_index = first_unit_index;
        this.end_unit_index = end_unit_index;
        this.value = break_.Value().slice(
            first_unit_index,
            end_unit_index,
        );
    }

    Item_Type():
        Item.Type
    {
        return Item.Type.SPLIT;
    }

    Is_Part():
        boolean
    {
        return false;
    }

    Is_Split():
        boolean
    {
        return true;
    }

    Break():
        Part.Break.Instance
    {
        return this.break_;
    }

    Index():
        Index
    {
        return this.index;
    }

    Part_Index():
        Index
    {
        return this.Break().Index();
    }

    First_Unit_Index():
        Index
    {
        return this.first_unit_index;
    }

    End_Unit_Index():
        Index
    {
        return this.end_unit_index;
    }

    Has_Meta_Value():
        boolean
    {
        return this.Break().Has_Meta_Value();
    }

    Value():
        Value
    {
        return this.value;
    }

    Has_Image_Value():
        boolean
    {
        return false;
    }

    Is_Image_Value_Inline():
        boolean
    {
        return false;
    }

    Image_Value():
        Value
    {
        Utils.Assert(
            false,
            `Does not have an image value.`,
        );

        return ``;
    }

    Has_Size():
        boolean
    {
        return this.Break().Has_Size();
    }

    Size():
        Float | null
    {
        return this.Break().Size();
    }
}
