import { Count } from "../../../types.js";
import { Name } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Name_Sorter from "../../name_sorter.js";
import * as Text from "../../text.js";

import * as Buffer_Counts from "../buffer_counts.js";
import
{
    FULL_FILE_COUNT as FILE_COUNT,
    FULL_AVG_LINE_COUNT as AVG_LINE_COUNT,
    FULL_AVG_COLUMN_COUNT as AVG_COLUMN_COUNT,
    FULL_AVG_ROW_COUNT as AVG_ROW_COUNT,
    FULL_AVG_SEGMENT_COUNT as AVG_SEGMENT_COUNT,
    FULL_AVG_ITEM_COUNT as AVG_ITEM_COUNT,

    FULL_LINES as LINES,
    FULL_COLUMNS as COLUMNS,
    FULL_MACRO_ROWS as MACRO_ROWS,
    FULL_MICRO_ROWS as MICRO_ROWS,
    FULL_SEGMENTS as SEGMENTS,
} from "../buffer_counts.js";

export class Info
{
    private unique_language_names: Array<Name>;

    private total_unit_count: Count;
    private total_point_count: Count;
    private total_letter_count: Count;
    private total_marker_count: Count;
    private total_meta_letter_count: Count;
    private total_word_count: Count;
    private total_break_count: Count;
    private total_meta_word_count: Count;
    private total_part_count: Count;
    private total_line_count: Count;
    private total_file_count: Count;

    private language_unit_counts: { [language_name: Name]: Count };
    private language_point_counts: { [language_name: Name]: Count };
    private language_letter_counts: { [language_name: Name]: Count };
    private language_marker_counts: { [language_name: Name]: Count };
    private language_meta_letter_counts: { [language_name: Name]: Count };
    private language_word_counts: { [language_name: Name]: Count };
    private language_break_counts: { [language_name: Name]: Count };
    private language_meta_word_counts: { [language_name: Name]: Count };
    private language_part_counts: { [language_name: Name]: Count };
    private language_line_counts: { [language_name: Name]: Count };
    private language_file_counts: { [language_name: Name]: Count };

    private buffer_counts: Buffer_Counts.Full_Buffer;

    constructor(
        {
            json = null,
        }: {
            json?: string | null,
        },
    )
    {
        if (json) {
            const primitive: Info = JSON.parse(json) as Info;

            this.unique_language_names = primitive.unique_language_names;

            this.total_unit_count = primitive.total_unit_count;
            this.total_point_count = primitive.total_point_count;
            this.total_letter_count = primitive.total_letter_count;
            this.total_marker_count = primitive.total_marker_count;
            this.total_meta_letter_count = primitive.total_meta_letter_count;
            this.total_word_count = primitive.total_word_count;
            this.total_break_count = primitive.total_break_count;
            this.total_meta_word_count = primitive.total_meta_word_count;
            this.total_part_count = primitive.total_part_count;
            this.total_line_count = primitive.total_line_count;
            this.total_file_count = primitive.total_file_count;

            this.language_unit_counts = primitive.language_unit_counts;
            this.language_point_counts = primitive.language_point_counts;
            this.language_letter_counts = primitive.language_letter_counts;
            this.language_marker_counts = primitive.language_marker_counts;
            this.language_meta_letter_counts = primitive.language_meta_letter_counts;
            this.language_word_counts = primitive.language_word_counts;
            this.language_break_counts = primitive.language_break_counts;
            this.language_meta_word_counts = primitive.language_meta_word_counts;
            this.language_part_counts = primitive.language_part_counts;
            this.language_line_counts = primitive.language_line_counts;
            this.language_file_counts = primitive.language_file_counts;

            this.buffer_counts = primitive.buffer_counts;

            this.Freeze();
        } else {
            this.unique_language_names = [];

            this.total_unit_count = 0;
            this.total_point_count = 0;
            this.total_letter_count = 0;
            this.total_marker_count = 0;
            this.total_meta_letter_count = 0;
            this.total_word_count = 0;
            this.total_break_count = 0;
            this.total_meta_word_count = 0;
            this.total_part_count = 0;
            this.total_line_count = 0;
            this.total_file_count = 0;

            this.language_unit_counts = {};
            this.language_point_counts = {};
            this.language_letter_counts = {};
            this.language_marker_counts = {};
            this.language_meta_letter_counts = {};
            this.language_word_counts = {};
            this.language_break_counts = {};
            this.language_meta_word_counts = {};
            this.language_part_counts = {};
            this.language_line_counts = {};
            this.language_file_counts = {};

            this.buffer_counts = {
                [FILE_COUNT]: 0,
                [AVG_LINE_COUNT]: 0,
                [LINES]: [] as any,
            };
        }
    }

    Is_Finalized():
        boolean
    {
        return this.Is_Frozen();
    }

    Finalize():
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `is already finalized`,
        );

        this.Freeze();
    }

    private Is_Frozen():
        boolean
    {
        return Object.isFrozen(this);
    }

    private Freeze():
        void
    {
        Utils.Assert(
            !this.Is_Frozen(),
            `is already frozen`,
        );

        const name_sorter: Name_Sorter.Instance = Name_Sorter.Singleton();

        this.unique_language_names =
            name_sorter.With_Array(Name_Sorter.Type.LANGUAGES, this.unique_language_names);

        Object.freeze(this.unique_language_names);

        Object.freeze(this.language_unit_counts);
        Object.freeze(this.language_point_counts);
        Object.freeze(this.language_letter_counts);
        Object.freeze(this.language_marker_counts);
        Object.freeze(this.language_meta_letter_counts);
        Object.freeze(this.language_word_counts);
        Object.freeze(this.language_break_counts);
        Object.freeze(this.language_meta_word_counts);
        Object.freeze(this.language_part_counts);
        Object.freeze(this.language_line_counts);
        Object.freeze(this.language_file_counts);

        Object.freeze(this.buffer_counts);
        Object.freeze(this.buffer_counts[LINES]);
        for (
            let line_idx = 0, line_end = this.buffer_counts[LINES].length;
            line_idx < line_end;
            line_idx += 1
        ) {
            const line_counts = this.buffer_counts[LINES][line_idx];
            Object.freeze(line_counts);
            Object.freeze(line_counts[COLUMNS]);
            for (
                let column_idx = 0, column_end = line_counts[COLUMNS].length;
                column_idx < column_end;
                column_idx += 1
            ) {
                const column_counts = line_counts[COLUMNS][column_idx];
                Object.freeze(column_counts);
                Object.freeze(column_counts[MACRO_ROWS]);
                Object.freeze(column_counts[MICRO_ROWS]);
                for (
                    let row_idx = 0, row_end = column_counts[MACRO_ROWS].length;
                    row_idx < row_end;
                    row_idx += 1
                ) {
                    const row_counts = column_counts[MACRO_ROWS][row_idx];
                    Object.freeze(row_counts);
                    Object.freeze(row_counts[SEGMENTS]);
                    for (
                        let segment_idx = 0, segment_end = row_counts[SEGMENTS].length;
                        segment_idx < segment_end;
                        segment_idx += 1
                    ) {
                        const segment_counts = row_counts[SEGMENTS][segment_idx];
                        Object.freeze(segment_counts);
                    }
                }
                for (
                    let row_idx = 0, row_end = column_counts[MICRO_ROWS].length;
                    row_idx < row_end;
                    row_idx += 1
                ) {
                    const row_counts = column_counts[MICRO_ROWS][row_idx];
                    Object.freeze(row_counts);
                    Object.freeze(row_counts[SEGMENTS]);
                    for (
                        let segment_idx = 0, segment_end = row_counts[SEGMENTS].length;
                        segment_idx < segment_end;
                        segment_idx += 1
                    ) {
                        const segment_counts = row_counts[SEGMENTS][segment_idx];
                        Object.freeze(segment_counts);
                    }
                }
            }
        }

        Object.freeze(this);

        Utils.Assert(
            (
                this.Total_Word_Count() +
                this.Total_Meta_Word_Count() +
                this.Total_Break_Count()
            ) === this.Total_Part_Count(),
            `miscount of total_part_count!`,
        );
        Utils.Assert(
            (
                this.Total_Letter_Count() +
                this.Total_Meta_Letter_Count() +
                this.Total_Marker_Count()
            ) === this.Total_Point_Count(),
            `miscount of total_point_count!`,
        );
    }

    JSON_String():
        string
    {
        Utils.Assert(
            this.Is_Finalized(),
            `is not finalized`,
        );

        return JSON.stringify(this as any);
    }

    Unique_Language_Names():
        Array<Name>
    {
        return Array.from(this.unique_language_names);
    }

    Unique_Language_Name_Count():
        Count
    {
        return this.unique_language_names.length;
    }

    Unique_Language_Name_Count_String():
        string
    {
        return Utils.Add_Commas_To_Number(this.Unique_Language_Name_Count());
    }

    Has_Unique_Language_Name(
        language_name: Name,
    ):
        boolean
    {
        return this.language_unit_counts[language_name] != null;
    }

    Add_Unique_Language_Name(
        language_name: Name,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `is finalized`,
        );

        if (!this.Has_Unique_Language_Name(language_name)) {
            this.unique_language_names.push(language_name);

            this.language_unit_counts[language_name] = 0;
            this.language_point_counts[language_name] = 0;
            this.language_letter_counts[language_name] = 0;
            this.language_marker_counts[language_name] = 0;
            this.language_meta_letter_counts[language_name] = 0;
            this.language_word_counts[language_name] = 0;
            this.language_break_counts[language_name] = 0;
            this.language_meta_word_counts[language_name] = 0;
            this.language_part_counts[language_name] = 0;
            this.language_line_counts[language_name] = 0;
            this.language_file_counts[language_name] = 0;
        }
    }

    Total_Unit_Count():
        Count
    {
        return this.total_unit_count;
    }

    Total_Unit_Count_String():
        string
    {
        return Utils.Add_Commas_To_Number(this.Total_Unit_Count());
    }

    Language_Unit_Count(
        language_name: Name,
    ):
        Count
    {
        Utils.Assert(
            this.Has_Unique_Language_Name(language_name),
            `does not have language: ${language_name}`,
        );

        return this.language_unit_counts[language_name];
    }

    Language_Unit_Percent(
        language_name: Name,
    ):
        Count
    {
        return Math.round(this.Language_Unit_Count(language_name) * 100 / this.Total_Unit_Count());
    }

    Language_Unit_Counts():
        Array<[Name, Count]>
    {
        const results: Array<[Name, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Unit_Count(language_name),
                ],
            );
        }

        return results;
    }

    Language_Unit_Counts_And_Percents():
        Array<[Name, Count, Count]>
    {
        const results: Array<[Name, Count, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Unit_Count(language_name),
                    this.Language_Unit_Percent(language_name),
                ],
            );
        }

        return results;
    }

    Increment_Unit_Count(
        language_name: Name,
        count: Count,
    ):
        void
    {
        if (!this.Has_Unique_Language_Name(language_name)) {
            this.Add_Unique_Language_Name(language_name);
        }

        Utils.Assert(this.Total_Unit_Count() + count <= Number.MAX_SAFE_INTEGER);
        Utils.Assert(this.Language_Unit_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.total_unit_count += count;
        this.language_unit_counts[language_name] += count;
    }

    Increment_Unit_Counts(
        language_counts: Array<[Name, Count]>,
    ):
        void
    {
        for (const [language_name, count] of language_counts) {
            this.Increment_Unit_Count(language_name, count);
        }
    }

    Total_Point_Count():
        Count
    {
        return this.total_point_count;
    }

    Total_Point_Count_String():
        string
    {
        return Utils.Add_Commas_To_Number(this.Total_Point_Count());
    }

    Language_Point_Count(
        language_name: Name,
    ):
        Count
    {
        Utils.Assert(
            this.Has_Unique_Language_Name(language_name),
            `does not have language: ${language_name}`,
        );

        return this.language_point_counts[language_name];
    }

    Language_Point_Percent(
        language_name: Name,
    ):
        Count
    {
        return Math.round(this.Language_Point_Count(language_name) * 100 / this.Total_Point_Count());
    }

    Language_Point_Counts():
        Array<[Name, Count]>
    {
        const results: Array<[Name, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Point_Count(language_name),
                ],
            );
        }

        return results;
    }

    Language_Point_Counts_And_Percents():
        Array<[Name, Count, Count]>
    {
        const results: Array<[Name, Count, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Point_Count(language_name),
                    this.Language_Point_Percent(language_name),
                ],
            );
        }

        return results;
    }

    Increment_Point_Count(
        language_name: Name,
        count: Count,
    ):
        void
    {
        if (!this.Has_Unique_Language_Name(language_name)) {
            this.Add_Unique_Language_Name(language_name);
        }

        Utils.Assert(this.Total_Point_Count() + count <= Number.MAX_SAFE_INTEGER);
        Utils.Assert(this.Language_Point_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.total_point_count += count;
        this.language_point_counts[language_name] += count;
    }

    Increment_Point_Counts(
        language_counts: Array<[Name, Count]>,
    ):
        void
    {
        for (const [language_name, count] of language_counts) {
            this.Increment_Point_Count(language_name, count);
        }
    }

    Total_Letter_Count():
        Count
    {
        return this.total_letter_count;
    }

    Total_Letter_Count_String():
        string
    {
        return Utils.Add_Commas_To_Number(this.Total_Letter_Count());
    }

    Total_Letter_Percent():
        Count
    {
        return Math.round(this.Total_Letter_Count() * 100 / this.Total_Point_Count());
    }

    Language_Letter_Count(
        language_name: Name,
    ):
        Count
    {
        Utils.Assert(
            this.Has_Unique_Language_Name(language_name),
            `does not have language: ${language_name}`,
        );

        return this.language_letter_counts[language_name];
    }

    Language_Letter_Percent(
        language_name: Name,
    ):
        Count
    {
        return Math.round(this.Language_Letter_Count(language_name) * 100 / this.Total_Letter_Count());
    }

    Language_Letter_Counts():
        Array<[Name, Count]>
    {
        const results: Array<[Name, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Letter_Count(language_name),
                ],
            );
        }

        return results;
    }

    Language_Letter_Counts_And_Percents():
        Array<[Name, Count, Count]>
    {
        const results: Array<[Name, Count, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Letter_Count(language_name),
                    this.Language_Letter_Percent(language_name),
                ],
            );
        }

        return results;
    }

    Increment_Letter_Count(
        language_name: Name,
        count: Count,
    ):
        void
    {
        if (!this.Has_Unique_Language_Name(language_name)) {
            this.Add_Unique_Language_Name(language_name);
        }

        Utils.Assert(this.Total_Letter_Count() + count <= Number.MAX_SAFE_INTEGER);
        Utils.Assert(this.Language_Letter_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.total_letter_count += count;
        this.language_letter_counts[language_name] += count;
    }

    Increment_Letter_Counts(
        language_counts: Array<[Name, Count]>,
    ):
        void
    {
        for (const [language_name, count] of language_counts) {
            this.Increment_Letter_Count(language_name, count);
        }
    }

    Total_Marker_Count():
        Count
    {
        return this.total_marker_count;
    }

    Total_Marker_Count_String():
        string
    {
        return Utils.Add_Commas_To_Number(this.Total_Marker_Count());
    }

    Total_Marker_Percent():
        Count
    {
        return Math.round(this.Total_Marker_Count() * 100 / this.Total_Point_Count());
    }

    Language_Marker_Count(
        language_name: Name,
    ):
        Count
    {
        Utils.Assert(
            this.Has_Unique_Language_Name(language_name),
            `does not have language: ${language_name}`,
        );

        return this.language_marker_counts[language_name];
    }

    Language_Marker_Percent(
        language_name: Name,
    ):
        Count
    {
        return Math.round(this.Language_Marker_Count(language_name) * 100 / this.Total_Marker_Count());
    }

    Language_Marker_Counts():
        Array<[Name, Count]>
    {
        const results: Array<[Name, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Marker_Count(language_name),
                ],
            );
        }

        return results;
    }

    Language_Marker_Counts_And_Percents():
        Array<[Name, Count, Count]>
    {
        const results: Array<[Name, Count, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Marker_Count(language_name),
                    this.Language_Marker_Percent(language_name),
                ],
            );
        }

        return results;
    }

    Increment_Marker_Count(
        language_name: Name,
        count: Count,
    ):
        void
    {
        if (!this.Has_Unique_Language_Name(language_name)) {
            this.Add_Unique_Language_Name(language_name);
        }

        Utils.Assert(this.Total_Marker_Count() + count <= Number.MAX_SAFE_INTEGER);
        Utils.Assert(this.Language_Marker_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.total_marker_count += count;
        this.language_marker_counts[language_name] += count;
    }

    Increment_Marker_Counts(
        language_counts: Array<[Name, Count]>,
    ):
        void
    {
        for (const [language_name, count] of language_counts) {
            this.Increment_Marker_Count(language_name, count);
        }
    }

    Total_Meta_Letter_Count():
        Count
    {
        return this.total_meta_letter_count;
    }

    Total_Meta_Letter_Count_String():
        string
    {
        return Utils.Add_Commas_To_Number(this.Total_Meta_Letter_Count());
    }

    Total_Meta_Letter_Percent():
        Count
    {
        return Math.round(this.Total_Meta_Letter_Count() * 100 / this.Total_Point_Count());
    }

    Language_Meta_Letter_Count(
        language_name: Name,
    ):
        Count
    {
        Utils.Assert(
            this.Has_Unique_Language_Name(language_name),
            `does not have language: ${language_name}`,
        );

        return this.language_meta_letter_counts[language_name];
    }

    Language_Meta_Letter_Percent(
        language_name: Name,
    ):
        Count
    {
        return Math.round(this.Language_Meta_Letter_Count(language_name) * 100 / this.Total_Meta_Letter_Count());
    }

    Language_Meta_Letter_Counts():
        Array<[Name, Count]>
    {
        const results: Array<[Name, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Meta_Letter_Count(language_name),
                ],
            );
        }

        return results;
    }

    Language_Meta_Letter_Counts_And_Percents():
        Array<[Name, Count, Count]>
    {
        const results: Array<[Name, Count, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Meta_Letter_Count(language_name),
                    this.Language_Meta_Letter_Percent(language_name),
                ],
            );
        }

        return results;
    }

    Increment_Meta_Letter_Count(
        language_name: Name,
        count: Count,
    ):
        void
    {
        if (!this.Has_Unique_Language_Name(language_name)) {
            this.Add_Unique_Language_Name(language_name);
        }

        Utils.Assert(this.Total_Meta_Letter_Count() + count <= Number.MAX_SAFE_INTEGER);
        Utils.Assert(this.Language_Meta_Letter_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.total_meta_letter_count += count;
        this.language_meta_letter_counts[language_name] += count;
    }

    Increment_Meta_Letter_Counts(
        language_counts: Array<[Name, Count]>,
    ):
        void
    {
        for (const [language_name, count] of language_counts) {
            this.Increment_Meta_Letter_Count(language_name, count);
        }
    }

    Total_Word_Count():
        Count
    {
        return this.total_word_count;
    }

    Total_Word_Count_String():
        string
    {
        return Utils.Add_Commas_To_Number(this.Total_Word_Count());
    }

    Total_Word_Percent():
        Count
    {
        return Math.round(this.Total_Word_Count() * 100 / this.Total_Part_Count());
    }

    Language_Word_Count(
        language_name: Name,
    ):
        Count
    {
        Utils.Assert(
            this.Has_Unique_Language_Name(language_name),
            `does not have language: ${language_name}`,
        );

        return this.language_word_counts[language_name];
    }

    Language_Word_Percent(
        language_name: Name,
    ):
        Count
    {
        return Math.round(this.Language_Word_Count(language_name) * 100 / this.Total_Word_Count());
    }

    Language_Word_Counts():
        Array<[Name, Count]>
    {
        const results: Array<[Name, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Word_Count(language_name),
                ],
            );
        }

        return results;
    }

    Language_Word_Counts_And_Percents():
        Array<[Name, Count, Count]>
    {
        const results: Array<[Name, Count, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Word_Count(language_name),
                    this.Language_Word_Percent(language_name),
                ],
            );
        }

        return results;
    }

    Increment_Word_Count(
        language_name: Name,
        count: Count,
    ):
        void
    {
        if (!this.Has_Unique_Language_Name(language_name)) {
            this.Add_Unique_Language_Name(language_name);
        }

        Utils.Assert(this.Total_Word_Count() + count <= Number.MAX_SAFE_INTEGER);
        Utils.Assert(this.Language_Word_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.total_word_count += count;
        this.language_word_counts[language_name] += count;
    }

    Increment_Word_Counts(
        language_counts: Array<[Name, Count]>,
    ):
        void
    {
        for (const [language_name, count] of language_counts) {
            this.Increment_Word_Count(language_name, count);
        }
    }

    Total_Break_Count():
        Count
    {
        return this.total_break_count;
    }

    Total_Break_Count_String():
        string
    {
        return Utils.Add_Commas_To_Number(this.Total_Break_Count());
    }

    Total_Break_Percent():
        Count
    {
        return Math.round(this.Total_Break_Count() * 100 / this.Total_Part_Count());
    }

    Language_Break_Count(
        language_name: Name,
    ):
        Count
    {
        Utils.Assert(
            this.Has_Unique_Language_Name(language_name),
            `does not have language: ${language_name}`,
        );

        return this.language_break_counts[language_name];
    }

    Language_Break_Percent(
        language_name: Name,
    ):
        Count
    {
        return Math.round(this.Language_Break_Count(language_name) * 100 / this.Total_Break_Count());
    }

    Language_Break_Counts():
        Array<[Name, Count]>
    {
        const results: Array<[Name, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Break_Count(language_name),
                ],
            );
        }

        return results;
    }

    Language_Break_Counts_And_Percents():
        Array<[Name, Count, Count]>
    {
        const results: Array<[Name, Count, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Break_Count(language_name),
                    this.Language_Break_Percent(language_name),
                ],
            );
        }

        return results;
    }

    Increment_Break_Count(
        language_name: Name,
        count: Count,
    ):
        void
    {
        if (!this.Has_Unique_Language_Name(language_name)) {
            this.Add_Unique_Language_Name(language_name);
        }

        Utils.Assert(this.Total_Break_Count() + count <= Number.MAX_SAFE_INTEGER);
        Utils.Assert(this.Language_Break_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.total_break_count += count;
        this.language_break_counts[language_name] += count;
    }

    Increment_Break_Counts(
        language_counts: Array<[Name, Count]>,
    ):
        void
    {
        for (const [language_name, count] of language_counts) {
            this.Increment_Break_Count(language_name, count);
        }
    }

    Total_Meta_Word_Count():
        Count
    {
        return this.total_meta_word_count;
    }

    Total_Meta_Word_Count_String():
        string
    {
        return Utils.Add_Commas_To_Number(this.Total_Meta_Word_Count());
    }

    Total_Meta_Word_Percent():
        Count
    {
        return Math.round(this.Total_Meta_Word_Count() * 100 / this.Total_Part_Count());
    }

    Language_Meta_Word_Count(
        language_name: Name,
    ):
        Count
    {
        Utils.Assert(
            this.Has_Unique_Language_Name(language_name),
            `does not have language: ${language_name}`,
        );

        return this.language_meta_word_counts[language_name];
    }

    Language_Meta_Word_Percent(
        language_name: Name,
    ):
        Count
    {
        return Math.round(this.Language_Meta_Word_Count(language_name) * 100 / this.Total_Meta_Word_Count());
    }

    Language_Meta_Word_Counts():
        Array<[Name, Count]>
    {
        const results: Array<[Name, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Meta_Word_Count(language_name),
                ],
            );
        }

        return results;
    }

    Language_Meta_Word_Counts_And_Percents():
        Array<[Name, Count, Count]>
    {
        const results: Array<[Name, Count, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Meta_Word_Count(language_name),
                    this.Language_Meta_Word_Percent(language_name),
                ],
            );
        }

        return results;
    }

    Increment_Meta_Word_Count(
        language_name: Name,
        count: Count,
    ):
        void
    {
        if (!this.Has_Unique_Language_Name(language_name)) {
            this.Add_Unique_Language_Name(language_name);
        }

        Utils.Assert(this.Total_Meta_Word_Count() + count <= Number.MAX_SAFE_INTEGER);
        Utils.Assert(this.Language_Meta_Word_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.total_meta_word_count += count;
        this.language_meta_word_counts[language_name] += count;
    }

    Increment_Meta_Word_Counts(
        language_counts: Array<[Name, Count]>,
    ):
        void
    {
        for (const [language_name, count] of language_counts) {
            this.Increment_Meta_Word_Count(language_name, count);
        }
    }

    Total_Part_Count():
        Count
    {
        return this.total_part_count;
    }

    Total_Part_Count_String():
        string
    {
        return Utils.Add_Commas_To_Number(this.Total_Part_Count());
    }

    Language_Part_Count(
        language_name: Name,
    ):
        Count
    {
        Utils.Assert(
            this.Has_Unique_Language_Name(language_name),
            `does not have language: ${language_name}`,
        );

        return this.language_part_counts[language_name];
    }

    Language_Part_Percent(
        language_name: Name,
    ):
        Count
    {
        return Math.round(this.Language_Part_Count(language_name) * 100 / this.Total_Part_Count());
    }

    Language_Part_Counts():
        Array<[Name, Count]>
    {
        const results: Array<[Name, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Part_Count(language_name),
                ],
            );
        }

        return results;
    }

    Language_Part_Counts_And_Percents():
        Array<[Name, Count, Count]>
    {
        const results: Array<[Name, Count, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Part_Count(language_name),
                    this.Language_Part_Percent(language_name),
                ],
            );
        }

        return results;
    }

    Increment_Part_Count(
        language_name: Name,
        count: Count,
    ):
        void
    {
        if (!this.Has_Unique_Language_Name(language_name)) {
            this.Add_Unique_Language_Name(language_name);
        }

        Utils.Assert(this.Total_Part_Count() + count <= Number.MAX_SAFE_INTEGER);
        Utils.Assert(this.Language_Part_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.total_part_count += count;
        this.language_part_counts[language_name] += count;
    }

    Increment_Part_Counts(
        language_counts: Array<[Name, Count]>,
    ):
        void
    {
        for (const [language_name, count] of language_counts) {
            this.Increment_Part_Count(language_name, count);
        }
    }

    Total_Line_Count():
        Count
    {
        return this.total_line_count;
    }

    Total_Line_Count_String():
        string
    {
        return Utils.Add_Commas_To_Number(this.Total_Line_Count());
    }

    Language_Line_Count(
        language_name: Name,
    ):
        Count
    {
        Utils.Assert(
            this.Has_Unique_Language_Name(language_name),
            `does not have language: ${language_name}`,
        );

        return this.language_line_counts[language_name];
    }

    Language_Line_Percent(
        language_name: Name,
    ):
        Count
    {
        return Math.round(this.Language_Line_Count(language_name) * 100 / this.Total_Line_Count());
    }

    Language_Line_Counts():
        Array<[Name, Count]>
    {
        const results: Array<[Name, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Line_Count(language_name),
                ],
            );
        }

        return results;
    }

    Language_Line_Counts_And_Percents():
        Array<[Name, Count, Count]>
    {
        const results: Array<[Name, Count, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Line_Count(language_name),
                    this.Language_Line_Percent(language_name),
                ],
            );
        }

        return results;
    }

    Increment_Line_Count(
        language_name: Name,
        count: Count,
    ):
        void
    {
        if (!this.Has_Unique_Language_Name(language_name)) {
            this.Add_Unique_Language_Name(language_name);
        }

        Utils.Assert(this.Total_Line_Count() + count <= Number.MAX_SAFE_INTEGER);
        Utils.Assert(this.Language_Line_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.total_line_count += count;
        this.language_line_counts[language_name] += count;
    }

    Increment_Line_Counts(
        language_counts: Array<[Name, Count]>,
    ):
        void
    {
        for (const [language_name, count] of language_counts) {
            this.Increment_Line_Count(language_name, count);
        }
    }

    Total_File_Count():
        Count
    {
        return this.total_file_count;
    }

    Total_File_Count_String():
        string
    {
        return Utils.Add_Commas_To_Number(this.Total_File_Count());
    }

    Language_File_Count(
        language_name: Name,
    ):
        Count
    {
        Utils.Assert(
            this.Has_Unique_Language_Name(language_name),
            `does not have language: ${language_name}`,
        );

        return this.language_file_counts[language_name];
    }

    Language_File_Percent(
        language_name: Name,
    ):
        Count
    {
        return Math.round(this.Language_File_Count(language_name) * 100 / this.Total_File_Count());
    }

    Language_File_Counts():
        Array<[Name, Count]>
    {
        const results: Array<[Name, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_File_Count(language_name),
                ],
            );
        }

        return results;
    }

    Language_File_Counts_And_Percents():
        Array<[Name, Count, Count]>
    {
        const results: Array<[Name, Count, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_File_Count(language_name),
                    this.Language_File_Percent(language_name),
                ],
            );
        }

        return results;
    }

    Increment_File_Count(
        language_name: Name,
        count: Count,
    ):
        void
    {
        if (!this.Has_Unique_Language_Name(language_name)) {
            this.Add_Unique_Language_Name(language_name);
        }

        Utils.Assert(this.Total_File_Count() + count <= Number.MAX_SAFE_INTEGER);
        Utils.Assert(this.Language_File_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.total_file_count += count;
        this.language_file_counts[language_name] += count;
    }

    Increment_File_Counts(
        language_counts: Array<[Name, Count]>,
    ):
        void
    {
        for (const [language_name, count] of language_counts) {
            this.Increment_File_Count(language_name, count);
        }
    }

    Buffer_Counts():
        Buffer_Counts.Full_Buffer
    {
        Utils.Assert(
            this.Is_Finalized(),
            `is not finalized`,
        );

        return this.buffer_counts;
    }

    Update_Buffer_Counts(
        text: Text.Instance,
    ):
        void
    {
        const buffer_text = text;
        const buffer_counts = this.buffer_counts;
        const line_count: Count = buffer_text.Line_Count();
        Utils.Assert(
            Number.MAX_SAFE_INTEGER - buffer_counts[FILE_COUNT] >= 1,
        );
        Utils.Assert(
            Number.MAX_SAFE_INTEGER - buffer_counts[AVG_LINE_COUNT] >= line_count,
        );
        buffer_counts[FILE_COUNT] += 1;
        buffer_counts[AVG_LINE_COUNT] += line_count;
        while (buffer_counts[LINES].length < line_count) {
            buffer_counts[LINES].push(
                {
                    [FILE_COUNT]: 0,
                    [AVG_COLUMN_COUNT]: 0,
                    [COLUMNS]: [] as any,
                },
            );
        }
        for (
            let line_idx = 0, line_end = line_count;
            line_idx < line_end;
            line_idx += 1
        ) {
            const line_text: Text.Line.Instance = buffer_text.Line(line_idx);
            const line_counts = buffer_counts[LINES][line_idx];
            const column_count: Count = line_text.Column_Count();
            Utils.Assert(
                line_counts != null,
            );
            Utils.Assert(
                Number.MAX_SAFE_INTEGER - line_counts[FILE_COUNT] >= 1,
            );
            Utils.Assert(
                Number.MAX_SAFE_INTEGER - line_counts[AVG_COLUMN_COUNT] >= column_count,
            );
            line_counts[FILE_COUNT] += 1;
            line_counts[AVG_COLUMN_COUNT] += column_count;
            while (line_counts[COLUMNS].length < column_count) {
                line_counts[COLUMNS].push(
                    {
                        [FILE_COUNT]: 0,
                        [AVG_ROW_COUNT]: 0,
                        [MACRO_ROWS]: [] as any,
                        [MICRO_ROWS]: [] as any,
                    },
                );
            }
            for (
                let column_idx = 0, column_end = column_count;
                column_idx < column_end;
                column_idx += 1
            ) {
                const column_text: Text.Column.Instance = line_text.Column(column_idx);
                const column_counts = line_counts[COLUMNS][column_idx];
                const row_count: Count = column_text.Row_Count();
                Utils.Assert(
                    column_counts != null,
                );
                Utils.Assert(
                    Number.MAX_SAFE_INTEGER - column_counts[FILE_COUNT] >= 1,
                );
                Utils.Assert(
                    Number.MAX_SAFE_INTEGER - column_counts[AVG_ROW_COUNT] >= row_count,
                );
                column_counts[FILE_COUNT] += 1;
                column_counts[AVG_ROW_COUNT] += row_count;
                while (column_counts[MACRO_ROWS].length < row_count) {
                    column_counts[MACRO_ROWS].push(
                        {
                            [FILE_COUNT]: 0,
                            [AVG_SEGMENT_COUNT]: 0,
                            [SEGMENTS]: [] as any,
                        },
                    );
                }
                while (column_counts[MICRO_ROWS].length < row_count) {
                    column_counts[MICRO_ROWS].push(
                        {
                            [FILE_COUNT]: 0,
                            [AVG_SEGMENT_COUNT]: 0,
                            [SEGMENTS]: [] as any,
                        },
                    );
                }
                for (
                    let row_idx = 0, row_end = row_count;
                    row_idx < row_end;
                    row_idx += 1
                ) {
                    const row_text: Text.Row.Instance = column_text.Row(row_idx);
                    const macro_row_counts = column_counts[MACRO_ROWS][row_idx];
                    const macro_segment_count: Count = row_text.Macro_Segment_Count();
                    Utils.Assert(
                        macro_row_counts != null,
                    );
                    Utils.Assert(
                        Number.MAX_SAFE_INTEGER - macro_row_counts[FILE_COUNT] >= 1,
                    );
                    Utils.Assert(
                        Number.MAX_SAFE_INTEGER - macro_row_counts[AVG_SEGMENT_COUNT] >= macro_segment_count,
                    );
                    macro_row_counts[FILE_COUNT] += 1;
                    macro_row_counts[AVG_SEGMENT_COUNT] += macro_segment_count;
                    while (macro_row_counts[SEGMENTS].length < macro_segment_count) {
                        macro_row_counts[SEGMENTS].push(
                            {
                                [FILE_COUNT]: 0,
                                [AVG_ITEM_COUNT]: 0,
                            },
                        );
                    }
                    for (
                        let segment_idx = 0, segment_end = macro_segment_count;
                        segment_idx < segment_end;
                        segment_idx += 1
                    ) {
                        const segment_text: Text.Segment.Instance = row_text.Macro_Segment(segment_idx);
                        const segment_counts = macro_row_counts[SEGMENTS][segment_idx];
                        const item_count: Count = segment_text.Item_Count();
                        Utils.Assert(
                            segment_counts != null,
                        );
                        Utils.Assert(
                            Number.MAX_SAFE_INTEGER - segment_counts[FILE_COUNT] >= 1,
                        );
                        Utils.Assert(
                            Number.MAX_SAFE_INTEGER - segment_counts[AVG_ITEM_COUNT] >= item_count,
                        );
                        segment_counts[FILE_COUNT] += 1;
                        segment_counts[AVG_ITEM_COUNT] += item_count;
                    }
                    const micro_row_counts = column_counts[MICRO_ROWS][row_idx];
                    const micro_segment_count: Count = row_text.Micro_Segment_Count();
                    Utils.Assert(
                        micro_row_counts != null,
                    );
                    Utils.Assert(
                        Number.MAX_SAFE_INTEGER - micro_row_counts[FILE_COUNT] >= 1,
                    );
                    Utils.Assert(
                        Number.MAX_SAFE_INTEGER - micro_row_counts[AVG_SEGMENT_COUNT] >= micro_segment_count,
                    );
                    micro_row_counts[FILE_COUNT] += 1;
                    micro_row_counts[AVG_SEGMENT_COUNT] += micro_segment_count;
                    while (micro_row_counts[SEGMENTS].length < micro_segment_count) {
                        micro_row_counts[SEGMENTS].push(
                            {
                                [FILE_COUNT]: 0,
                                [AVG_ITEM_COUNT]: 0,
                            },
                        );
                    }
                    for (
                        let segment_idx = 0, segment_end = micro_segment_count;
                        segment_idx < segment_end;
                        segment_idx += 1
                    ) {
                        const segment_text: Text.Segment.Instance = row_text.Micro_Segment(segment_idx);
                        const segment_counts = micro_row_counts[SEGMENTS][segment_idx];
                        const item_count: Count = segment_text.Item_Count();
                        Utils.Assert(
                            segment_counts != null,
                        );
                        Utils.Assert(
                            Number.MAX_SAFE_INTEGER - segment_counts[FILE_COUNT] >= 1,
                        );
                        Utils.Assert(
                            Number.MAX_SAFE_INTEGER - segment_counts[AVG_ITEM_COUNT] >= item_count,
                        );
                        segment_counts[FILE_COUNT] += 1;
                        segment_counts[AVG_ITEM_COUNT] += item_count;
                    }
                }
            }
        }
    }
}
