import { Index } from "../../types.js";

import * as Utils from "../../utils.js";

import { Value } from "./value.js";
import * as Part from "./part.js";

export class Instance
{
    private parts: Array<Part.Instance>;

    constructor()
    {
        this.parts = [];
    }

    Value():
        Value
    {
        let value: string = ``;

        for (const part of this.parts) {
            value += part.Value();
        }

        return value;
    }

    Has_Part(
        part: Part.Instance,
    ):
        boolean
    {
        return this.parts.indexOf(part) > -1;
    }

    Has_Part_Index(
        part_index: Index,
    ):
        boolean
    {
        return (
            part_index > -1 &&
            part_index < this.parts.length
        );
    }

    Part(
        part_index: Index,
    ):
        Part.Instance
    {
        Utils.Assert(
            this.Has_Part_Index(part_index),
            `Does not have a part at the index.`,
        );

        return this.parts[part_index];
    }

    Part_Index(
        part: Part.Instance,
    ):
        Index
    {
        const index: Index = this.parts.indexOf(part);

        Utils.Assert(
            index > -1,
            `Does not have the part.`,
        );

        return index;
    }

    Parts():
        Array<Part.Instance>
    {
        return Array.from(this.parts);
    }

    Add_Part(
        part: Part.Instance,
    ):
        void
    {
        const result: boolean = this.Try_Add_Part(part);

        Utils.Assert(
            result === true,
            `Failed to add part`,
        );
    }

    Try_Add_Part(
        part: Part.Instance,
    ):
        boolean
    {
        if (this.parts.length === 0) {
            this.parts.push(part);

            return true;
        } else {
            const previous_part: Part.Instance = this.parts[this.parts.length - 1];

            if (part.Is_Break()) {
                if (!previous_part.Is_Break()) {
                    this.parts.push(part);

                    return true;
                } else {
                    return false;
                }
            } else {
                if (previous_part.Is_Break()) {
                    const previous_value: string = previous_part.Value();
                    if (/\S/.test(previous_value[previous_value.length - 1])) {
                        this.parts.push(part);

                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
    }
}
