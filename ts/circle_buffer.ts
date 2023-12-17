import { Count } from "./types.js";
import { Index } from "./types.js";

import * as Utils from "./utils.js";

export class Instance<Unit>
{
    private buffer: Array<Unit | null>;
    private first_index: Index;
    private count: Count;
    private initial_unit: Unit | null;

    constructor(
        {
            capacity,
            initial_unit = null,
        }: {
            capacity: Count,
            initial_unit?: Unit | null,
        },
    )
    {
        Utils.Assert(
            capacity > 0,
            `capacity must be greater than 0`,
        );

        this.buffer = new Array(capacity);
        this.first_index = 0;
        this.count = 0;
        this.initial_unit = initial_unit;

        this.buffer.fill(initial_unit, 0, capacity);
    }

    Count():
        Count
    {
        return this.count;
    }

    Length():
        Count
    {
        return this.count;
    }

    Capacity():
        Count
    {
        return this.buffer.length;
    }

    Is_Empty():
        boolean
    {
        return this.count < 1;
    }

    Is_Full():
        boolean
    {
        return this.count === this.buffer.length;
    }

    Has_Units():
        boolean
    {
        return this.count > 0;
    }

    Has_Space():
        boolean
    {
        return this.count < this.buffer.length;
    }

    Add_Front(
        unit: Unit,
    ):
        void
    {
        Utils.Assert(
            this.Has_Space(),
            `buffer has no space`,
        );

        if (this.first_index > 0) {
            this.first_index -= 1;
        } else {
            this.first_index = this.buffer.length - 1;
        }

        this.buffer[this.first_index] = unit;

        this.count += 1;
    }

    Remove_Front():
        Unit
    {
        Utils.Assert(
            this.Has_Units(),
            `buffer has no units`,
        );

        const unit: Unit = this.buffer[this.first_index] as Unit;

        this.buffer[this.first_index] = this.initial_unit;

        this.first_index += 1;
        if (this.first_index === this.buffer.length) {
            this.first_index = 0;
        }

        this.count -= 1;

        return unit;
    }

    Add_Back(
        unit: Unit,
    ):
        void
    {
        Utils.Assert(
            this.Has_Space(),
            `buffer has no space`,
        );

        let next_index: Index = this.first_index + this.count;
        if (next_index >= this.buffer.length) {
            next_index -= this.buffer.length;
        }

        this.buffer[next_index] = unit;

        this.count += 1;
    }

    Remove_Back():
        Unit
    {
        Utils.Assert(
            this.Has_Units(),
            `buffer has no units`,
        );

        let last_index: Index = this.first_index + this.count - 1;
        if (last_index >= this.buffer.length) {
            last_index -= this.buffer.length;
        }

        const unit: Unit = this.buffer[last_index] as Unit;

        this.buffer[last_index] = this.initial_unit;

        this.count -= 1;

        return unit;
    }

    Add_At(
        index: Index,
        unit: Unit,
    ):
        void
    {
        Utils.Assert(
            index >= 0,
            `index is less than zero`,
        );
        Utils.Assert(
            index < this.Count(),
            `index is greater than or equal to count`,
        );
        Utils.Assert(
            this.Has_Space(),
            `buffer has no space`,
        );

        let real_index: Index = this.first_index + this.count;
        if (real_index >= this.buffer.length) {
            real_index -= this.buffer.length;
        }

        let remaining_count: Count = this.count - index;
        while (remaining_count > 0) {
            let next_real_index: Index = real_index;

            real_index -= 1;
            if (real_index < 0) {
                real_index += this.buffer.length;
            }

            this.buffer[next_real_index] = this.buffer[real_index];

            remaining_count -= 1;
        }

        this.buffer[real_index] = unit;

        this.count += 1;
    }

    Remove_At(
        index: Index,
    ):
        Unit
    {
        Utils.Assert(
            index >= 0,
            `index is less than zero`,
        );
        Utils.Assert(
            index < this.Count(),
            `index is greater than or equal to count`,
        );
        Utils.Assert(
            this.Has_Units(),
            `buffer has no units`,
        );

        let real_index: Index = this.first_index + index;
        if (real_index >= this.buffer.length) {
            real_index -= this.buffer.length;
        }

        const unit: Unit = this.buffer[real_index] as Unit;

        let remaining_count: Count = this.count - 1 - index;
        while (remaining_count > 0) {
            let previous_real_index: Index = real_index;

            real_index += 1;
            if (real_index >= this.buffer.length) {
                real_index -= this.buffer.length;
            }

            this.buffer[previous_real_index] = this.buffer[real_index];

            remaining_count -= 1;
        }

        this.buffer[real_index] = this.initial_unit;

        this.count -= 1;

        return unit;
    }

    At(
        index: Index,
    ):
        Unit
    {
        Utils.Assert(
            index >= 0,
            `index is less than zero`,
        );
        Utils.Assert(
            index < this.Count(),
            `index is greater than or equal to count`,
        );

        let real_index: Index = this.first_index + index;
        if (real_index >= this.buffer.length) {
            real_index -= this.buffer.length;
        }

        return this.buffer[real_index] as Unit;
    }

    Index_Of(
        unit: Unit,
    ):
        Index | null
    {
        for (let idx = 0, end = this.count; idx < end; idx += 1) {
            if (this.At(idx) === unit) {
                return idx;
            }
        }

        return null;
    }

    Has_Unit(
        unit: Unit,
    ):
        boolean
    {
        return this.Index_Of(unit) != null;
    }
}
