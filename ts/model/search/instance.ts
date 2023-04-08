import { Index, Name } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Entity from "../entity.js";
import * as Data from "../data.js";
import * as Text from "../text.js";
import * as Result from "./result.js";

export class Instance extends Entity.Instance
{
    private searches: { [index: Name]: Data.Search.Instance };
    private ignore_markup: boolean;
    private align_on_word: boolean;

    constructor(
        {
            versions,
            ignore_markup = true,
            align_on_word = true,
        }: {
            versions: Array<Data.Selection.Version.Name>,
            ignore_markup?: boolean,
            align_on_word?: boolean,
        },
    )
    {
        super();

        this.searches = {};
        this.ignore_markup = ignore_markup;
        this.align_on_word = align_on_word;

        for (const version of versions) {
            this.Add_Version(version);
        }

        this.Is_Ready_After(
            [
                Data.Singleton(),
            ],
        );
    }

    async Add_Version(
        selection: Data.Selection.Version.Name,
    ):
        Promise<void>
    {
        const selection_string: Name = selection.String();

        if (!this.searches.hasOwnProperty(selection_string)) {
            this.searches[selection_string] = await Data.Singleton().Search(selection);
        }
    }

    Remove_Version(
        selection: Data.Selection.Version.Name,
    ):
        void
    {
        delete this.searches[selection.String()];
    }

    // For right now, we're just going to match parts exactly, but
    // we could add a mode that actually looks within parts, which
    // would be really useful for a lot of cases, e.g. ` ¶ ` should
    // be used to match `¶ `. The problem is that the uniques would
    // have to be searched completely, instead of just in the first
    // point array.

    // We also need to be able to essentially ignore commands. That
    // logic should be done when the partition does not include the
    // part_index of a match. And instead of increasing end_part_index
    // by 1, we would increase it by 1 and the number of commands
    // after it.

    async Execute(
        query: string,
    ):
        Promise<Array<Result.Instance>>
    {
        Utils.Assert(
            !/\r?\n/.test(query),
            `query cannot have any newlines.`,
        );

        const results: Array<Result.Instance> = [];

        for (const search of Object.values(this.searches)) {
            const line: Text.Line.Instance = new Text.Instance(
                {
                    dictionary: (await search.Version().Files().Dictionary()).Text_Dictionary(),
                    value: query,
                },
            ).Line(0);

            if (line.Macro_Part_Count() > 0) {
                type Data_Search_Partition_Part_Index_String = string;

                let matches: {
                    [index: Data.Search.Partition.File_Index]: {
                        [index: Data.Search.Partition.Line_Index]: {
                            [index: Data_Search_Partition_Part_Index_String]: Data.Search.Partition.Part_Index,
                        },
                    },
                } = {};

                const first_part: Text.Part.Instance = line.Macro_Part(0);
                Utils.Assert(
                    !this.ignore_markup || !first_part.Is_Command(),
                    `A query cannot contain a command while ignoring markup.`,
                );

                const first_partition_part: Data.Search.Partition.Part | null =
                    await search.Maybe_Partition_Part(first_part.Value());
                if (first_partition_part) {
                    for (const file_index of Object.keys(first_partition_part)) {
                        matches[file_index] = {};
                        for (const line_index of Object.keys(first_partition_part[file_index])) {
                            matches[file_index][line_index] = {};
                            for (const part_index of first_partition_part[file_index][line_index]) {
                                matches[file_index][line_index][part_index.toString()] = part_index + 1;
                            }
                        }
                    }

                    const commands: Data.Search.Partition.Parts | null = this.ignore_markup ?
                        await search.Maybe_Partition_Parts(Text.Part.Command.Brace.OPEN) :
                        null;

                    function Adjusted_End_Part_Index(
                        file_index: Data.Search.Partition.File_Index,
                        line_index: Data.Search.Partition.Line_Index,
                        first_part_index: Data_Search_Partition_Part_Index_String,
                    ):
                        Data.Search.Partition.Part_Index
                    {
                        let end_part_index: Data.Search.Partition.Part_Index =
                            matches[file_index][line_index][first_part_index];

                        if (commands != null) {
                            for (const command of Object.keys(commands)) {
                                if (commands[command].hasOwnProperty(file_index)) {
                                    if (commands[command][file_index].hasOwnProperty(line_index)) {
                                        if (commands[command][file_index][line_index].includes(end_part_index)) {
                                            end_part_index += 1;
                                        }
                                    }
                                }
                            }
                        }

                        return end_part_index;
                    }

                    for (let idx = 1, end = line.Macro_Part_Count(); idx < end; idx += 1) {
                        const part: Text.Part.Instance = line.Macro_Part(idx);
                        Utils.Assert(
                            !this.ignore_markup || !part.Is_Command(),
                            `A query cannot contain a command while ignoring markup.`,
                        );

                        const partition_part: Data.Search.Partition.Part | null =
                            await search.Maybe_Partition_Part(part.Value());
                        if (partition_part) {
                            for (const file_index of Object.keys(matches)) {
                                if (partition_part.hasOwnProperty(file_index)) {
                                    for (const line_index of Object.keys(matches[file_index])) {
                                        if (partition_part[file_index].hasOwnProperty(line_index)) {
                                            for (const first_part_index of Object.keys(matches[file_index][line_index])) {
                                                const end_part_index: Data.Search.Partition.Part_Index =
                                                    Adjusted_End_Part_Index(file_index, line_index, first_part_index);
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
                        } else {
                            matches = {};
                            break;
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
                                            first_part_offset: 0,
                                            last_part_offset: 0,
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
}
