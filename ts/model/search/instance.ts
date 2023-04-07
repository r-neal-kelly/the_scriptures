import * as Unicode from "../../unicode.js";

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

    async Execute(
        query: string,
    ):
        Promise<Array<Result.Instance>>
    {
        const results: Array<Result.Instance> = [];

        for (const search of this.searches) {
            const text_query: Text.Line.Instance = new Text.Instance(
                {
                    dictionary: (await search.Version().Files().Dictionary()).Text_Dictionary(),
                    value: query,
                },
            ).Line(0);

            for (let idx = 0, end = text_query.Macro_Part_Count(); idx < end; idx += 1) {
                const part: Text.Value = text_query.Macro_Part(idx).Value();
                const first_point: Text.Value = Unicode.First_Point(part);
                const uniques: Data.Search.Uniques.Instance = search.Uniques();
                if (await uniques.Has(first_point)) {
                    const parts: Array<Data.Search.Uniques.Part> =
                        await uniques.Get(first_point);
                    if (parts.includes(part)) {
                        const occurrences: Data.Search.Occurrences.Instance =
                            search.Occurrences();
                        if (await occurrences.Has(first_point)) {
                            const partition: Data.Search.Partition.Instance =
                                await occurrences.Get(first_point);
                            const info: Data.Search.Partition.Info =
                                await partition.Info();
                            const part_info = info[part];
                            console.log(part_info);
                        }
                    }
                }
            }
        }

        return results;
    }
}
