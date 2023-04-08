import * as Utils from "../../utils.js";

import * as Entity from "../entity.js";
import * as Data from "../data.js";
import * as Text from "../text.js";
import * as Result from "./result.js";

export class Instance extends Entity.Instance
{
    private searches: Set<Data.Search.Instance>;

    constructor(
        {
            versions,
        }: {
            versions: Array<Data.Selection.Version.Name>,
        },
    )
    {
        super();

        this.searches = new Set();

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
        this.searches.add(await Data.Singleton().Search(selection));
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

        for (const search of this.searches) {
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

                const first_partition_part: Data.Search.Partition.Part | null =
                    await search.Maybe_Partition_Part(line.Macro_Part(0).Value());
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

                    for (let idx = 1, end = line.Macro_Part_Count(); idx < end; idx += 1) {
                        const partition_part: Data.Search.Partition.Part | null =
                            await search.Maybe_Partition_Part(line.Macro_Part(idx).Value());
                        if (partition_part) {
                            for (const file_index of Object.keys(matches)) {
                                if (partition_part.hasOwnProperty(file_index)) {
                                    for (const line_index of Object.keys(matches[file_index])) {
                                        if (partition_part[file_index].hasOwnProperty(line_index)) {
                                            for (const first_part_index of Object.keys(matches[file_index][line_index])) {
                                                const end_part_index: Data.Search.Partition.Part_Index =
                                                    matches[file_index][line_index][first_part_index];
                                                if (partition_part[file_index][line_index].includes(end_part_index)) {
                                                    matches[file_index][line_index][first_part_index] += 1;
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
