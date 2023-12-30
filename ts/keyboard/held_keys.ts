import { Count } from "../types.js";
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

    Count():
        Count
    {
        return this.buffer.length;
    }

    At(
        index: Index,
    ):
        Key
    {
        Utils.Assert(
            index >= 0 && index < this.Count(),
            `invalid index: ${index}`,
        );

        return this.buffer[index];
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

    Clear():
        void
    {
        this.buffer.splice(0, this.buffer.length);
    }

    Is(
        keys: Array<Key>,
    ):
        boolean
    {
        if (keys.length === this.buffer.length) {
            for (let idx = 0, end = keys.length; idx < end; idx += 1) {
                if (keys[idx] !== this.buffer[idx]) {
                    return false;
                }
            }

            return true;
        } else {
            return false;
        }
    }

    Keys():
        Array<Key>
    {
        return Array.from(this.buffer);
    }
}
