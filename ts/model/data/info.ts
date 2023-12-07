import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { Name } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Name_Sorter from "../name_sorter.js";

import * as Book from "./book.js";
import * as Version from "./version.js";

import * as Buffer_Counts from "./buffer_counts.js";
import
{
    FULL_FILE_COUNT,
    FULL_AVG_LINE_COUNT,
    FULL_AVG_COLUMN_COUNT,
    FULL_AVG_ROW_COUNT,
    FULL_AVG_SEGMENT_COUNT,
    FULL_AVG_ITEM_COUNT,

    FULL_LINES,
    FULL_COLUMNS,
    FULL_MACRO_ROWS,
    FULL_MICRO_ROWS,
    FULL_SEGMENTS,

    COMPACT_AVG_LINE_COUNT,
    COMPACT_AVG_COLUMN_COUNT,
    COMPACT_AVG_ROW_COUNT,
    COMPACT_AVG_SEGMENT_COUNT,

    COMPACT_LINES,
    COMPACT_COLUMNS,
    COMPACT_MACRO_ROWS,
    COMPACT_MICRO_ROWS,
    COMPACT_SEGMENTS,

    PARTIAL_FILE_COUNT,

    PARTIAL_LINES,
    PARTIAL_COLUMNS,
    PARTIAL_MACRO_ROWS,
    PARTIAL_MICRO_ROWS,
    PARTIAL_SEGMENTS,
} from "./buffer_counts.js";

export type Tree = {
    books: Array<Book.Branch>,
};

export class Info
{
    private tree: Tree;

    private unique_book_names: Array<Name>;
    private unique_language_names: Array<Name>;
    private unique_version_names: Array<Name>;

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
    private total_book_count: Count;

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
    private language_book_counts: { [language_name: Name]: Count };

    private buffer_counts: Buffer_Counts.Compact_Buffer;
    private partial_buffer_counts: Buffer_Counts.Partial_Buffer | null;

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

            this.tree = primitive.tree;

            this.unique_book_names = primitive.unique_book_names;
            this.unique_language_names = primitive.unique_language_names;
            this.unique_version_names = primitive.unique_version_names;

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
            this.total_book_count = primitive.total_book_count;

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
            this.language_book_counts = primitive.language_book_counts;

            this.buffer_counts = primitive.buffer_counts;
            this.partial_buffer_counts = null;

            this.Freeze();
        } else {
            this.tree = {
                books: [],
            };

            this.unique_book_names = [];
            this.unique_language_names = [];
            this.unique_version_names = [];

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
            this.total_book_count = 0;

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
            this.language_book_counts = {};

            this.buffer_counts = [
                0,
                [] as any,
            ];
            this.partial_buffer_counts = [
                0,
                [] as any,
            ];
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

        if (
            this.partial_buffer_counts != null &&
            this.partial_buffer_counts[PARTIAL_FILE_COUNT] > 0
        ) {
            this.Calculate_Buffer_Averages();
        }
        this.partial_buffer_counts = null;

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

        this.unique_book_names =
            name_sorter.With_Array(Name_Sorter.Type.BOOKS, this.unique_book_names);
        this.unique_language_names =
            name_sorter.With_Array(Name_Sorter.Type.LANGUAGES, this.unique_language_names);
        this.unique_version_names =
            name_sorter.With_Array(Name_Sorter.Type.VERSIONS, this.unique_version_names);

        Object.freeze(this.unique_book_names);
        Object.freeze(this.unique_language_names);
        Object.freeze(this.unique_version_names);

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
        Object.freeze(this.language_book_counts);

        Object.freeze(this.buffer_counts);
        Object.freeze(this.buffer_counts[COMPACT_LINES]);
        for (
            let line_idx = 0, line_end = this.buffer_counts[COMPACT_LINES].length;
            line_idx < line_end;
            line_idx += 1
        ) {
            const line_counts = this.buffer_counts[COMPACT_LINES][line_idx];
            Object.freeze(line_counts);
            Object.freeze(line_counts[COMPACT_COLUMNS]);
            for (
                let column_idx = 0, column_end = line_counts[COMPACT_COLUMNS].length;
                column_idx < column_end;
                column_idx += 1
            ) {
                const column_counts = line_counts[COMPACT_COLUMNS][column_idx];
                Object.freeze(column_counts);
                Object.freeze(column_counts[COMPACT_MACRO_ROWS]);
                Object.freeze(column_counts[COMPACT_MICRO_ROWS]);
                for (
                    let row_idx = 0, row_end = column_counts[COMPACT_MACRO_ROWS].length;
                    row_idx < row_end;
                    row_idx += 1
                ) {
                    const row_counts = column_counts[COMPACT_MACRO_ROWS][row_idx];
                    Object.freeze(row_counts);
                    Object.freeze(row_counts[COMPACT_SEGMENTS]);
                }
                for (
                    let row_idx = 0, row_end = column_counts[COMPACT_MICRO_ROWS].length;
                    row_idx < row_end;
                    row_idx += 1
                ) {
                    const row_counts = column_counts[COMPACT_MICRO_ROWS][row_idx];
                    Object.freeze(row_counts);
                    Object.freeze(row_counts[COMPACT_SEGMENTS]);
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

    Tree():
        Tree
    {
        return this.tree;
    }

    Unique_Book_Names():
        Array<Name>
    {
        return Array.from(this.unique_book_names);
    }

    Unique_Book_Name_Count():
        Count
    {
        return this.unique_book_names.length;
    }

    Unique_Book_Name_Count_String():
        string
    {
        return Utils.Add_Commas_To_Number(this.Unique_Book_Name_Count());
    }

    Has_Unique_Book_Name(
        book_name: Name,
    ):
        boolean
    {
        return this.unique_book_names.indexOf(book_name) > -1;
    }

    Add_Unique_Book_Name(
        book_name: Name,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `is finalized`,
        );

        if (!this.Has_Unique_Book_Name(book_name)) {
            this.unique_book_names.push(book_name);
        }
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
            this.language_book_counts[language_name] = 0;
        }
    }

    Unique_Version_Names():
        Array<Name>
    {
        return Array.from(this.unique_version_names);
    }

    Unique_Version_Name_Count():
        Count
    {
        return this.unique_version_names.length;
    }

    Unique_Version_Name_Count_String():
        string
    {
        return Utils.Add_Commas_To_Number(this.Unique_Version_Name_Count());
    }

    Has_Unique_Version_Name(
        version_name: Name,
    ):
        boolean
    {
        return this.unique_version_names.indexOf(version_name) > -1;
    }

    Add_Unique_Version_Name(
        version_name: Name,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Finalized(),
            `is finalized`,
        );

        if (!this.Has_Unique_Version_Name(version_name)) {
            this.unique_version_names.push(version_name);
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

    Total_Book_Count():
        Count
    {
        return this.total_book_count;
    }

    Total_Book_Count_String():
        string
    {
        return Utils.Add_Commas_To_Number(this.Total_Book_Count());
    }

    Language_Book_Count(
        language_name: Name,
    ):
        Count
    {
        Utils.Assert(
            this.Has_Unique_Language_Name(language_name),
            `does not have language: ${language_name}`,
        );

        return this.language_book_counts[language_name];
    }

    Language_Book_Percent(
        language_name: Name,
    ):
        Count
    {
        return Math.round(this.Language_Book_Count(language_name) * 100 / this.Total_Book_Count());
    }

    Language_Book_Counts():
        Array<[Name, Count]>
    {
        const results: Array<[Name, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Book_Count(language_name),
                ],
            );
        }

        return results;
    }

    Language_Book_Counts_And_Percents():
        Array<[Name, Count, Count]>
    {
        const results: Array<[Name, Count, Count]> = [];

        for (const language_name of this.unique_language_names) {
            results.push(
                [
                    language_name,
                    this.Language_Book_Count(language_name),
                    this.Language_Book_Percent(language_name),
                ],
            );
        }

        return results;
    }

    Increment_Book_Count(
        language_name: Name,
        count: Count,
    ):
        void
    {
        if (!this.Has_Unique_Language_Name(language_name)) {
            this.Add_Unique_Language_Name(language_name);
        }

        Utils.Assert(this.Total_Book_Count() + count <= Number.MAX_SAFE_INTEGER);
        Utils.Assert(this.Language_Book_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.total_book_count += count;
        this.language_book_counts[language_name] += count;
    }

    Increment_Book_Counts(
        language_counts: Array<[Name, Count]>,
    ):
        void
    {
        for (const [language_name, count] of language_counts) {
            this.Increment_Book_Count(language_name, count);
        }
    }

    Buffer_Counts():
        Buffer_Counts.Compact_Buffer
    {
        Utils.Assert(
            this.Is_Finalized(),
            `is not finalized`,
        );

        return this.buffer_counts;
    }

    Avg_Line_Count():
        Count
    {
        return this.Buffer_Counts()[COMPACT_AVG_LINE_COUNT];
    }

    Line_Buffer_Counts(
        {
            line_index,
        }: {
            line_index: Index,
        },
    ):
        Buffer_Counts.Compact_Line
    {
        return this.Buffer_Counts()[COMPACT_LINES][line_index];
    }

    Avg_Column_Count(
        {
            line_index,
        }: {
            line_index: Index,
        },
    ):
        Count
    {
        return this.Line_Buffer_Counts(
            {
                line_index,
            },
        )[COMPACT_AVG_COLUMN_COUNT];
    }

    Column_Buffer_Counts(
        {
            line_index,
            column_index,
        }: {
            line_index: Index,
            column_index: Index,
        },
    ):
        Buffer_Counts.Compact_Column
    {
        return this.Line_Buffer_Counts(
            {
                line_index,
            },
        )[COMPACT_COLUMNS][column_index];
    }

    Avg_Row_Count(
        {
            line_index,
            column_index,
        }: {
            line_index: Index,
            column_index: Index,
        },
    ):
        Count
    {
        return this.Column_Buffer_Counts(
            {
                line_index,
                column_index,
            },
        )[COMPACT_AVG_ROW_COUNT];
    }

    Macro_Row_Buffer_Counts(
        {
            line_index,
            column_index,
            row_index,
        }: {
            line_index: Index,
            column_index: Index,
            row_index: Index,
        },
    ):
        Buffer_Counts.Compact_Row
    {
        return this.Column_Buffer_Counts(
            {
                line_index,
                column_index,
            },
        )[COMPACT_MACRO_ROWS][row_index];
    }

    Avg_Macro_Segment_Count(
        {
            line_index,
            column_index,
            row_index,
        }: {
            line_index: Index,
            column_index: Index,
            row_index: Index,
        },
    ):
        Count
    {
        return this.Macro_Row_Buffer_Counts(
            {
                line_index,
                column_index,
                row_index,
            },
        )[COMPACT_AVG_SEGMENT_COUNT];
    }

    Macro_Segment_Buffer_Counts(
        {
            line_index,
            column_index,
            row_index,
            segment_index,
        }: {
            line_index: Index,
            column_index: Index,
            row_index: Index,
            segment_index: Index,
        },
    ):
        Buffer_Counts.Compact_Segment
    {
        return this.Macro_Row_Buffer_Counts(
            {
                line_index,
                column_index,
                row_index,
            },
        )[COMPACT_SEGMENTS][segment_index];
    }

    Avg_Macro_Item_Count(
        {
            line_index,
            column_index,
            row_index,
            segment_index,
        }: {
            line_index: Index,
            column_index: Index,
            row_index: Index,
            segment_index: Index,
        },
    ):
        Count
    {
        return this.Macro_Segment_Buffer_Counts(
            {
                line_index,
                column_index,
                row_index,
                segment_index,
            },
        );
    }

    Update_Buffer_Counts(
        version_info: Version.Info,
    ):
        void
    {
        Utils.Assert(
            this.partial_buffer_counts != null,
            `partial_buffer_counts cannot be null.`,
        );

        const buffer_counts = this.buffer_counts;
        const partial_buffer_counts = this.partial_buffer_counts as Buffer_Counts.Partial_Buffer;
        const version_buffer_counts = version_info.Buffer_Counts();
        Utils.Assert(
            Number.MAX_SAFE_INTEGER - buffer_counts[COMPACT_AVG_LINE_COUNT] >=
            version_buffer_counts[FULL_AVG_LINE_COUNT],
        );
        Utils.Assert(
            Number.MAX_SAFE_INTEGER - partial_buffer_counts[PARTIAL_FILE_COUNT] >=
            version_buffer_counts[FULL_FILE_COUNT],
        );
        buffer_counts[COMPACT_AVG_LINE_COUNT] += version_buffer_counts[FULL_AVG_LINE_COUNT];
        partial_buffer_counts[PARTIAL_FILE_COUNT] += version_buffer_counts[FULL_FILE_COUNT];
        while (buffer_counts[COMPACT_LINES].length < version_buffer_counts[FULL_LINES].length) {
            buffer_counts[COMPACT_LINES].push(
                [
                    0,
                    [] as any,
                ],
            );
            partial_buffer_counts[PARTIAL_LINES].push(
                [
                    0,
                    [] as any,
                ],
            );
        }
        for (
            let line_idx = 0, line_end = version_buffer_counts[FULL_LINES].length;
            line_idx < line_end;
            line_idx += 1
        ) {
            const line_counts = buffer_counts[COMPACT_LINES][line_idx];
            const partial_line_counts = partial_buffer_counts[PARTIAL_LINES][line_idx];
            const version_line_counts = version_buffer_counts[FULL_LINES][line_idx];
            Utils.Assert(
                line_counts != null,
            );
            Utils.Assert(
                Number.MAX_SAFE_INTEGER - line_counts[COMPACT_AVG_COLUMN_COUNT] >=
                version_line_counts[FULL_AVG_COLUMN_COUNT],
            );
            Utils.Assert(
                Number.MAX_SAFE_INTEGER - partial_line_counts[PARTIAL_FILE_COUNT] >=
                version_line_counts[FULL_FILE_COUNT],
            );
            line_counts[COMPACT_AVG_COLUMN_COUNT] += version_line_counts[FULL_AVG_COLUMN_COUNT];
            partial_line_counts[PARTIAL_FILE_COUNT] += version_line_counts[FULL_FILE_COUNT];
            while (line_counts[COMPACT_COLUMNS].length < version_line_counts[FULL_COLUMNS].length) {
                line_counts[COMPACT_COLUMNS].push(
                    [
                        0,
                        [] as any,
                        [] as any,
                    ],
                );
                partial_line_counts[PARTIAL_COLUMNS].push(
                    [
                        0,
                        [] as any,
                        [] as any,
                    ],
                );
            }
            for (
                let column_idx = 0, column_end = version_line_counts[FULL_COLUMNS].length;
                column_idx < column_end;
                column_idx += 1
            ) {
                const column_counts = line_counts[COMPACT_COLUMNS][column_idx];
                const partial_column_counts = partial_line_counts[PARTIAL_COLUMNS][column_idx];
                const version_column_counts = version_line_counts[FULL_COLUMNS][column_idx];
                Utils.Assert(
                    column_counts != null,
                );
                Utils.Assert(
                    Number.MAX_SAFE_INTEGER - column_counts[COMPACT_AVG_ROW_COUNT] >=
                    version_column_counts[FULL_AVG_ROW_COUNT],
                );
                Utils.Assert(
                    Number.MAX_SAFE_INTEGER - partial_column_counts[PARTIAL_FILE_COUNT] >=
                    version_column_counts[FULL_FILE_COUNT],
                );
                column_counts[COMPACT_AVG_ROW_COUNT] += version_column_counts[FULL_AVG_ROW_COUNT];
                partial_column_counts[PARTIAL_FILE_COUNT] += version_column_counts[FULL_FILE_COUNT];
                while (column_counts[COMPACT_MACRO_ROWS].length < version_column_counts[FULL_MACRO_ROWS].length) {
                    column_counts[COMPACT_MACRO_ROWS].push(
                        [
                            0,
                            [] as any,
                        ],
                    );
                    partial_column_counts[PARTIAL_MACRO_ROWS].push(
                        [
                            0,
                            [] as any,
                        ],
                    );
                }
                while (column_counts[COMPACT_MICRO_ROWS].length < version_column_counts[FULL_MICRO_ROWS].length) {
                    column_counts[COMPACT_MICRO_ROWS].push(
                        [
                            0,
                            [] as any,
                        ],
                    );
                    partial_column_counts[PARTIAL_MICRO_ROWS].push(
                        [
                            0,
                            [] as any,
                        ],
                    );
                }
                Utils.Assert(
                    version_column_counts[FULL_MACRO_ROWS].length ===
                    version_column_counts[FULL_MICRO_ROWS].length
                );
                for (const [rows, partial_rows, version_rows] of
                    [
                        [
                            column_counts[COMPACT_MACRO_ROWS],
                            partial_column_counts[PARTIAL_MACRO_ROWS],
                            version_column_counts[FULL_MACRO_ROWS],
                        ],
                        [
                            column_counts[COMPACT_MICRO_ROWS],
                            partial_column_counts[PARTIAL_MICRO_ROWS],
                            version_column_counts[FULL_MICRO_ROWS],
                        ],
                    ] as [
                        [
                            [Buffer_Counts.Compact_Row],
                            [Buffer_Counts.Partial_Row],
                            [Buffer_Counts.Full_Row],
                        ],
                        [
                            [Buffer_Counts.Compact_Row],
                            [Buffer_Counts.Partial_Row],
                            [Buffer_Counts.Full_Row],
                        ],
                    ]
                ) {
                    for (
                        let row_idx = 0, row_end = version_rows.length;
                        row_idx < row_end;
                        row_idx += 1
                    ) {
                        const row_counts = rows[row_idx];
                        const partial_row_counts = partial_rows[row_idx];
                        const version_row_counts = version_rows[row_idx];
                        Utils.Assert(
                            row_counts != null,
                        );
                        Utils.Assert(
                            Number.MAX_SAFE_INTEGER - row_counts[COMPACT_AVG_SEGMENT_COUNT] >=
                            version_row_counts[FULL_AVG_SEGMENT_COUNT],
                        );
                        Utils.Assert(
                            Number.MAX_SAFE_INTEGER - partial_row_counts[PARTIAL_FILE_COUNT] >=
                            version_row_counts[FULL_FILE_COUNT],
                        );
                        row_counts[COMPACT_AVG_SEGMENT_COUNT] += version_row_counts[FULL_AVG_SEGMENT_COUNT];
                        partial_row_counts[PARTIAL_FILE_COUNT] += version_row_counts[FULL_FILE_COUNT];
                        while (row_counts[COMPACT_SEGMENTS].length < version_row_counts[FULL_SEGMENTS].length) {
                            row_counts[COMPACT_SEGMENTS].push(
                                0,
                            );
                            partial_row_counts[PARTIAL_SEGMENTS].push(
                                0,
                            );
                        }
                        for (
                            let segment_idx = 0, segment_end = version_row_counts[FULL_SEGMENTS].length;
                            segment_idx < segment_end;
                            segment_idx += 1
                        ) {
                            const version_segment_counts = version_row_counts[FULL_SEGMENTS][segment_idx];
                            Utils.Assert(
                                Number.MAX_SAFE_INTEGER - row_counts[COMPACT_SEGMENTS][segment_idx] >=
                                version_segment_counts[FULL_AVG_ITEM_COUNT],
                            );
                            Utils.Assert(
                                Number.MAX_SAFE_INTEGER - partial_row_counts[PARTIAL_SEGMENTS][segment_idx] >=
                                version_segment_counts[FULL_FILE_COUNT],
                            );
                            row_counts[COMPACT_SEGMENTS][segment_idx] += version_segment_counts[FULL_AVG_ITEM_COUNT];
                            partial_row_counts[PARTIAL_SEGMENTS][segment_idx] += version_segment_counts[FULL_FILE_COUNT];
                        }
                    }
                }
            }
        }
    }

    private Calculate_Buffer_Averages():
        void
    {
        Utils.Assert(
            this.partial_buffer_counts != null,
            `partial_buffer_counts cannot be null.`,
        );

        const buffer_counts = this.buffer_counts;
        const partial_buffer_counts = this.partial_buffer_counts as Buffer_Counts.Partial_Buffer;
        buffer_counts[COMPACT_AVG_LINE_COUNT] = Math.round(
            buffer_counts[COMPACT_AVG_LINE_COUNT] /
            partial_buffer_counts[PARTIAL_FILE_COUNT],
        );
        for (
            let line_idx = 0, line_end = buffer_counts[COMPACT_LINES].length;
            line_idx < line_end;
            line_idx += 1
        ) {
            const line_counts = buffer_counts[COMPACT_LINES][line_idx];
            const partial_line_counts = partial_buffer_counts[PARTIAL_LINES][line_idx];
            line_counts[COMPACT_AVG_COLUMN_COUNT] = Math.round(
                line_counts[COMPACT_AVG_COLUMN_COUNT] /
                partial_line_counts[PARTIAL_FILE_COUNT],
            );
            for (
                let column_idx = 0, column_end = line_counts[COMPACT_COLUMNS].length;
                column_idx < column_end;
                column_idx += 1
            ) {
                const column_counts = line_counts[COMPACT_COLUMNS][column_idx];
                const partial_column_counts = partial_line_counts[PARTIAL_COLUMNS][column_idx];
                column_counts[COMPACT_AVG_ROW_COUNT] = Math.round(
                    column_counts[COMPACT_AVG_ROW_COUNT] /
                    partial_column_counts[PARTIAL_FILE_COUNT],
                );
                for (
                    let row_idx = 0, row_end = column_counts[COMPACT_MACRO_ROWS].length;
                    row_idx < row_end;
                    row_idx += 1
                ) {
                    const row_counts = column_counts[COMPACT_MACRO_ROWS][row_idx];
                    const partial_row_counts = partial_column_counts[PARTIAL_MACRO_ROWS][row_idx];
                    row_counts[COMPACT_AVG_SEGMENT_COUNT] = Math.round(
                        row_counts[COMPACT_AVG_SEGMENT_COUNT] /
                        partial_row_counts[PARTIAL_FILE_COUNT],
                    );
                    for (
                        let segment_idx = 0, segment_end = row_counts[COMPACT_SEGMENTS].length;
                        segment_idx < segment_end;
                        segment_idx += 1
                    ) {
                        row_counts[COMPACT_SEGMENTS][segment_idx] = Math.round(
                            row_counts[COMPACT_SEGMENTS][segment_idx] /
                            partial_row_counts[PARTIAL_SEGMENTS][segment_idx],
                        );
                    }
                }
                for (
                    let row_idx = 0, row_end = column_counts[COMPACT_MICRO_ROWS].length;
                    row_idx < row_end;
                    row_idx += 1
                ) {
                    const row_counts = column_counts[COMPACT_MICRO_ROWS][row_idx];
                    const partial_row_counts = partial_column_counts[PARTIAL_MICRO_ROWS][row_idx];
                    row_counts[COMPACT_AVG_SEGMENT_COUNT] = Math.round(
                        row_counts[COMPACT_AVG_SEGMENT_COUNT] /
                        partial_row_counts[PARTIAL_FILE_COUNT],
                    );
                    for (
                        let segment_idx = 0, segment_end = row_counts[COMPACT_SEGMENTS].length;
                        segment_idx < segment_end;
                        segment_idx += 1
                    ) {
                        row_counts[COMPACT_SEGMENTS][segment_idx] = Math.round(
                            row_counts[COMPACT_SEGMENTS][segment_idx] /
                            partial_row_counts[PARTIAL_SEGMENTS][segment_idx],
                        );
                    }
                }
            }
        }
    }
}
