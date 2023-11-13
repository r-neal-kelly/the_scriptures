import * as process from "process";

import { Integer } from "../types.js";
import { Count } from "../types.js";
import { Index } from "../types.js";
import { Name } from "../types.js";
import { Path } from "../types.js";

import * as Utils from "../utils.js";
import * as Unicode from "../unicode.js";

import * as Language from "../model/language.js";
import * as Name_Sorter from "../model/name_sorter.js";
import * as Data from "../model/data.js";
import * as Text from "../model/text.js";

import * as File_System from "./file_system.js";

const TIMESTAMP_PATH: Path =
    `./.timestamp`;
const README_PATH: Path =
    `./README.md`;
const DATA_PATH: Path =
    `./data`;

const INFO_JSON_NAME: Name =
    `Info.json`;
const ORDER_JSON_NAME: Name =
    `Order.json`;
const DICTIONARY_JSON_NAME: Name =
    `Dictionary.json`;
const UNIQUE_PARTS_JSON_NAME: Name =
    `Unique_Parts.json`;

const DEFAULT_LAST_TIMESTAMP: Count =
    0;

const IS_COMPRESSED_FILE_REGEX: RegExp =
    new RegExp(`\\.${Data.File.Symbol.EXTENSION}$`);

const LINE_PATH_TYPE: Text.Line.Path_Type =
    Text.Line.Path_Type.DEFAULT;

class Unique_Parts
{
    private parts: { [part: string]: Count };

    constructor()
    {
        this.parts = {};
    }

    Add(
        part: string,
    ):
        void
    {
        if (this.parts.hasOwnProperty(part)) {
            Utils.Assert(
                this.parts[part] < Number.MAX_SAFE_INTEGER,
                `Cannot add more of this unique part!`,
            );

            this.parts[part] += 1;
        } else {
            this.parts[part] = 1;
        }
    }

    Values():
        Array<string>
    {
        return Object.keys(this.parts).sort(
            function (
                this: Unique_Parts,
                a: string,
                b: string,
            ):
                Integer
            {
                return this.parts[b] - this.parts[a];
            }.bind(this),
        );
    }

    Count(
        part: string,
    ):
        Count
    {
        Utils.Assert(
            this.parts.hasOwnProperty(part),
            `Does not have part.`,
        );

        return this.parts[part];
    }
}

async function Read_And_Sort_File_Names(
    folder_path: Path,
):
    Promise<Array<string>>
{
    const file_names: Array<Name> =
        (await File_System.File_Names(folder_path)).filter(
            function (
                file_name: string,
            ):
                boolean
            {
                return (
                    /\.txt$/.test(file_name) &&
                    !/COPY\.txt$/.test(file_name)
                );
            },
        );

    if (File_System.Has_File(`${folder_path}/${ORDER_JSON_NAME}`)) {
        const ordered_file_names: Array<Name> =
            JSON.parse(await File_System.Read_File(`${folder_path}/${ORDER_JSON_NAME}`));

        const missing_file_names: Array<Name> = [];
        for (const file_name of file_names) {
            if (!ordered_file_names.includes(file_name)) {
                missing_file_names.push(file_name);
            }
        }

        Utils.Assert(
            missing_file_names.length === 0,
            `${folder_path}/${ORDER_JSON_NAME} is missing various files:\n${JSON.stringify(missing_file_names)}`,
        );

        return ordered_file_names;
    } else {
        return file_names.sort();
    }
}

async function Read_File_Text(
    file_path: Path,
):
    Promise<string>
{
    const file_text: string =
        await File_System.Read_And_Write_File_With_No_Carriage_Returns(file_path);

    Utils.Assert(
        Language.Greek.Normalize_With_Combined_Points(
            Language.Greek.Normalize_With_Baked_Points(file_text),
        ) === file_text,
        `
            Failed to reproduce original file_text after Greek normalization!
            ${file_path}
        `,
    );

    return file_text;
}

async function Should_Version_Be_Updated(
    last_timestamp: Count,
    files_path: Path,
    file_names: Array<string>,
):
    Promise<boolean>
{
    for (const meta_file_path of
        [
            `${files_path}/${INFO_JSON_NAME}`,
            `${files_path}/${DICTIONARY_JSON_NAME}`,
            `${files_path}/${UNIQUE_PARTS_JSON_NAME}`,
        ]
    ) {
        if (
            !File_System.Has_File(meta_file_path) ||
            (
                await File_System.Read_Entity_Last_Modified_Time(meta_file_path) > last_timestamp
            )
        ) {
            return true;
        }
    }

    if (
        File_System.Has_File(`${files_path}/${ORDER_JSON_NAME}`) &&
        (
            await File_System.Read_Entity_Last_Modified_Time(`${files_path}/${ORDER_JSON_NAME}`) > last_timestamp
        )
    ) {
        return true;
    }

    for (const file_name of file_names) {
        const compressed_file_path: Path =
            `${files_path}/${file_name.replace(/\.[^.]*$/, `.${Data.File.Symbol.EXTENSION}`)}`;
        if (
            !File_System.Has_File(compressed_file_path) ||
            (
                await File_System.Read_Entity_Last_Modified_Time(`${files_path}/${file_name}`) > last_timestamp ||
                await File_System.Read_Entity_Last_Modified_Time(compressed_file_path) > last_timestamp
            )
        ) {
            return true;
        }
    }

    return false;
}

async function Delete_Compiled_Files(
    files_path: Path,
):
    Promise<void>
{
    const file_names: Array<Name> =
        (await File_System.File_Names(files_path)).filter(
            function (
                file_name: string,
            ):
                boolean
            {
                return IS_COMPRESSED_FILE_REGEX.test(file_name);
            },
        );

    await Promise.all(
        file_names.map(
            file_name => File_System.Delete_File(`${files_path}/${file_name}`),
        ),
    );
}

function Decompression_Line_Mismatches(
    uncompressed_text: string,
    decompressed_text: string,
):
    string
{
    const uncompressed_lines: Array<string> = uncompressed_text.split(/\r?\n/);
    const decompressed_lines: Array<string> = decompressed_text.split(/\r?\n/);

    let result: string = ``;
    for (let idx = 0, end = uncompressed_lines.length; idx < end; idx += 1) {
        if (idx < decompressed_lines.length) {
            if (uncompressed_lines[idx] !== decompressed_lines[idx]) {
                result += `${idx}: ${uncompressed_lines[idx]} !== ${decompressed_lines[idx]}\n`;
            }
        } else {
            result += `${idx}: <missing line>\n`;
        }
    }

    if (result === ``) {
        return `<no mismatching lines>`;
    } else {
        return result;
    }
}

async function Generate(
    do_force: boolean,
):
    Promise<void>
{
    const last_timestamp: Count = do_force ?
        DEFAULT_LAST_TIMESTAMP :
        File_System.Has_File(TIMESTAMP_PATH) ?
            await File_System.Read_Entity_Last_Modified_Time(TIMESTAMP_PATH) :
            DEFAULT_LAST_TIMESTAMP;
    const data_info: Data.Info = new Data.Info({});

    async function Update_Data():
        Promise<void>
    {
        const books_path: Path = `${DATA_PATH}/Books`;
        for (const book_name of (await File_System.Folder_Names(books_path)).sort()) {
            const languages_path: Path = `${books_path}/${book_name}`;
            const book_branch: Data.Book.Branch = {
                name: book_name,
                languages: [],
            };
            data_info.Tree().books.push(book_branch);
            data_info.Add_Unique_Book_Name(book_name);
            for (const language_name of (await File_System.Folder_Names(languages_path)).sort()) {
                const versions_path: Path = `${languages_path}/${language_name}`;
                const language_branch: Data.Language.Branch = {
                    name: language_name,
                    versions: [],
                };
                book_branch.languages.push(language_branch);
                data_info.Add_Unique_Language_Name(language_name);
                for (const version_name of (await File_System.Folder_Names(versions_path)).sort()) {
                    const files_path: Path = `${versions_path}/${version_name}`;
                    const file_names: Array<string> = await Read_And_Sort_File_Names(files_path);
                    const version_branch: Data.Version.Branch = {
                        name: version_name,
                        files: file_names.map(Utils.Remove_File_Extension),
                    };
                    language_branch.versions.push(version_branch);
                    data_info.Add_Unique_Version_Name(version_name);
                    if (await Should_Version_Be_Updated(last_timestamp, files_path, file_names)) {
                        const version_info: Data.Version.Info = new Data.Version.Info({});
                        const dictionary_json: string = await File_System.Read_File(`${files_path}/${DICTIONARY_JSON_NAME}`);
                        const dictionary: Text.Dictionary.Instance = new Text.Dictionary.Instance(
                            {
                                json: dictionary_json,
                            },
                        );
                        const unique_parts: Unique_Parts = new Unique_Parts();
                        const file_texts: Array<string> = [];
                        version_info.Increment_File_Count(language_name, file_names.length);
                        dictionary.Validate();
                        await Delete_Compiled_Files(files_path);
                        for (const file_name of file_names) {
                            const file_path: Path = `${files_path}/${file_name}`;
                            const file_text: string = await Read_File_Text(file_path);
                            const text: Text.Instance = new Text.Instance(
                                {
                                    dictionary: dictionary,
                                    value: file_text,
                                },
                            );
                            version_info.Increment_Line_Count(language_name, text.Line_Count());
                            file_texts.push(file_text);
                            for (
                                let line_idx = 0, line_end = text.Line_Count();
                                line_idx < line_end;
                                line_idx += 1
                            ) {
                                const line: Text.Line.Instance = text.Line(line_idx);
                                for (
                                    let part_idx = 0, part_end = line.Macro_Part_Count(LINE_PATH_TYPE);
                                    part_idx < part_end;
                                    part_idx += 1
                                ) {
                                    const part: Text.Part.Instance = line.Macro_Part(part_idx, LINE_PATH_TYPE);
                                    const part_type: Text.Part.Type = part.Part_Type();
                                    const part_value: string = part.Value();
                                    const part_unit_count: Count = part_value.length;
                                    const part_point_count: Count = Unicode.Point_Count(part_value);
                                    const part_language_name: Name = part.Language() ? part.Language() as Name : language_name;
                                    Utils.Assert(
                                        !part.Is_Unknown(),
                                        `Unknown part! Cannot generate:\n` +
                                        `   Book Name:          ${book_name}\n` +
                                        `   Language Name:      ${language_name}\n` +
                                        `   Version Name:       ${version_name}\n` +
                                        `   File Name:          ${file_name}\n` +
                                        `   Line Index:         ${line_idx}\n` +
                                        `   Macro Part Index:   ${part_idx}\n` +
                                        `   Macro Part Value:   ${part_value}\n`,
                                    );
                                    if (part.Is_Error()) {
                                        Utils.Assert(
                                            part.Has_Error_Style(),
                                            `Error not wrapped with error command! Should not generate:\n` +
                                            `   Book Name:          ${book_name}\n` +
                                            `   Language Name:      ${language_name}\n` +
                                            `   Version Name:       ${version_name}\n` +
                                            `   File Name:          ${file_name}\n` +
                                            `   Line Index:         ${line_idx}\n` +
                                            `   Macro Part Index:   ${part_idx}\n` +
                                            `   Macro Part Value:   ${part_value}\n`,
                                        );
                                    }
                                    unique_parts.Add(part_value);
                                    version_info.Increment_Unit_Count(part_language_name, part_unit_count);
                                    version_info.Increment_Point_Count(part_language_name, part_point_count);
                                    if (part_type === Text.Part.Type.LETTER) {
                                        version_info.Increment_Letter_Count(part_language_name, 1);
                                        version_info.Increment_Part_Count(part_language_name, 1);
                                    } else if (part_type === Text.Part.Type.MARKER) {
                                        version_info.Increment_Marker_Count(part_language_name, 1);
                                        version_info.Increment_Part_Count(part_language_name, 1);
                                    } else if (part_type === Text.Part.Type.WORD) {
                                        version_info.Increment_Letter_Count(part_language_name, part_point_count);
                                        version_info.Increment_Word_Count(part_language_name, 1);
                                        version_info.Increment_Part_Count(part_language_name, 1);
                                    } else if (part_type === Text.Part.Type.BREAK) {
                                        version_info.Increment_Marker_Count(part_language_name, part_point_count);
                                        version_info.Increment_Break_Count(part_language_name, 1);
                                        version_info.Increment_Part_Count(part_language_name, 1);
                                    } else if (part_type === Text.Part.Type.COMMAND) {
                                        // Keep in mind, these commands can be split, so we don't actually
                                        // need to work with complex inner arguments, as they are already
                                        // separated for us. We avoid counting the last_of_split as a separate
                                        // command, but we still count everything including it as a meta_letter.
                                        const command: Text.Part.Command.Instance = (part as Text.Part.Command.Instance);
                                        version_info.Increment_Meta_Letter_Count(part_language_name, part_point_count);
                                        if (!command.Is_Last_Of_Split()) {
                                            version_info.Increment_Meta_Word_Count(part_language_name, 1);
                                            version_info.Increment_Part_Count(part_language_name, 1);
                                        }
                                    }
                                }
                            }
                        }
                        const files_to_write: Array<Promise<void>> = [];
                        const full_text = file_texts.join(Data.Version.Symbol.FILE_BREAK);
                        const unique_part_values: Array<string> = unique_parts.Values();
                        const compressor: Data.Compressor.Instance = new Data.Compressor.Instance(
                            {
                                unique_parts: unique_part_values,
                            },
                        );
                        const compressed_dictionary_json: Text.Value =
                            compressor.Compress_Dictionary(
                                {
                                    dictionary_value: dictionary_json,
                                },
                            );
                        const decompressed_dictionary_json: Text.Value =
                            compressor.Decompress_Dictionary(
                                {
                                    dictionary_value: compressed_dictionary_json,
                                },
                            );
                        const compressed_full_text: string =
                            compressor.Compress_File(
                                {
                                    dictionary: dictionary,
                                    file_value: full_text,
                                },
                            );
                        const decompressed_full_text: string =
                            compressor.Decompress_File(
                                {
                                    dictionary: dictionary,
                                    file_value: compressed_full_text,
                                },
                            );
                        Utils.Assert(
                            decompressed_dictionary_json === dictionary_json,
                            `Invalid dictionary decompression!`,
                        );
                        Utils.Assert(
                            decompressed_full_text === full_text,
                            `Invalid decompression!\n` +
                            `   Book Name: ${book_name}\n` +
                            `   Language Name: ${language_name}\n` +
                            `   Version Name: ${version_name}\n` +
                            `${Decompression_Line_Mismatches(full_text, decompressed_full_text)}`,
                        );
                        files_to_write.push(
                            File_System.Write_File(
                                `${files_path}/${INFO_JSON_NAME}`,
                                version_info.JSON_String(),
                            ),
                        );
                        files_to_write.push(
                            File_System.Write_File(
                                `${files_path}/${UNIQUE_PARTS_JSON_NAME}`,
                                JSON.stringify(unique_part_values),
                            ),
                        );
                        files_to_write.push(
                            File_System.Write_File(
                                `${files_path}/${Data.Version.Dictionary.Symbol.NAME}.${Data.Version.Dictionary.Symbol.EXTENSION}`,
                                compressed_dictionary_json,
                            ),
                        );
                        files_to_write.push(
                            File_System.Write_File(
                                `${files_path}/${Data.Version.Text.Symbol.NAME}.${Data.Version.Text.Symbol.EXTENSION}`,
                                compressed_full_text,
                            ),
                        );
                        for (let idx = 0, end = file_names.length; idx < end; idx += 1) {
                            const file_name: string = file_names[idx];
                            const file_text: string = file_texts[idx];
                            const compressed_file_text: string =
                                compressor.Compress_File(
                                    {
                                        dictionary: dictionary,
                                        file_value: file_text,
                                    },
                                );
                            const decompressed_file_text: string =
                                compressor.Decompress_File(
                                    {
                                        dictionary: dictionary,
                                        file_value: compressed_file_text,
                                    },
                                );
                            Utils.Assert(
                                decompressed_file_text === file_text,
                                `Invalid decompression!\n` +
                                `   Book Name: ${book_name}\n` +
                                `   Language Name: ${language_name}\n` +
                                `   Version Name: ${version_name}\n` +
                                `   File Name: ${file_name}\n` +
                                `${Decompression_Line_Mismatches(file_text, decompressed_file_text)}`,
                            );
                            files_to_write.push(
                                File_System.Write_File(
                                    `${files_path}/${file_name.replace(/\.[^.]*$/, `.${Data.File.Symbol.EXTENSION}`)}`,
                                    compressed_file_text,
                                ),
                            );
                        }
                        await Promise.all(files_to_write);
                        console.log(`        Generated ${book_name}/${language_name}/${version_name}...`);
                    }
                    const version_info: Data.Version.Info = new Data.Version.Info(
                        {
                            json: await File_System.Read_File(`${files_path}/${INFO_JSON_NAME}`),
                        },
                    );
                    data_info.Increment_Unit_Counts(version_info.Language_Unit_Counts());
                    data_info.Increment_Point_Counts(version_info.Language_Point_Counts());
                    data_info.Increment_Letter_Counts(version_info.Language_Letter_Counts());
                    data_info.Increment_Marker_Counts(version_info.Language_Marker_Counts());
                    data_info.Increment_Meta_Letter_Counts(version_info.Language_Meta_Letter_Counts());
                    data_info.Increment_Word_Counts(version_info.Language_Word_Counts());
                    data_info.Increment_Break_Counts(version_info.Language_Break_Counts());
                    data_info.Increment_Meta_Word_Counts(version_info.Language_Meta_Word_Counts());
                    data_info.Increment_Part_Counts(version_info.Language_Part_Counts());
                    data_info.Increment_Line_Counts(version_info.Language_Line_Counts());
                    data_info.Increment_File_Counts(version_info.Language_File_Counts());
                    data_info.Increment_Book_Count(language_name, 1);
                }
            }
        }
        await File_System.Write_File(
            `${DATA_PATH}/${INFO_JSON_NAME}`,
            data_info.JSON_String(),
        );
    }

    async function Update_Readme():
        Promise<void>
    {
        let readme_text: string = await File_System.Read_File(README_PATH);

        const end_marker: string = `##`;

        const stats_marker: string = `## Stats`;
        let stats_first: Index | null = null;
        let stats_end: Index | null = null;

        for (let idx = 0, end = readme_text.length; idx < end; idx += 1) {
            const slice: string = readme_text.slice(idx);

            if (stats_first === null) {
                if (slice.slice(0, stats_marker.length) === stats_marker) {
                    stats_first = idx;
                }
            } else if (stats_end === null) {
                if (slice.slice(0, end_marker.length) === end_marker) {
                    stats_end = idx;
                }
            }
        }

        if (stats_first !== null) {
            if (stats_end === null) {
                stats_end = readme_text.length;
            }

            function List_Items(
                current_indent: string,
                items: Array<string>,
            ):
                string
            {
                let result: string = ``;

                for (const item of items) {
                    result += `${current_indent}    - ${item}\n`;
                }

                return result;
            }

            function Breakdown_By_Language(
                current_indent: string,
                language_counts_and_percents: Array<[string, Count, Count]>,
            ):
                string
            {
                let result: string = ``;

                for (const [name, count, percent] of language_counts_and_percents) {
                    result += `${current_indent}    - ${name}: ${Utils.Add_Commas_To_Number(count)} (~${percent}%)\n`;
                }

                return result;
            }

            readme_text =
                readme_text.slice(0, stats_first) +
                `## Stats\n\n` +

                `- Unique Languages: ${data_info.Unique_Language_Name_Count_String()}\n` +
                List_Items(``, data_info.Unique_Language_Names()) +
                `- Unique Versions: ${data_info.Unique_Version_Name_Count_String()}\n` +
                List_Items(``, data_info.Unique_Version_Names()) +
                `- Unique Books: ${data_info.Unique_Book_Name_Count_String()}\n` +
                List_Items(``, data_info.Unique_Book_Names()) +

                `\n<br>\n\n` +

                `- Total Books: ${data_info.Total_Book_Count_String()}\n` +
                Breakdown_By_Language(``, data_info.Language_Book_Counts_And_Percents()) +
                `- Total Files: ${data_info.Total_File_Count_String()}\n` +
                Breakdown_By_Language(``, data_info.Language_File_Counts_And_Percents()) +
                `- Total Lines: ${data_info.Total_Line_Count_String()}\n` +
                Breakdown_By_Language(``, data_info.Language_Line_Counts_And_Percents()) +
                `- Total Parts: ${data_info.Total_Part_Count_String()}\n` +
                `    - <i>By Language</i>\n` +
                Breakdown_By_Language(`    `, data_info.Language_Part_Counts_And_Percents()) +
                `    - <i>By Components</i>\n` +
                `        - Words: ${data_info.Total_Word_Count_String()} (~${data_info.Total_Word_Percent()}%)\n` +
                Breakdown_By_Language(`        `, data_info.Language_Word_Counts_And_Percents()) +
                `        - Meta-Words: ${data_info.Total_Meta_Word_Count_String()} (~${data_info.Total_Meta_Word_Percent()}%)\n` +
                Breakdown_By_Language(`        `, data_info.Language_Meta_Word_Counts_And_Percents()) +
                `        - Non-Words: ${data_info.Total_Break_Count_String()} (~${data_info.Total_Break_Percent()}%)\n` +
                Breakdown_By_Language(`        `, data_info.Language_Break_Counts_And_Percents()) +
                `- Total Unicode Points: ${data_info.Total_Point_Count_String()}\n` +
                `    - <i>By Language</i>\n` +
                Breakdown_By_Language(`    `, data_info.Language_Point_Counts_And_Percents()) +
                `    - <i>By Components</i>\n` +
                `        - Letters: ${data_info.Total_Letter_Count_String()} (~${data_info.Total_Letter_Percent()}%)\n` +
                Breakdown_By_Language(`        `, data_info.Language_Letter_Counts_And_Percents()) +
                `        - Meta-Letters: ${data_info.Total_Meta_Letter_Count_String()} (~${data_info.Total_Meta_Letter_Percent()}%)\n` +
                Breakdown_By_Language(`        `, data_info.Language_Meta_Letter_Counts_And_Percents()) +
                `        - Non-Letters: ${data_info.Total_Marker_Count_String()} (~${data_info.Total_Marker_Percent()}%)\n` +
                Breakdown_By_Language(`        `, data_info.Language_Marker_Counts_And_Percents()) +

                readme_text.slice(stats_end, readme_text.length);
        }

        await File_System.Write_File(README_PATH, readme_text);
    }

    if (last_timestamp === DEFAULT_LAST_TIMESTAMP) {
        console.log(`    Forcefully generating all files...`);
    } else {
        console.log(`    Only generating out-of-date files...`);
    }

    await Update_Data();
    await Update_Readme();

    await File_System.Write_File(
        TIMESTAMP_PATH,
        ``,
    );
}

(
    async function Main():
        Promise<void>
    {
        const args: Array<string> = process.argv.slice(2);

        await Generate(args.includes(`-f`) || args.includes(`--force`));
    }
)();
