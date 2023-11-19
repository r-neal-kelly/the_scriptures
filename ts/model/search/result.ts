import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Data from "../data.js";
import * as Text from "../text.js";

export class Candidate
{
    private column_index: Index;
    private row_index: Index;
    private first_part_index: Index;
    private end_part_index: Index;
    private first_part_first_unit_index: Index;
    private last_part_end_unit_index: Index;

    constructor(
        {
            column_index,
            row_index,
            first_part_index,
            end_part_index,
            first_part_first_unit_index,
            last_part_end_unit_index,
        }: {
            column_index: Index,
            row_index: Index,
            first_part_index: Index,
            end_part_index: Index,
            first_part_first_unit_index: Index,
            last_part_end_unit_index: Index,
        },
    )
    {
        Utils.Assert(
            column_index > -1,
            `column_index must be greater than -1.`,
        );
        Utils.Assert(
            row_index > -1,
            `row_index must be greater than -1.`,
        );
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

        this.column_index = column_index;
        this.row_index = row_index;
        this.first_part_index = first_part_index;
        this.end_part_index = end_part_index;
        this.first_part_first_unit_index = first_part_first_unit_index;
        this.last_part_end_unit_index = last_part_end_unit_index;
    }

    Copy():
        Candidate
    {
        return new Candidate(
            {
                column_index: this.column_index,
                row_index: this.row_index,
                first_part_index: this.first_part_index,
                end_part_index: this.end_part_index,
                first_part_first_unit_index: this.first_part_first_unit_index,
                last_part_end_unit_index: this.last_part_end_unit_index,
            },
        );
    }

    Column_Index():
        Index
    {
        return this.column_index;
    }

    Row_Index():
        Index
    {
        return this.row_index;
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
        other: Candidate,
    ):
        boolean
    {
        return (
            other.column_index === this.column_index &&
            other.row_index === this.row_index &&
            other.first_part_index === this.first_part_index &&
            other.end_part_index === this.end_part_index &&
            other.first_part_first_unit_index === this.first_part_first_unit_index &&
            other.last_part_end_unit_index === this.last_part_end_unit_index
        );
    }

    Includes(
        other: Candidate,
    ):
        boolean
    {
        return (
            other.column_index === this.column_index &&
            other.row_index === this.row_index &&
            other.first_part_index >= this.first_part_index &&
            other.end_part_index <= this.end_part_index &&
            other.first_part_first_unit_index >= this.first_part_first_unit_index &&
            other.last_part_end_unit_index <= this.last_part_end_unit_index
        );
    }

    Shadows(
        other: Candidate,
    ):
        boolean
    {
        return (
            other.column_index === this.column_index &&
            other.row_index === this.row_index &&
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

export class Runner
{
    private line: Text.Line.Instance;
    private candidates: Array<Candidate>;
    private matches: Array<Candidate>;
    private buffer: Array<Candidate>;

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
        Runner
    {
        const result: Runner = new Runner(this.line);

        for (const candidate of this.candidates) {
            result.candidates.push(candidate.Copy());
        }
        for (const match of this.matches) {
            result.matches.push(match.Copy());
        }

        return result;
    }

    Combine(
        other: Runner,
    ):
        Runner
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
        Candidate
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

    Has_Candidate_Equal_To(
        other_candidate: Candidate,
    ):
        boolean
    {
        for (const candidate of this.candidates) {
            if (candidate.Is_Equal_To(other_candidate)) {
                return true;
            }
        }
        return false;
    }

    Try_Add_Candidate(
        candidate: Candidate,
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
        Candidate
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

    Has_Match_Equal_To(
        other_match: Candidate,
    ):
        boolean
    {
        for (const match of this.matches) {
            if (match.Is_Equal_To(other_match)) {
                return true;
            }
        }
        return false;
    }

    Try_Add_Match(
        match: Candidate,
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
}

export class Instance
{
    private line: Text.Line.Instance;
    private total_match_count: Count;
    private matches: {
        [column_index: Index]: {
            [row_index: Index]: Array<Match>,
        },
    };

    constructor(
        runner: Runner,
    )
    {
        this.line = runner.Line();
        this.total_match_count = runner.Match_Count();
        this.matches = {};

        for (
            let match_idx = 0, match_end = runner.Match_Count();
            match_idx < match_end;
            match_idx += 1
        ) {
            const match: Candidate = runner.Match(match_idx);
            const column_index: Index = match.Column_Index();
            const row_index: Index = match.Row_Index();
            if (this.matches[column_index] == null) {
                this.matches[column_index] = {};
            }
            if (this.matches[column_index][row_index] == null) {
                this.matches[column_index][row_index] = [];
            }
            this.matches[column_index][row_index].push(
                new Match(
                    {
                        first_part_index: match.First_Part_Index(),
                        end_part_index: match.End_Part_Index(),
                        first_part_first_unit_index: match.First_Part_First_Unit_Index(),
                        last_part_end_unit_index: match.Last_Part_End_Unit_Index(),
                    },
                ),
            );
        }
    }

    Line():
        Text.Line.Instance
    {
        return this.line;
    }

    Column(
        column_index: Index,
    ):
        Text.Column.Instance
    {
        return this.Line().Column(column_index);
    }

    Row(
        column_index: Index,
        row_index: Index,
    ):
        Text.Row.Instance
    {
        return this.Line().Column(column_index).Row(row_index);
    }

    Total_Match_Count():
        Count
    {
        return this.total_match_count;
    }

    Match_Count(
        column_index: Index,
        row_index: Index,
    ):
        Count
    {
        if (
            this.matches[column_index] == null ||
            this.matches[column_index][row_index] == null
        ) {
            return 0;
        } else {
            return this.matches[column_index][row_index].length;
        }
    }

    Match(
        column_index: Index,
        row_index: Index,
        match_index: Index,
    ):
        Match
    {
        Utils.Assert(
            this.matches[column_index] != null,
            `Does not have column.`,
        );
        Utils.Assert(
            this.matches[column_index][row_index] != null,
            `Does not have row.`,
        );
        Utils.Assert(
            match_index > -1 &&
            match_index < this.matches[column_index][row_index].length,
            `Does not have match.`,
        );

        return this.matches[column_index][row_index][match_index];
    }

    Matches(
        column_index: Index,
        row_index: Index,
    ):
        Array<Match>
    {
        if (
            this.matches[column_index] == null ||
            this.matches[column_index][row_index] == null
        ) {
            return [];
        } else {
            return Array.from(this.matches[column_index][row_index]);
        }
    }
}

export type Version = Map<Data.File.Instance, Array<Instance>>;
export type Versions = Map<Data.Version.Instance, Version>;
