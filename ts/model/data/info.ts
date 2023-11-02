import { Count } from "../../types.js";
import { Name } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Name_Sorter from "../name_sorter.js";

import * as Book from "./book.js";

export type Tree = {
    books: Array<Book.Branch>,
};

export class Info
{
    private tree: Tree;

    // now that we are interpreting the json, we can use sets to speed this up again
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

    private language_unit_counts: { [language_name: string]: Count };
    private language_point_counts: { [language_name: string]: Count };
    private language_letter_counts: { [language_name: string]: Count };
    private language_marker_counts: { [language_name: string]: Count };
    private language_meta_letter_counts: { [language_name: string]: Count };
    private language_word_counts: { [language_name: string]: Count };
    private language_break_counts: { [language_name: string]: Count };
    private language_meta_word_counts: { [language_name: string]: Count };
    private language_part_counts: { [language_name: string]: Count };
    private language_line_counts: { [language_name: string]: Count };
    private language_file_counts: { [language_name: string]: Count };
    private language_book_counts: { [language_name: string]: Count };

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
        }
    }

    Is_Frozen():
        boolean
    {
        return Object.isFrozen(this.unique_book_names);
    }

    Freeze():
        void
    {
        Utils.Assert(
            !this.Is_Frozen(),
            `already frozen`,
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
        book_name: string,
    ):
        boolean
    {
        return this.unique_book_names.indexOf(book_name) > -1;
    }

    Add_Unique_Book_Name(
        book_name: string,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Frozen(),
            `is frozen!`,
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
        language_name: string,
    ):
        boolean
    {
        return this.language_unit_counts[language_name] != null;
    }

    Add_Unique_Language_Name(
        language_name: string,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Frozen(),
            `is frozen!`,
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
        version_name: string,
    ):
        boolean
    {
        return this.unique_version_names.indexOf(version_name) > -1;
    }

    Add_Unique_Version_Name(
        version_name: string,
    ):
        void
    {
        Utils.Assert(
            !this.Is_Frozen(),
            `is frozen!`,
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

    Increment_Total_Unit_Count(
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Total_Unit_Count() + count <= Number.MAX_SAFE_INTEGER);

        this.total_unit_count += count;
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

    Increment_Total_Point_Count(
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Total_Point_Count() + count <= Number.MAX_SAFE_INTEGER);

        this.total_point_count += count;
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

    Increment_Total_Letter_Count(
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Total_Letter_Count() + count <= Number.MAX_SAFE_INTEGER);

        this.total_letter_count += count;
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

    Increment_Total_Marker_Count(
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Total_Marker_Count() + count <= Number.MAX_SAFE_INTEGER);

        this.total_marker_count += count;
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

    Increment_Total_Meta_Letter_Count(
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Total_Meta_Letter_Count() + count <= Number.MAX_SAFE_INTEGER);

        this.total_meta_letter_count += count;
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

    Increment_Total_Word_Count(
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Total_Word_Count() + count <= Number.MAX_SAFE_INTEGER);

        this.total_word_count += count;
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

    Increment_Total_Break_Count(
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Total_Break_Count() + count <= Number.MAX_SAFE_INTEGER);

        this.total_break_count += count;
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

    Increment_Total_Meta_Word_Count(
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Total_Meta_Word_Count() + count <= Number.MAX_SAFE_INTEGER);

        this.total_meta_word_count += count;
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

    Increment_Total_Part_Count(
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Total_Part_Count() + count <= Number.MAX_SAFE_INTEGER);

        this.total_part_count += count;
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

    Increment_Total_Line_Count(
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Total_Line_Count() + count <= Number.MAX_SAFE_INTEGER);

        this.total_line_count += count;
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

    Increment_Total_File_Count(
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Total_File_Count() + count <= Number.MAX_SAFE_INTEGER);

        this.total_file_count += count;
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

    Increment_Total_Book_Count(
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Total_Book_Count() + count <= Number.MAX_SAFE_INTEGER);

        this.total_book_count += count;
    }

    Language_Unit_Count(
        language_name: string,
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
        language_name: string,
    ):
        Count
    {
        return Math.round(this.Language_Unit_Count(language_name) * 100 / this.Total_Unit_Count());
    }

    Language_Unit_Counts_And_Percents_Array():
        Array<[string, Count, Count]>
    {
        const results: Array<[string, Count, Count]> = [];

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

    Increment_Language_Unit_Count(
        language_name: string,
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Language_Unit_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.language_unit_counts[language_name] += count;
    }

    Language_Point_Count(
        language_name: string,
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
        language_name: string,
    ):
        Count
    {
        return Math.round(this.Language_Point_Count(language_name) * 100 / this.Total_Point_Count());
    }

    Language_Point_Counts_And_Percents_Array():
        Array<[string, Count, Count]>
    {
        const results: Array<[string, Count, Count]> = [];

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

    Increment_Language_Point_Count(
        language_name: string,
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Language_Point_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.language_point_counts[language_name] += count;
    }

    Language_Letter_Count(
        language_name: string,
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
        language_name: string,
    ):
        Count
    {
        return Math.round(this.Language_Letter_Count(language_name) * 100 / this.Total_Letter_Count());
    }

    Language_Letter_Counts_And_Percents_Array():
        Array<[string, Count, Count]>
    {
        const results: Array<[string, Count, Count]> = [];

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

    Increment_Language_Letter_Count(
        language_name: string,
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Language_Letter_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.language_letter_counts[language_name] += count;
    }

    Language_Marker_Count(
        language_name: string,
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
        language_name: string,
    ):
        Count
    {
        return Math.round(this.Language_Marker_Count(language_name) * 100 / this.Total_Marker_Count());
    }

    Language_Marker_Counts_And_Percents_Array():
        Array<[string, Count, Count]>
    {
        const results: Array<[string, Count, Count]> = [];

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

    Increment_Language_Marker_Count(
        language_name: string,
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Language_Marker_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.language_marker_counts[language_name] += count;
    }

    Language_Meta_Letter_Count(
        language_name: string,
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
        language_name: string,
    ):
        Count
    {
        return Math.round(this.Language_Meta_Letter_Count(language_name) * 100 / this.Total_Meta_Letter_Count());
    }

    Language_Meta_Letter_Counts_And_Percents_Array():
        Array<[string, Count, Count]>
    {
        const results: Array<[string, Count, Count]> = [];

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

    Increment_Language_Meta_Letter_Count(
        language_name: string,
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Language_Meta_Letter_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.language_meta_letter_counts[language_name] += count;
    }

    Language_Word_Count(
        language_name: string,
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
        language_name: string,
    ):
        Count
    {
        return Math.round(this.Language_Word_Count(language_name) * 100 / this.Total_Word_Count());
    }

    Language_Word_Counts_And_Percents_Array():
        Array<[string, Count, Count]>
    {
        const results: Array<[string, Count, Count]> = [];

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

    Increment_Language_Word_Count(
        language_name: string,
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Language_Word_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.language_word_counts[language_name] += count;
    }

    Language_Break_Count(
        language_name: string,
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
        language_name: string,
    ):
        Count
    {
        return Math.round(this.Language_Break_Count(language_name) * 100 / this.Total_Break_Count());
    }

    Language_Break_Counts_And_Percents_Array():
        Array<[string, Count, Count]>
    {
        const results: Array<[string, Count, Count]> = [];

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

    Increment_Language_Break_Count(
        language_name: string,
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Language_Break_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.language_break_counts[language_name] += count;
    }

    Language_Meta_Word_Count(
        language_name: string,
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
        language_name: string,
    ):
        Count
    {
        return Math.round(this.Language_Meta_Word_Count(language_name) * 100 / this.Total_Meta_Word_Count());
    }

    Language_Meta_Word_Counts_And_Percents_Array():
        Array<[string, Count, Count]>
    {
        const results: Array<[string, Count, Count]> = [];

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

    Increment_Language_Meta_Word_Count(
        language_name: string,
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Language_Meta_Word_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.language_meta_word_counts[language_name] += count;
    }

    Language_Part_Count(
        language_name: string,
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
        language_name: string,
    ):
        Count
    {
        return Math.round(this.Language_Part_Count(language_name) * 100 / this.Total_Part_Count());
    }

    Language_Part_Counts_And_Percents_Array():
        Array<[string, Count, Count]>
    {
        const results: Array<[string, Count, Count]> = [];

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

    Increment_Language_Part_Count(
        language_name: string,
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Language_Part_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.language_part_counts[language_name] += count;
    }

    Language_Line_Count(
        language_name: string,
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
        language_name: string,
    ):
        Count
    {
        return Math.round(this.Language_Line_Count(language_name) * 100 / this.Total_Line_Count());
    }

    Language_Line_Counts_And_Percents_Array():
        Array<[string, Count, Count]>
    {
        const results: Array<[string, Count, Count]> = [];

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

    Increment_Language_Line_Count(
        language_name: string,
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Language_Line_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.language_line_counts[language_name] += count;
    }

    Language_File_Count(
        language_name: string,
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
        language_name: string,
    ):
        Count
    {
        return Math.round(this.Language_File_Count(language_name) * 100 / this.Total_File_Count());
    }

    Language_File_Counts_And_Percents_Array():
        Array<[string, Count, Count]>
    {
        const results: Array<[string, Count, Count]> = [];

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

    Increment_Language_File_Count(
        language_name: string,
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Language_File_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.language_file_counts[language_name] += count;
    }

    Language_Book_Count(
        language_name: string,
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
        language_name: string,
    ):
        Count
    {
        return Math.round(this.Language_Book_Count(language_name) * 100 / this.Total_Book_Count());
    }

    Language_Book_Counts_And_Percents_Array():
        Array<[string, Count, Count]>
    {
        const results: Array<[string, Count, Count]> = [];

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

    Increment_Language_Book_Count(
        language_name: string,
        count: Count,
    ):
        void
    {
        Utils.Assert(this.Language_Book_Count(language_name) + count <= Number.MAX_SAFE_INTEGER);

        this.language_book_counts[language_name] += count;
    }

    To_JSON_String():
        string
    {
        return JSON.parse(this as any);
    }
}
