import { Index } from "../types.js";

import * as Utils from "../utils.js";

import { Key } from "./key.js";

export class Instance
{
    private buffer: Array<Key>;

    constructor()
    {
        this.buffer = [];
    }

    Maybe_Index_Of(
        key: Key,
    ):
        Index | null
    {
        const index: Index = this.buffer.indexOf(key);

        if (index >= 0) {
            return index;
        } else {
            return null;
        }
    }

    Has(
        key: Key,
    ):
        boolean
    {
        return this.Maybe_Index_Of(key) != null;
    }

    Has_Sequence(
        keys: Array<Key>,
    ):
        boolean
    {
        Utils.Assert(
            keys.length > 0,
            `keys cannot be empty`,
        );

        const first_index: Index | null = this.Maybe_Index_Of(keys[0]);

        if (first_index != null) {
            const indices: Array<Index> = [first_index];

            for (let idx = 1, end = keys.length; idx < end; idx += 1) {
                const index: Index | null = this.Maybe_Index_Of(keys[idx]);

                if (index != null) {
                    if (indices[indices.length - 1] < index) {
                        indices.push(index);
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }

            return true;
        } else {
            return false;
        }
    }

    Has_Shift_Left():
        boolean
    {
        return this.Has(Key.SHIFT_LEFT);
    }

    Has_Shift_Right():
        boolean
    {
        return this.Has(Key.SHIFT_RIGHT);
    }

    Has_Control_Left():
        boolean
    {
        return this.Has(Key.CONTROL_LEFT);
    }

    Has_Control_Right():
        boolean
    {
        return this.Has(Key.CONTROL_RIGHT);
    }

    Has_Alt_Left():
        boolean
    {
        return this.Has(Key.ALT_LEFT);
    }

    Has_Alt_Right():
        boolean
    {
        return this.Has(Key.ALT_RIGHT);
    }

    Add(
        key: Key,
    ):
        void
    {
        if (this.Has(key)) {
            this.Remove(key);
        }
        this.buffer.push(key);
    }

    Remove(
        key: Key,
    ):
        void
    {
        const index: Index | null = this.Maybe_Index_Of(key);

        if (index != null) {
            this.buffer.splice(index, 1);
        }
    }

    Keys():
        Array<Key>
    {
        return Array.from(this.buffer);
    }
}
