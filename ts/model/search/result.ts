import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { Name } from "../../types.js";
import { ID } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Data from "../data.js";
import * as Text from "../text.js";

export class Match
{
    private first_part_index: Index;
    private end_part_index: Index;
    private first_part_first_unit_index: Index;
    private last_part_end_unit_index: Index;

    constructor(
        {
            first_part_index,
            end_part_index,
            first_part_first_unit_index,
            last_part_end_unit_index,
        }: {
            first_part_index: Index,
            end_part_index: Index,
            first_part_first_unit_index: Index,
            last_part_end_unit_index: Index,
        },
    )
    {
        Utils.Assert(
            first_part_index > -1,
            `first_part_index must be greater than -1.`,
        );
        Utils.Assert(
            first_part_index < end_part_index,
            `first_part_index must be less than end_part_index.`,
        );
        Utils.Assert(
            first_part_first_unit_index > -1,
            `first_part_first_unit_index must be greater than -1.`,
        );
        Utils.Assert(
            last_part_end_unit_index > -1,
            `last_part_end_unit_index must be greater than -1.`,
        );

        this.first_part_index = first_part_index;
        this.end_part_index = end_part_index;
        this.first_part_first_unit_index = first_part_first_unit_index;
        this.last_part_end_unit_index = last_part_end_unit_index;
    }

    Copy():
        Match
    {
        return new Match(
            {
                first_part_index: this.first_part_index,
                end_part_index: this.end_part_index,
                first_part_first_unit_index: this.first_part_first_unit_index,
                last_part_end_unit_index: this.last_part_end_unit_index,
            },
        );
    }

    First_Part_Index():
        Index
    {
        return this.first_part_index;
    }

    End_Part_Index():
        Index
    {
        return this.end_part_index;
    }

    First_Part_First_Unit_Index():
        Index
    {
        return this.first_part_first_unit_index;
    }

    Last_Part_End_Unit_Index():
        Index
    {
        return this.last_part_end_unit_index;
    }

    Is_Equal_To(
        other: Match,
    ):
        boolean
    {
        return (
            other.first_part_index === this.first_part_index &&
            other.end_part_index === this.end_part_index &&
            other.first_part_first_unit_index === this.first_part_first_unit_index &&
            other.last_part_end_unit_index === this.last_part_end_unit_index
        );
    }

    Includes(
        other: Match,
    ):
        boolean
    {
        return (
            other.first_part_index >= this.first_part_index &&
            other.end_part_index <= this.end_part_index &&
            other.first_part_first_unit_index >= this.first_part_first_unit_index &&
            other.last_part_end_unit_index <= this.last_part_end_unit_index
        );
    }

    Shadows(
        other: Match,
    ):
        boolean
    {
        return (
            (
                other.first_part_index >= this.first_part_index &&
                other.end_part_index < this.end_part_index
            ) ||
            (
                other.first_part_index > this.first_part_index &&
                other.end_part_index <= this.end_part_index
            ) ||
            (
                other.first_part_index === this.first_part_index &&
                other.end_part_index === this.end_part_index &&
                (
                    (
                        other.first_part_first_unit_index >= this.first_part_first_unit_index &&
                        other.last_part_end_unit_index < this.last_part_end_unit_index
                    ) || (
                        other.first_part_first_unit_index > this.first_part_first_unit_index &&
                        other.last_part_end_unit_index <= this.last_part_end_unit_index
                    )
                )
            )
        );
    }
}

export class Instance
{
    private line: Text.Line.Instance;
    private matches: Array<Match>;
    private buffer: Array<Match>;

    constructor(
        line: Text.Line.Instance,
    )
    {
        this.line = line;
        this.matches = [];
        this.buffer = [];
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

    Has_Match_Including(
        other: Match,
    ):
        boolean
    {
        for (const match of this.matches) {
            if (match.Includes(other)) {
                return true;
            }
        }

        return false;
    }

    Has_Match_Shadowing(
        other: Match,
    ):
        boolean
    {
        for (const match of this.matches) {
            if (match.Shadows(other)) {
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
        let do_add: boolean = true;
        for (const held_match of this.matches) {
            if (held_match.Includes(match)) {
                do_add = false;
                this.buffer.push(held_match);
            } else if (!match.Shadows(held_match)) {
                this.buffer.push(held_match);
            }
        }

        const swap = this.buffer;
        this.buffer = this.matches;
        this.matches = swap;
        this.buffer.splice(0, this.buffer.length);

        if (do_add) {
            this.matches.push(match);
        }
    }
}

export class Version
{
    private name: Name;
    private versions: null;

    constructor(
        {
            name,
        }: {
            name: Name,
        },
    )
    {
        this.name = name;
        this.versions = null;
    }
}
