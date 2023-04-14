import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Text from "../text.js";

export class Instance
{
    private line: Text.Line.Instance;
    private matches: Array<Match>;

    constructor(
        line: Text.Line.Instance,
    )
    {
        this.line = line;
        this.matches = [];
    }

    Copy():
        Instance
    {
        const result: Instance = new Instance(this.line);
        for (const match of this.matches) {
            result.matches.push(match.Copy());
        }

        return result;
    }

    Combine(
        other: Instance,
    ):
        Instance
    {
        for (let idx = 0, end = other.Match_Count(); idx < end; idx += 1) {
            this.Try_Add_Match(other.Match(idx));
        }
        other.matches = [];

        return this;
    }

    Line():
        Text.Line.Instance
    {
        return this.line;
    }

    Has_Match_Equal_To(
        other: Match,
    ):
        boolean
    {
        for (const match of this.matches) {
            if (match.Is_Equal_To(other)) {
                return true;
            }
        }

        return false;
    }

    Match_Count():
        Count
    {
        return this.matches.length;
    }

    Match(
        match_index: Index,
    ):
        Match
    {
        Utils.Assert(
            match_index > -1,
            `match_index must be greater than -1.`,
        );
        Utils.Assert(
            match_index < this.Match_Count(),
            `match_index must be less than match_count.`,
        );

        return this.matches[match_index];
    }

    Try_Add_Match(
        match: Match,
    ):
        void
    {
        if (!this.Has_Match_Equal_To(match)) {
            this.matches.push(match);
        }
    }
}

export class Match
{
    private start_part_index: Index;
    private end_part_index: Index;
    private start_part_start_unit_index: Index;
    private end_part_end_unit_index: Index;

    constructor(
        {
            start_part_index,
            end_part_index,
            start_part_start_unit_index,
            end_part_end_unit_index,
        }: {
            start_part_index: Index,
            end_part_index: Index,
            start_part_start_unit_index: Index,
            end_part_end_unit_index: Index,
        },
    )
    {
        this.start_part_index = start_part_index;
        this.end_part_index = end_part_index;
        this.start_part_start_unit_index = start_part_start_unit_index;
        this.end_part_end_unit_index = end_part_end_unit_index;
    }

    Copy():
        Match
    {
        return new Match(
            {
                start_part_index: this.start_part_index,
                end_part_index: this.end_part_index,
                start_part_start_unit_index: this.start_part_start_unit_index,
                end_part_end_unit_index: this.end_part_end_unit_index,
            },
        );
    }

    Start_Part_Index():
        Index
    {
        return this.start_part_index;
    }

    End_Part_Index():
        Index
    {
        return this.end_part_index;
    }

    Start_Part_Start_Unit_Index():
        Index
    {
        return this.start_part_start_unit_index;
    }

    End_Part_End_Unit_Index():
        Index
    {
        return this.end_part_end_unit_index;
    }

    Is_Equal_To(
        other: Match,
    ):
        boolean
    {
        return (
            other.start_part_index === this.start_part_index &&
            other.end_part_index === this.end_part_index &&
            other.start_part_start_unit_index === this.start_part_start_unit_index &&
            other.end_part_end_unit_index === this.end_part_end_unit_index
        );
    }

    Includes(
        other: Match,
    ):
        boolean
    {
        return (
            other.start_part_index >= this.start_part_index &&
            other.end_part_index <= this.end_part_index &&
            other.start_part_start_unit_index >= this.start_part_start_unit_index &&
            other.end_part_end_unit_index <= this.end_part_end_unit_index
        );
    }

    Shadows(
        other: Match,
    ):
        boolean
    {
        return (
            (
                other.start_part_index >= this.start_part_index &&
                other.end_part_index < this.end_part_index
            ) ||
            (
                other.start_part_index > this.start_part_index &&
                other.end_part_index <= this.end_part_index
            ) ||
            (
                other.start_part_index === this.start_part_index &&
                other.end_part_index === this.end_part_index &&
                (
                    (
                        other.start_part_start_unit_index >= this.start_part_start_unit_index &&
                        other.end_part_end_unit_index < this.end_part_end_unit_index
                    ) || (
                        other.start_part_start_unit_index > this.start_part_start_unit_index &&
                        other.end_part_end_unit_index <= this.end_part_end_unit_index
                    )
                )
            )
        );
    }
}
