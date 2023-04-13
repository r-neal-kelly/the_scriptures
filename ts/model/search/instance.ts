/*
    So we can have a syntax that automatically switches
    between the sequence context and the line context.

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

    - <loves David | hates>
    Should this pretend that this is the expression?
    - <"loves David" | "hates">
    Or what we currently have it as:
    - <"loves" "David" | "hates">
    The latter is a little counter-intuitive because it will only find
    "lovesDavid" with no assumption in the executor anyway.
    However, the executor could simply know that it's in sequence mode
    and it could look for any sequence of a Part:"loves" Break:any Part:"David".
    So it would pick up "loves David", "loves. David", "loves: David", etc.
    I actually think that's a good idea., it assumes that when working with AND.
    However, it should assume that when working with OR and XOR. We really do want
    "loves David" OR "hates", and not some strangeness.
    But if the executor assumes that, then what would it do with this?
    - <"loves " "David" | "hates">
    I guess what it could do is see if the left hand operand of the AND has a break/part
    on the end, else look for something in between?
    - <", " " ">
    If we do the clever thing, then this would pick up any three parts where the middle is
    any word and the left break has the ", " and the right break the " ". I do like that idea,
    I think. It avoids the explicit need for classes, like "{Word}" or "{Break}", which we can
    add later. I do believe it's logically sound because lines have to follow that pattern,
    except when commands get in the way of course. It's always interwoven words and breaks.
    Also points get in the way. I guess if ignoring commands, then it would skip them until
    it sees either a word/break/point? 
    I think it can skip the clever logic if it determines that there is more than one part
    in the text value it's given from the text node. That makes sense. Otherwise, if the text
    is just one part, it can try to work with it in smarter ways. At any text node, it can look
    at the next node and see if it too is a text node and then work on the logic from there.
    Something else we can do additionally is make a second text type, the verbatim type,
    which is an easy addition. And then maybe we could just treat them differently? But then
    it feels like we'd do wrong to searching breaks (<", " " ">) if we always treat a verbatim
    with the non-clever logic. In any case I think all of this only matters in the sequence mode.
    I don't think default mode needs this extra complexity.

    I think that the executor should probably be additive with its matches, that way it's
    easier on memory up front. But if it turns out to be too hard, then what we can do
    is go ahead and fill up the matches array with every single line that we'll be searching.
    It's annoying bandwidth wise also, unless we have a function on match that lazily gets
    the text line. But that stinks too, because it would mostly be sync in the recursive algorithm.
    It would be kind of nice to return some matches as soon as we find them, so the view
    can start rendering as soon as possible, however, that's kind of hard to design.
    Ultimately, we're going to search every single line that's from the versions it will be
    looking at, so it may be best to just load the entire thing in memory anyway.

    One idea that would be neat is viewing chapter by chapter, or version by version, yet the
    searcher already knows what chapters/versions have hits. If we could efficiently do the
    index search method that we had before in combination with loading up a file when we need
    it, it would be smoothest of all for the serverless model. However, I'm concerned that there
    is no real way around having to download the massive space index. I remember jubilee's was over
    a 100 kb just by itself, which is now bigger than just downloading the entire jubilees file,
    when compressed. And I'm not sure there is a good way that wouldn't take forever to try to
    compress the index files.

    Alternatively, which could limit the ability to search one version at a time. It would be awful
    to limit searching to files though, like how we have the browsers set up.

    In any case, we could pass executor the data file, one by one and then we can let caller
    figure out how they're going to work with that asynchronously. That gives them the ability
    to show what they want when they can. Or we can do it version by version (which includes
    a book and a language.)

    Ultimately however, we do want to be able to search any assortment of books, langs, and versions.
    So this type can supply those kind of various methods to do that, and the underlying executor
    is maybe just given file by file? I don't even want the executor to have be async honestly, it's
    just too complicated for a search engine. So all the async stuff could be handled here.

    Something else that we can make clever about the executor is to have it only look at commands
    when one is present in a text node. Else it just skips them entirely. I like that kind of
    implicit behavior for that, I think it's probably fine in this case. I know that having
    too much implicit behavior is not good, but there needs to be a balance between average users
    and power users. I think it just makes perfect sense to only look when one is explictly asked for
    in the search language itself. We have the fuzzy operator also, which will at least cover ignore
    case. I'm not sure about the align to word issue. I know by default though that we typically don't
    want that because it picks up less results that the user might be looking for. It does bring into
    question how the executor will handle boundaries for alignment. Maybe the parser can help to
    determine that. Seeing how we only care about boundaries in a sequence, when it sees a text
    token is in a sequence, it can know what index that text is. But it should only increment the
    index on the AND operator right? I think so. We'd need to make sure that all the implicit AND
    tokens also add it up when in a sequence too. But really, it's not the index that's interesting
    it whether the text value is at the first, middle, last, or all/none of the sequence. It would be able to tell
    for first and middle, but it would either have to look forward or back to tell for last and all/none.
    But it would be worth doing that upfront so that executor doesn't have to dink around with that complication.

    Of course out of sequence, it should just check all boundaries.

    I do think that the "exact" check should not be default, but what we were discussing above should be default.
    However, maybe we could make it a unary operator? like maybe ^(God) and ^bless or maybe #(God | David), #bless
    Oh, how about @ for the align operator? btw the "align" operator should be able to be used in an out of sequences.
    It can also be combined with the "caseless" operator *. We need to rename fuzzy to caseless I think.

    I think the executor will need to be passed two arrays. One has lines that are subtractive and another that has
    matches with are additive. Will that work? Remember, NOT only works on the line level, unless there are more than
    one texts in a sequence? Because doesn't a sequence of one essentially become a non-sequence? I think that's another
    reason why we're going to have to calc the boundary in parse, because executor needs to know if the text in a sequence
    should be executed as a non-sequence, when it's the first and only text in the sequence. But in that case, we can
    just have parse remove the sequence tokens I think. Or we can return a help message when the sequence only has one
    text token. It is non-sensical in a way
    - God | <!David> === God | !David.
    whereas
    - God | <!loves David>
    means something different. Essentially any other word than loves can be in that place.

    Anyways, back to the problem of subtractive and additive. The non-sequence should be subtractive and the sequence
    additive. Essentially we need two different execution methods that can interoperate when needed? No wait, it's necessarily
    subtractive for the lines, but necessarily additive for the matches. The distinction is that our filter does not equate
    to our search. The matches are exact indices to words, whereas a line just either has something or not.

    Holdup
    - God & <!David>
    should execute just fine the way things are in the parser. That's because the sequence will find any word/break
    that is not David. It essentially acts the same as a non-sequence by default without any extra logic. It makes sense
    as written. Even this makes perfect sense:
    - God & !<!David>

    - !<David was>
    Okay, so when in a non-sequence not, it calls execute on its operand, which then calls execute on a sequence
    which then matches every part with the sequence. That function returns an array of lines that filtered out and an
    array of matches. The sequence call just returns the lines and matches too. Then the not looks at it and discards
    the matches, just using its cached array which was not altered to only return those lines which didn't have match.
    I think that makes perfect sense, even those the matches are lost.
    - !!<David was>
    but aren't the matches somehow needed here? The lines aren't because they just alternate, being new arrays that are
    returned. I don't think the matches are necessary? Because isn't this just going to return an array of what
    lines.. no wait, it would need the matches because we'd want to highlight "David was", because this will return the
    lines that do have the sequence.
    I think the problem is that I haven't figured out what this actually means. It makes sense when there is only one part
    in the sequence, it essentially acts like a non-sequence.
    An important question, what does this mean?
    - !David
    It should pick up any line that has a part that is not "David", which is is a lot of lines. And it too cares about matches!
    Doesn't it? Because we'd like to highlight every part that doesn't match that. But isn't the problem that we can either
    return lines that don't have "David" in it, or return parts that aren't "David" which would almost certainly exist in
    lines that otherwise include David? I think the point of the non-sequence is partially to only do the prior, where we
    won't even return a line if it matches its operand, and therefore that includes sequences, which essentially act as a text
    operand on the non-sequence level for a not. but the double not has me stumped atm. Does the not recalc the matches somehow?
    the matches that are lost?
*/

import * as Entity from "../entity.js";
import * as Data from "../data.js";
import * as Parser from "./parser.js";
import * as Compiler from "./compiler.js";
import * as Executor from "./executor.js";

export class Instance extends Entity.Instance
{
    private parser: Parser.Instance;
    private compiler: Compiler.Instance;
    private executor: Executor.Instance;

    constructor()
    {
        super();

        this.parser = new Parser.Instance();
        this.compiler = new Compiler.Instance();
        this.executor = new Executor.Instance();

        this.Add_Dependencies(
            [
                Data.Singleton(),
            ],
        );
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
