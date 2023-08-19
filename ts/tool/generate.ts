import * as fs from "fs";

import { Integer } from "../types.js";
import { Count } from "../types.js";
import { Index } from "../types.js";
import { Name } from "../types.js";
import { Path } from "../types.js";

import * as Utils from "../utils.js";
import * as Unicode from "../unicode.js";

import * as Language from "../model/language.js";
import * as Data from "../model/data.js";
import * as Text from "../model/text.js";

const LINE_PATH_TYPE: Text.Line.Path_Type =
    Text.Line.Path_Type.DEFAULT;

async function Read_Directory(
    directory_path: Path,
):
    Promise<Array<any>>
{
    return new Promise<Array<any>>(
        function (
            resolve: (entities: Array<any>) => void,
            reject: (error: Error) => void,
        ):
            void
        {
            fs.readdir(
                directory_path,
                {
                    withFileTypes: true,
                },
                function (
                    error: Error | null,
                    entities: Array<any>,
                ):
                    void
                {
                    if (error != null) {
                        reject(error);
                    } else {
                        resolve(entities);
                    }
                },
            );
        },
    );
}

function Has_File(
    file_path: Path,
):
    boolean
{
    return fs.existsSync(file_path);
}

async function Read_File(
    file_path: Path,
    encoding: string = `utf8`,
):
    Promise<string>
{
    return new Promise<string>(
        function (
            resolve: (file_text: string) => void,
            reject: (error: Error) => void,
        ):
            void
        {
            fs.readFile(
                file_path,
                encoding,
                function (
                    error: Error | null,
                    file_text: string,
                ):
                    void
                {
                    if (error != null) {
                        reject(error);
                    } else {
                        resolve(file_text);
                    }
                },
            );
        },
    );
}

async function Write_File(
    file_path: Path,
    data: string,
    encoding: string = `utf8`,
):
    Promise<void>
{
    return new Promise<void>(
        function (
            resolve: () => void,
            reject: (error: Error) => void,
        ):
            void
        {
            fs.writeFile(
                file_path,
                data,
                encoding,
                function (
                    error: Error | null,
                ):
                    void
                {
                    if (error != null) {
                        reject(error);
                    } else {
                        resolve();
                    }
                },
            );
        },
    );
}

async function Folder_Names(
    folder_path: Path,
):
    Promise<Array<Name>>
{
    const names: Array<Name> = [];

    const entities: Array<any> = await Read_Directory(folder_path);
    for (let entity of entities) {
        if (entity.isDirectory()) {
            names.push(entity.name);
        }
    }

    return names;
}

async function File_Names(
    folder_path: Path,
):
    Promise<Array<Name>>
{
    const names: Array<Name> = [];

    const entities: Array<any> = await Read_Directory(folder_path);
    for (let entity of entities) {
        if (entity.isFile()) {
            names.push(entity.name);
        }
    }

    return names;
}

class Unique_Names
{
    private books: Set<Name>;
    private languages: Set<Name>;
    private versions: Set<Name>;

    constructor()
    {
        this.books = new Set();
        this.languages = new Set();
        this.versions = new Set();
    }

    Add_Book(
        name: Name,
    ):
        void
    {
        this.books.add(name);
    }

    Add_Language(
        name: Name,
    ):
        void
    {
        this.languages.add(name);
    }

    Add_Version(
        name: Name,
    ):
        void
    {
        this.versions.add(name);
    }

    Books():
        Array<Name>
    {
        return Array.from(this.books).sort();
    }

    Languages():
        Array<Name>
    {
        return Array.from(this.languages).sort();
    }

    Versions():
        Array<Name>
    {
        return Array.from(this.versions).sort();
    }
}

class Unique_Parts
{
    private parts: { [index: string]: Count };

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

function Filter_File_Names(
    file_name: string,
):
    boolean
{
    return (
        /\.txt$/.test(file_name) &&
        !/COPY\.txt$/.test(file_name)
    );
};

async function Sorted_File_Names(
    files_path: Path,
):
    Promise<Array<string>>
{
    if (Has_File(`${files_path}/Order.json`)) {
        return JSON.parse(await Read_File(`${files_path}/Order.json`));
    } else {
        return (await File_Names(files_path)).filter(Filter_File_Names).sort();
    }
}

function Assert_Greek_Normalization(
    file_path: Path,
    file_text: string,
):
    void
{
    Utils.Assert(
        Language.Greek.Normalize_With_Combined_Points(
            Language.Greek.Normalize_With_Baked_Points(file_text),
        ) === file_text,
        `
            failed to reproduce original file_text after Greek normalization
            ${file_path}
        `,
    );
}

async function Generate():
    Promise<void>
{
    const data_info: Data.Info = {
        tree: {
            books: [],
        },

        unique_book_names: [],
        unique_language_names: [],
        unique_version_names: [],
        unique_part_values: {},

        total_unit_count: 0,
        total_point_count: 0,
        total_letter_count: 0,
        total_marker_count: 0,
        total_meta_letter_count: 0,
        total_word_count: 0,
        total_break_count: 0,
        total_meta_word_count: 0,
        total_part_count: 0,
        total_line_count: 0,
        total_file_count: 0,
        total_book_count: 0,
    };
    const unique_names: Unique_Names = new Unique_Names();
    const unique_parts: { [language_name: Name]: Unique_Parts } = {};

    function Update_Info_Part_Counts(
        info: Data.Info,
        part: Text.Part.Instance,
    ):
        void
    {
        const part_type: Text.Part.Type = part.Part_Type();
        const part_value: string = part.Value();
        const part_unit_count: Count = part_value.length;
        const part_point_count: Count = Unicode.Point_Count(part_value);

        Utils.Assert(info.total_unit_count + part_unit_count <= Number.MAX_SAFE_INTEGER);
        info.total_unit_count += part_unit_count;

        Utils.Assert(info.total_point_count + part_point_count <= Number.MAX_SAFE_INTEGER);
        info.total_point_count += part_point_count;

        if (part_type === Text.Part.Type.LETTER) {
            Utils.Assert(info.total_letter_count + 1 <= Number.MAX_SAFE_INTEGER);
            info.total_letter_count += 1;

            Utils.Assert(info.total_part_count + 1 <= Number.MAX_SAFE_INTEGER);
            info.total_part_count += 1;

        } else if (part_type === Text.Part.Type.MARKER) {
            Utils.Assert(info.total_marker_count + 1 <= Number.MAX_SAFE_INTEGER);
            info.total_marker_count += 1;

            Utils.Assert(info.total_part_count + 1 <= Number.MAX_SAFE_INTEGER);
            info.total_part_count += 1;

        } else if (part_type === Text.Part.Type.WORD) {
            Utils.Assert(info.total_letter_count + part_point_count <= Number.MAX_SAFE_INTEGER);
            info.total_letter_count += part_point_count;

            Utils.Assert(info.total_word_count + 1 <= Number.MAX_SAFE_INTEGER);
            info.total_word_count += 1;

            Utils.Assert(info.total_part_count + 1 <= Number.MAX_SAFE_INTEGER);
            info.total_part_count += 1;

        } else if (part_type === Text.Part.Type.BREAK) {
            Utils.Assert(info.total_marker_count + part_point_count <= Number.MAX_SAFE_INTEGER);
            info.total_marker_count += part_point_count;

            Utils.Assert(info.total_break_count + 1 <= Number.MAX_SAFE_INTEGER);
            info.total_break_count += 1;

            Utils.Assert(info.total_part_count + 1 <= Number.MAX_SAFE_INTEGER);
            info.total_part_count += 1;

        } else if (part_type === Text.Part.Type.COMMAND) {
            // Keep in mind, these commands can be split, so we don't actually
            // need to work with complex inner arguments, as they are already
            // separated for us. We avoid counting the last_of_split as a separate
            // command, but we still count everything including it as a meta_letter.

            const command: Text.Part.Command.Instance = (part as Text.Part.Command.Instance);

            Utils.Assert(info.total_meta_letter_count + part_point_count <= Number.MAX_SAFE_INTEGER);
            info.total_meta_letter_count += part_point_count;

            if (!command.Is_Last_Of_Split()) {
                Utils.Assert(info.total_meta_word_count + 1 <= Number.MAX_SAFE_INTEGER);
                info.total_meta_word_count += 1;

                Utils.Assert(info.total_part_count + 1 <= Number.MAX_SAFE_INTEGER);
                info.total_part_count += 1;
            }

        }
    }

    async function Update_Readme(
        info: Data.Info,
    ):
        Promise<void>
    {
        let readme_text: string = await Read_File(`./README.md`);

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

            const total_word_percent: Integer = Math.round(info.total_word_count * 100 / info.total_part_count);
            const total_meta_word_percent: Integer = Math.round(info.total_meta_word_count * 100 / info.total_part_count);
            const total_non_word_percent: Integer = Math.round(info.total_break_count * 100 / info.total_part_count);
            const total_letter_percent: Integer = Math.round(info.total_letter_count * 100 / info.total_point_count);
            const total_meta_letter_percent: Integer = Math.round(info.total_meta_letter_count * 100 / info.total_point_count);
            const total_non_letter_percent: Integer = Math.round(info.total_marker_count * 100 / info.total_point_count);

            readme_text =
                readme_text.slice(0, stats_first) +
                `## Stats\n\n` +

                `- Unique Languages: ${Utils.Add_Commas_To_Number(info.unique_language_names.length)}\n` +
                `- Unique Versions: ${Utils.Add_Commas_To_Number(info.unique_version_names.length)}\n` +
                `- Unique Books: ${Utils.Add_Commas_To_Number(info.unique_book_names.length)}\n\n` +

                `<br>\n\n` +

                `- Total Books: ${Utils.Add_Commas_To_Number(info.total_book_count)}\n` +
                `- Total Files: ${Utils.Add_Commas_To_Number(info.total_file_count)}\n` +
                `- Total Lines: ${Utils.Add_Commas_To_Number(info.total_line_count)}\n` +
                `- Total Parts: ${Utils.Add_Commas_To_Number(info.total_part_count)}\n` +
                `    - Words: ${Utils.Add_Commas_To_Number(info.total_word_count)} (~${total_word_percent}%)\n` +
                `    - Meta-Words: ${Utils.Add_Commas_To_Number(info.total_meta_word_count)} (~${total_meta_word_percent}%)\n` +
                `    - Non-Words: ${Utils.Add_Commas_To_Number(info.total_break_count)} (~${total_non_word_percent}%)\n` +
                `- Total Unicode Points: ${Utils.Add_Commas_To_Number(info.total_point_count)}\n` +
                `    - Letters: ${Utils.Add_Commas_To_Number(info.total_letter_count)} (~${total_letter_percent}%)\n` +
                `    - Meta-Letters: ${Utils.Add_Commas_To_Number(info.total_meta_letter_count)} (~${total_meta_letter_percent}%)\n` +
                `    - Non-Letters: ${Utils.Add_Commas_To_Number(info.total_marker_count)} (~${total_non_letter_percent}%)\n` +

                readme_text.slice(stats_end, readme_text.length);
        }

        await Write_File(`./README.md`, readme_text);
    }

    const data_path: Path = `./data`;
    const books_path: Path = `${data_path}/Books`;
    for (const book_name of (await Folder_Names(books_path)).sort()) {
        const languages_path: Path = `${books_path}/${book_name}`;
        const book_branch: Data.Book.Branch = {
            name: book_name,
            languages: [],
        };
        data_info.tree.books.push(book_branch);
        unique_names.Add_Book(book_name);
        for (const language_name of (await Folder_Names(languages_path)).sort()) {
            const versions_path: Path = `${languages_path}/${language_name}`;
            const language_branch: Data.Language.Branch = {
                name: language_name,
                versions: [],
            };
            book_branch.languages.push(language_branch);
            unique_names.Add_Language(language_name);
            if (unique_parts[language_name] == null) {
                unique_parts[language_name] = new Unique_Parts();
            }
            for (const version_name of (await Folder_Names(versions_path)).sort()) {
                const files_path: Path = `${versions_path}/${version_name}`;
                const version_branch: Data.Version.Branch = {
                    name: version_name,
                    files: [],
                };
                const dictionary: Text.Dictionary.Instance = new Text.Dictionary.Instance(
                    {
                        json: await Read_File(`${files_path}/Dictionary.json`),
                    },
                );
                const file_names: Array<string> = await Sorted_File_Names(files_path);
                language_branch.versions.push(version_branch);
                unique_names.Add_Version(version_name);
                dictionary.Validate();
                data_info.total_book_count += 1;
                data_info.total_file_count += file_names.length;
                for (const file_name of file_names) {
                    const file_path: Path = `${files_path}/${file_name}`;
                    const file_leaf: Data.File.Leaf = Utils.Remove_File_Extension(file_name);
                    const text: Text.Instance = new Text.Instance(
                        {
                            dictionary: dictionary,
                            value: await Read_File(file_path),
                        },
                    );
                    version_branch.files.push(file_leaf);
                    data_info.total_line_count += text.Line_Count();
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
                            unique_parts[language_name].Add(part.Value());
                            Update_Info_Part_Counts(data_info, part);
                        }
                    }
                }
            }
        }
    }

    data_info.unique_book_names = unique_names.Books();
    data_info.unique_language_names = unique_names.Languages();
    data_info.unique_version_names = unique_names.Versions();
    for (const language_name of Object.keys(unique_parts)) {
        data_info.unique_part_values[language_name] = unique_parts[language_name].Values();
    }

    Utils.Assert(
        (
            data_info.total_word_count +
            data_info.total_meta_word_count +
            data_info.total_break_count
        ) === data_info.total_part_count,
        `Miscount of total_part_count`,
    );

    Utils.Assert(
        (
            data_info.total_letter_count +
            data_info.total_meta_letter_count +
            data_info.total_marker_count
        ) === data_info.total_point_count,
        `Miscount of total_point_count`,
    );

    await Write_File(
        `${data_path}/Info.json`,
        JSON.stringify(data_info),
    );

    for (const book_name of (await Folder_Names(books_path)).sort()) {
        const languages_path: Path = `${books_path}/${book_name}`;
        for (const language_name of (await Folder_Names(languages_path)).sort()) {
            const versions_path: Path = `${languages_path}/${language_name}`;
            const compressor: Data.Compressor.Instance = new Data.Compressor.Instance(
                {
                    unique_parts: data_info.unique_part_values[language_name],
                },
            );
            for (const version_name of (await Folder_Names(versions_path)).sort()) {
                const files_path: Path = `${versions_path}/${version_name}`;
                const file_names: Array<string> = await Sorted_File_Names(files_path);
                const file_texts: Array<string> = [];
                const version_dictionary_json: Text.Value =
                    await Read_File(`${files_path}/Dictionary.json`);
                const version_dictionary: Text.Dictionary.Instance = new Text.Dictionary.Instance(
                    {
                        json: version_dictionary_json,
                    },
                );
                const compressed_version_dictionary_json: Text.Value =
                    compressor.Compress_Dictionary(version_dictionary_json);
                const uncompressed_version_dictionary_json: Text.Value =
                    compressor.Decompress_Dictionary(compressed_version_dictionary_json);
                Utils.Assert(
                    uncompressed_version_dictionary_json === version_dictionary_json,
                    `Invalid dictionary decompression!`,
                );
                await Write_File(
                    `${files_path}/${Data.Version.Dictionary.Symbol.NAME}.${Data.Version.Dictionary.Symbol.EXTENSION}`,
                    compressed_version_dictionary_json,
                );
                for (const file_name of file_names) {
                    const file_path: Path = `${files_path}/${file_name}`;
                    const file_text: Text.Value = await Read_File(file_path);
                    file_texts.push(file_text);
                    Assert_Greek_Normalization(file_path, file_text);
                    const compressed_file_text: string =
                        compressor.Compress(
                            {
                                value: file_text,
                                dictionary: version_dictionary,
                            },
                        );
                    const uncompressed_file_text: string =
                        compressor.Decompress(
                            {
                                value: compressed_file_text,
                                dictionary: version_dictionary,
                            },
                        );
                    Utils.Assert(
                        uncompressed_file_text === file_text,
                        `Invalid decompression!`,
                    );
                    await Write_File(
                        `${files_path}/${file_name.replace(/\.[^.]*$/, `.${Data.Version.Dictionary.Symbol.EXTENSION}`)}`,
                        compressed_file_text,
                    );
                }
                const version_text = file_texts.join(Data.Version.Symbol.FILE_BREAK);
                const compressed_version_text: string =
                    compressor.Compress(
                        {
                            value: version_text,
                            dictionary: version_dictionary,
                        },
                    );
                const uncompressed_version_text: string =
                    compressor.Decompress(
                        {
                            value: compressed_version_text,
                            dictionary: version_dictionary,
                        },
                    );
                Utils.Assert(
                    uncompressed_version_text === version_text,
                    `Invalid decompression!`,
                );
                await Write_File(
                    `${files_path}/${Data.Version.Text.Symbol.NAME}.${Data.Version.Text.Symbol.EXTENSION}`,
                    compressed_version_text,
                );
            }
        }
    }

    await Update_Readme(data_info);
}

(
    async function Main():
        Promise<void>
    {
        await Generate();
    }
)();
