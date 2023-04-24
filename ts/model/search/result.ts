import { Count } from "../../types.js";
import { Index } from "../../types.js";

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

    Last_Part_Index():
        Index
    {
        return this.end_part_index - 1;
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
    private candidates: Array<Match>;
    private matches: Array<Match>;
    private buffer: Array<Match>;

    constructor(
        line: Text.Line.Instance,
    )
    {
        this.line = line;
        this.candidates = [];
        this.matches = [];
        this.buffer = [];
    }

    Copy():
        Instance
    {
        const result: Instance = new Instance(this.line);

        for (const candidate of this.candidates) {
            result.candidates.push(candidate.Copy());
        }
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
        for (let idx = 0, end = other.Candidate_Count(); idx < end; idx += 1) {
            this.Try_Add_Candidate(other.Candidate(idx));
        }
        other.candidates = [];

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

    Candidate_Count():
        Count
    {
        return this.candidates.length;
    }

    Candidate(
        candidate_index: Index,
    ):
        Match
    {
        Utils.Assert(
            candidate_index > -1,
            `candidate_index must be greater than -1.`,
        );
        Utils.Assert(
            candidate_index < this.Candidate_Count(),
            `candidate_index must be less than candidate_count.`,
        );

        return this.candidates[candidate_index];
    }

    Try_Add_Candidate(
        candidate: Match,
    ):
        void
    {
        let do_add: boolean = true;
        for (const held_candidate of this.candidates) {
            if (held_candidate.Includes(candidate)) {
                do_add = false;
                this.buffer.push(held_candidate);
            } else if (!candidate.Shadows(held_candidate)) {
                this.buffer.push(held_candidate);
            }
        }

        const swap = this.buffer;
        this.buffer = this.candidates;
        this.candidates = swap;
        this.buffer.splice(0, this.buffer.length);

        if (do_add) {
            this.candidates.push(candidate);
        }
    }

    Clear_Candidates():
        void
    {
        this.candidates.splice(0, this.candidates.length);
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

export type Version = Map<Data.File.Instance, Array<Instance>>;
export type Versions = Map<Data.Version.Instance, Version>;
