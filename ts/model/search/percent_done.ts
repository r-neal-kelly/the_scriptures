import { Count } from "../../types.js";

import * as Utils from "../../utils.js";

export class Instance
{
    private done_count: Count;
    private total_count: Count | null;

    constructor()
    {
        this.done_count = 0;
        this.total_count = null;
    }

    Value():
        Count
    {
        Utils.Assert(
            this.Has_Total_Count(),
            `does not have total_count`,
        );

        return Math.round(this.done_count * 100 / (this.total_count as Count));
    }

    Done_Count():
        Count
    {
        return this.done_count;
    }

    Increment_Done_Count():
        void
    {
        Utils.Assert(
            this.Done_Count() < this.Total_Count(),
            `cannot increment done_count above total_count`,
        );

        this.done_count += 1;
    }

    Has_Total_Count():
        boolean
    {
        return this.total_count != null;
    }

    Total_Count():
        Count
    {
        Utils.Assert(
            this.Has_Total_Count(),
            `does not have total_count`,
        );

        return this.total_count as Count;
    }

    Set_Total_Count(
        total_count: Count,
    ):
        void
    {
        Utils.Assert(
            total_count > 0,
            `cannot have a total_count of zero or less`,
        );
        Utils.Assert(
            total_count >= this.done_count,
            `can't set a total_count that's lower than the current done_count`,
        );

        this.total_count = total_count;
    }
}
