/*
    So we can have a syntax that automatically switches
    between the sequence context and the line context.

    = God ~loves ~David
    A sequence of 5 parts, 3 words and two breaks.
    The ~ symbol means NOT in this case, so it would
    find a sequence like "God sees Sarah", but not
    "God sees David" or "God loves Sarah".

    - (God) (loves) (David)
    A line of 5 parts. Notices that any non-grouped part
    automatically acts like a group if it has only one part.
    So this would find any line that has "God", "loves", and "David"
    in it, as well as the spaces? (Not sure about the spaces, maybe they
    are ignored if they are a line group.)

    - (God) loves David
    A line and a sequence. I think the idea is that it finds the sequence
    "loves David" in any line that also contains "God". But maybe we should
    require that "loves David" also be considered a line unto itself, right?
    I think that makes sense. A sequence is a line.

    That way
    - !David
    Would find any line that doesn't have "David" in it. And in order to do
    a sequence, then we use the grouping. I think that makes the most sense.

    Therefore
    - God !loves !David
    Would find any line that has "God" but not "loves" and not "David" in it.

    Then
    - God !(loves David)
    Would find any line that has "God" and not the sequence "loves David".
    And space would only matter in the group sequence.

    - God & loves & !David
    I think this will work splendidly.

    Now what about operators in the sequence group?
    - God & (~loves David)
    I think this means that any line with "God" and a sequence that has
    something other than "loves" before " David", note the space before David.
    That would almost automatically make it work intuitively correctly, such that
    it's any other _word_ than "loves".

    - God & (loves~ David)
    Finds any line with "God" and a sequence that has "loves" in one part, "David"
    in another, and a part inbetween that is not " ", so maybe ". " for example.

    I think that makes sense. So to do a sequence, you have to use the group operator,
    which might be [] so we can use () for precedence grouping.

    Also the sequence should maybe use symbols that don't frequently appear in texts
    so a user doesn't have to escape them all the time, which could be confusing.

    - (God & ["loves"!" ""David"]) | Lord
    - (God & [loves|!hates David]) | Lord
    - ("God " & <("loves" | !"hates") & " David">) | *Lord
    The * operator will mean fuzzy, at minimum don't respect capitalization,
    but maybe it could also mean to not necessarily align on word? I think
    that we should by default not align on word anyway, so maybe just disrespect
    capitals. So *Lord would get LORD, lord, etc. Can be applied to groups too.
    - ("God " & >(("loves" | !"hates") & " David")) | *Lord
*/

import { Name } from "../../types.js";

import * as Entity from "../entity.js";
import * as Data from "../data.js";
import * as Parser from "./parser.js";
import * as Compiler from "./compiler.js";

export class Instance extends Entity.Instance
{
    private book_names: Array<Name> | null;
    private language_names: Array<Name> | null;
    private version_names: Array<Name> | null;

    private parser: Parser.Instance;
    private compiler: Compiler.Instance;

    constructor(
        {
            book_names = null,
            language_names = null,
            version_names = null,
        }: {
            book_names?: Array<Name> | null,
            language_names?: Array<Name> | null,
            version_names?: Array<Name> | null,
        },
    )
    {
        super();

        this.book_names = book_names != null ?
            Array.from(book_names) :
            null;
        this.language_names = language_names != null ?
            Array.from(language_names) :
            null;
        this.version_names = version_names != null ?
            Array.from(version_names) :
            null;

        this.parser = new Parser.Instance();
        this.compiler = new Compiler.Instance();

        this.Add_Dependencies(
            [
                Data.Singleton(),
            ],
        );
    }

    override async After_Dependencies_Are_Ready():
        Promise<void>
    {
    }
}

/*
import { Index } from "../../types.js";
import { Name } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Unicode from "../../unicode.js";

import * as Entity from "../entity.js";

import * as Text from "../text.js";
import * as Result from "./result.js";

type Query_Part_Value = string;
type Query_Part = {
    value: Query_Part_Value,
    first_unit_index: Index,
    end_unit_index: Index,
}
type Query = Array<Query_Part>;

type Data_Search_Partition_First_Part_Index = string;
type Data_Search_Partition_End_Part_Index = Data.Search.Partition.Part_Index;
type Query_Matches = {
    [index: Data.Search.Partition.File_Index]: {
        [index: Data.Search.Partition.Line_Index]: {
            [index: Data_Search_Partition_First_Part_Index]: Data_Search_Partition_End_Part_Index,
        },
    },
};

export class Instance extends Entity.Instance
{
    private book_names: Array<Name> | null;
    private language_names: Array<Name> | null;
    private version_names: Array<Name> | null;

    private ignore_markup: boolean;
    private respect_case: boolean;
    private align_on_part: boolean;

    private searches: Array<Data.Search.Instance>;

    constructor(
        {
            book_names = null,
            language_names = null,
            version_names = null,

            ignore_markup = true,
            respect_case = true,
            align_on_part = true,
        }: {
            book_names?: Array<Name> | null,
            language_names?: Array<Name> | null,
            version_names?: Array<Name> | null,

            ignore_markup?: boolean,
            respect_case?: boolean,
            align_on_part?: boolean,
        },
    )
    {
        super();

        this.book_names = book_names;
        this.language_names = language_names;
        this.version_names = version_names;

        this.ignore_markup = ignore_markup;
        this.align_on_part = align_on_part;
        this.respect_case = respect_case;

        this.searches = [];

        this.Add_Dependencies(
            [
                Data.Singleton(),
            ],
        );
    }

    async Set(
        {
            book_names = null,
            language_names = null,
            version_names = null,
        }: {
            book_names: Array<Name> | null,
            language_names: Array<Name> | null,
            version_names: Array<Name> | null,
        },
    ):
        Promise<void>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Is not ready.`,
        );

        this.book_names = book_names != null ?
            Array.from(book_names) : null;
        this.language_names = language_names != null ?
            Array.from(language_names) : null;
        this.version_names = version_names != null ?
            Array.from(version_names) : null;

        this.searches = await Data.Singleton().Searches(
            {
                book_names: this.book_names,
                language_names: this.language_names,
                version_names: this.version_names,
            },
        );
    }

    async Suggestions(
        query: string,
    ):
        Promise<Array<string>>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Is not ready.`,
        );
        Utils.Assert(
            !/\r?\n/.test(query),
            `query cannot have any newlines.`,
        );

        const suggestions: Set<string> = new Set();

        for (const search of this.searches) {
            const line: Text.Line.Instance = new Text.Instance(
                {
                    value: query,
                    dictionary: (
                        await search.Version().Files().Dictionary()
                    ).Text_Dictionary(),
                },
            ).Line(0);

            if (line.Macro_Part_Count() > 0) {
                const uniques: Data.Search.Uniques.Info =
                    await search.Uniques().Info();
                const part: Text.Part.Instance =
                    line.Macro_Part(line.Macro_Part_Count() - 1);
                if (!this.respect_case) {
                    const value: Text.Value =
                        part.Value().toLowerCase();
                    const value_first_point: Text.Value =
                        Unicode.First_Point(value);
                    const first_points: Array<Text.Value> = [
                        value_first_point.toLowerCase(),
                        value_first_point.toUpperCase(),
                    ];
                    for (const first_point of first_points) {
                        for (const unique of uniques[first_point] || []) {
                            const comparable_unique = unique.toLowerCase();
                            if (
                                comparable_unique.length > value.length &&
                                comparable_unique.slice(0, value.length) === value
                            ) {
                                suggestions.add(unique);
                            }
                        }
                    }
                } else {
                    const value: Text.Value =
                        part.Value();
                    const value_first_point: Text.Value =
                        Unicode.First_Point(value);
                    for (const unique of uniques[value_first_point] || []) {
                        if (
                            unique.length > value.length &&
                            unique.slice(0, value.length) === value
                        ) {
                            suggestions.add(unique);
                        }
                    }
                }
            }
        }

        return Array.from(suggestions).sort();
    }

    private async Queries(
        search: Data.Search.Instance,
        query: string,
    ):
        Promise<Array<Query>>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Is not ready.`,
        );
        Utils.Assert(
            !/\r?\n/.test(query),
            `query cannot have any newlines.`,
        );

        let queries: Array<Query> = [];

        if (query.length > 0) {
            const uniques: Data.Search.Uniques.Info =
                await search.Uniques().Info();
            const line: Text.Line.Instance = new Text.Instance(
                {
                    value: query,
                    dictionary: (
                        await search.Version().Files().Dictionary()
                    ).Text_Dictionary(),
                },
            ).Line(0);

            for (
                let part_idx = 0, part_end = line.Macro_Part_Count();
                part_idx < part_end;
                part_idx += 1
            ) {
                const part: Text.Part.Instance =
                    line.Macro_Part(part_idx);
                Utils.Assert(
                    !this.ignore_markup || !part.Is_Command(),
                    `A query cannot contain a command when ignoring markup.`,
                );

                const part_uniques: Map<Query_Part_Value, Query_Part> = new Map();
                if (
                    !this.align_on_part &&
                    (
                        part_idx === 0 ||
                        part_idx === part_end - 1
                    )
                ) {
                    const value: Text.Value = !this.respect_case ?
                        part.Value().toLowerCase() :
                        part.Value();
                    if (part_idx === 0) {
                        for (const first_point of Object.keys(uniques)) {
                            for (const unique of uniques[first_point]) {
                                if (!part_uniques.has(unique)) {
                                    const comparable_unique = !this.respect_case ?
                                        unique.toLowerCase() :
                                        unique;
                                    if (
                                        comparable_unique.length >= value.length &&
                                        comparable_unique.slice(
                                            comparable_unique.length - value.length,
                                            comparable_unique.length,
                                        ) === value
                                    ) {
                                        part_uniques.set(
                                            unique,
                                            {
                                                value: unique,
                                                first_unit_index: comparable_unique.length - value.length,
                                                end_unit_index: comparable_unique.length,
                                            },
                                        );
                                    }
                                }
                            }
                        }
                    } else if (part_idx === part_end - 1) {
                        const value_first_point: Text.Value =
                            Unicode.First_Point(value);
                        const first_points: Array<Text.Value> = !this.respect_case ?
                            [
                                value_first_point.toLowerCase(),
                                value_first_point.toUpperCase(),
                            ] : [
                                value_first_point,
                            ];
                        for (const first_point of first_points) {
                            for (const unique of uniques[first_point] || []) {
                                if (!part_uniques.has(unique)) {
                                    const comparable_unique = !this.respect_case ?
                                        unique.toLowerCase() :
                                        unique;
                                    if (
                                        comparable_unique.length >= value.length &&
                                        comparable_unique.slice(
                                            0,
                                            value.length,
                                        ) === value
                                    ) {
                                        part_uniques.set(
                                            unique,
                                            {
                                                value: unique,
                                                first_unit_index: 0,
                                                end_unit_index: value.length,
                                            },
                                        );
                                    }
                                }
                            }
                        }
                    }
                } else if (!this.respect_case) {
                    const value: Text.Value =
                        part.Value().toLowerCase();
                    const value_first_point: Text.Value =
                        Unicode.First_Point(value);
                    const first_points: Array<Text.Value> = [
                        value_first_point.toLowerCase(),
                        value_first_point.toUpperCase(),
                    ];
                    for (const first_point of first_points) {
                        for (const unique of uniques[first_point] || []) {
                            if (!part_uniques.has(unique)) {
                                if (unique.toLowerCase() === value) {
                                    part_uniques.set(
                                        unique,
                                        {
                                            value: unique,
                                            first_unit_index: 0,
                                            end_unit_index: unique.length,
                                        },
                                    );
                                }
                            }
                        }
                    }
                } else {
                    const value: Text.Value =
                        part.Value();
                    const value_first_point: Text.Value =
                        Unicode.First_Point(value);
                    if (
                        uniques[value_first_point] != null &&
                        uniques[value_first_point].includes(value)
                    ) {
                        if (!part_uniques.has(value)) {
                            part_uniques.set(
                                value,
                                {
                                    value: value,
                                    first_unit_index: 0,
                                    end_unit_index: value.length,
                                },
                            );
                        }
                    }
                }

                if (part_uniques.size > 0) {
                    if (part_idx === 0) {
                        for (const part_unique of part_uniques.values()) {
                            queries.push([part_unique]);
                        }
                    } else {
                        const previous_queries: Array<Query> = queries;
                        queries = [];
                        for (const previous_query of previous_queries) {
                            for (const part_unique of part_uniques.values()) {
                                queries.push(previous_query.concat(part_unique));
                            }
                        }
                    }
                } else {
                    queries = [];
                    break;
                }
            }
        }

        return queries;
    }

    async Results(
        query: string,
    ):
        Promise<Array<Result.Instance>>
    {
        Utils.Assert(
            this.Is_Ready(),
            `Is not ready.`,
        );
        Utils.Assert(
            !/\r?\n/.test(query),
            `query cannot have any newlines.`,
        );

        const results: Array<Result.Instance> = [];

        if (query.length > 0) {
            for (const search of this.searches) {
                const queries: Array<Query> =
                    await this.Queries(search, query);
                const commands: Data.Search.Partition.Parts | null = queries.length > 0 && this.ignore_markup ?
                    await search.Maybe_Partition_Parts(Text.Part.Command.Brace.OPEN) :
                    null;

                function Adjusted_End_Part_Index(
                    file_index: Data.Search.Partition.File_Index,
                    line_index: Data.Search.Partition.Line_Index,
                    current_end_part_index: Data_Search_Partition_End_Part_Index,
                ):
                    Data_Search_Partition_End_Part_Index
                {
                    if (commands != null) {
                        for (const command of Object.keys(commands)) {
                            if (commands[command].hasOwnProperty(file_index)) {
                                if (commands[command][file_index].hasOwnProperty(line_index)) {
                                    if (commands[command][file_index][line_index].includes(current_end_part_index)) {
                                        current_end_part_index += 1;
                                    }
                                }
                            }
                        }
                    }

                    return current_end_part_index;
                }

                for (const query of queries) {
                    Utils.Assert(
                        query.length > 0,
                        `query should have a length greater than 0, queries array is messed up.`,
                    );

                    const matches: Query_Matches = {};

                    const first_partition_part: Data.Search.Partition.Part =
                        await search.Maybe_Partition_Part(query[0].value) as Data.Search.Partition.Part;
                    Utils.Assert(
                        first_partition_part != null,
                        `first_partition_part should not be null, queries array is messed up.`,
                    );
                    for (const file_index of Object.keys(first_partition_part)) {
                        matches[file_index] = {};
                        for (const line_index of Object.keys(first_partition_part[file_index])) {
                            matches[file_index][line_index] = {};
                            for (const part_index of first_partition_part[file_index][line_index]) {
                                matches[file_index][line_index][part_index.toString()] = part_index + 1;
                            }
                        }
                    }

                    for (let idx = 1, end = query.length; idx < end; idx += 1) {
                        const partition_part: Data.Search.Partition.Part =
                            await search.Maybe_Partition_Part(query[idx].value) as Data.Search.Partition.Part;
                        Utils.Assert(
                            partition_part != null,
                            `partition_part should not be null, queries array is messed up.`,
                        );
                        for (const file_index of Object.keys(matches)) {
                            if (partition_part.hasOwnProperty(file_index)) {
                                for (const line_index of Object.keys(matches[file_index])) {
                                    if (partition_part[file_index].hasOwnProperty(line_index)) {
                                        for (const first_part_index of Object.keys(matches[file_index][line_index])) {
                                            const end_part_index: Data_Search_Partition_End_Part_Index =
                                                Adjusted_End_Part_Index(
                                                    file_index,
                                                    line_index,
                                                    matches[file_index][line_index][first_part_index],
                                                );
                                            if (partition_part[file_index][line_index].includes(end_part_index)) {
                                                matches[file_index][line_index][first_part_index] = end_part_index + 1;
                                            } else {
                                                delete matches[file_index][line_index][first_part_index];
                                            }
                                        }
                                    } else {
                                        delete matches[file_index][line_index];
                                    }
                                }
                            } else {
                                delete matches[file_index];
                            }
                        }
                    }

                    for (const file_index of Object.keys(matches)) {
                        for (const line_index of Object.keys(matches[file_index])) {
                            for (const first_part_index of Object.keys(matches[file_index][line_index])) {
                                results.push(
                                    new Result.Instance(
                                        {
                                            search: search,
                                            file_index: Number.parseInt(file_index),
                                            line_index: Number.parseInt(line_index),
                                            first_part_index: Number.parseInt(first_part_index),
                                            end_part_index: matches[file_index][line_index][first_part_index],
                                            first_part_first_unit_index: query[0].first_unit_index,
                                            last_part_end_unit_index: query[query.length - 1].end_unit_index,
                                        },
                                    ),
                                );
                            }
                        }
                    }
                }
            }
        }

        return results;
    }

    override async After_Dependencies_Are_Ready():
        Promise<void>
    {
        this.searches = await Data.Singleton().Searches(
            {
                book_names: this.book_names,
                language_names: this.language_names,
                version_names: this.version_names,
            },
        );
    }
}
*/
