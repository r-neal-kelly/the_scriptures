import * as process from "process";

import { Integer } from "../types.js";
import { Float } from "../types.js";
import { Count } from "../types.js";
import { Index } from "../types.js";
import { Name } from "../types.js";
import { Path } from "../types.js";

import * as Utils from "../utils.js";
import * as Unicode from "../unicode.js";
import * as Compressor from "../compressor.js";

import * as Language from "../model/language.js";
import * as Data from "../model/data.js";
import * as Text from "../model/text.js";

import * as File_System from "./file_system.js";

const TIMESTAMP_PATH: Path =
    `./.timestamp`;
const README_PATH: Path =
    `./README.md`;
const DEFAULT_LAST_TIMESTAMP: Count =
    0;
const IS_COMPRESSED_FILE_REGEX: RegExp =
    new RegExp(`\\.${Data.Consts.FILE_EXTENSION}$`);

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

class Line_Language
{
    private default_language_name: Language.Name;
    private part_counts: { [language_name: string]: Count };
    private total_part_count: Count;

    constructor(
        default_language_name: Language.Name,
    )
    {
        this.default_language_name = default_language_name;
        this.part_counts = Object.create(null);
        this.total_part_count = 0;
    }

    Add_Part(
        part: Text.Part.Instance,
    ):
        void
    {
        if (!part.Is_Command()) {
            const language_name: Language.Name =
                part.Language() || this.default_language_name;

            if (this.part_counts[language_name] == null) {
                this.part_counts[language_name] = 0;
            }
            this.part_counts[language_name] += 1;
            this.total_part_count += 1;
        }
    }

    Result():
        Language.Name
    {
        const language_percents: Array<[Language.Name, Float]> =
            Object.entries(this.part_counts).map(
                function (
                    this: Line_Language,
                    value: [string, Count],
                ):
                    [Language.Name, Float]
                {
                    return [value[0] as Language.Name, value[1] * 100 / this.total_part_count];
                }.bind(this),
            );

        language_percents.sort(
            function (
                a: [Language.Name, Float],
                b: [Language.Name, Float],
            ):
                Integer
            {
                return b[1] - a[1];
            },
        );

        if (language_percents.length > 0) {
            return language_percents[0][0];
        } else {
            return this.default_language_name;
        }
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

    if (File_System.Has_File(`${folder_path}/${Data.Consts.ORDER_JSON_NAME}`)) {
        const ordered_file_names: Array<Name> =
            JSON.parse(await File_System.Read_File(`${folder_path}/${Data.Consts.ORDER_JSON_NAME}`));

        const missing_file_names: Array<Name> = [];
        for (const file_name of file_names) {
            if (!ordered_file_names.includes(file_name)) {
                missing_file_names.push(file_name);
            }
        }

        Utils.Assert_Even_In_Release(
            missing_file_names.length === 0,
            `${folder_path}/${Data.Consts.ORDER_JSON_NAME} is missing various files:\n${JSON.stringify(missing_file_names)}`,
        );

        return ordered_file_names;
    } else {
        return file_names.sort();
    }
}

/*
    Currently the editor doesn't allow one to set the deafult_language_name of
    a dictionary, so we add it in when we generate the project. We also normalize
    all of its macro parts to make sure there is no excess in the dictionary from edits.
*/
async function Read_Dictionary_And_Files(
    files_path: Path,
    file_names: Array<string>,
    default_language_name: Language.Name,
):
    Promise<[Text.Dictionary.Instance, Array<Text.Value>, Array<Text.Instance>]>
{
    const dictionary: Text.Dictionary.Instance =
        new Text.Dictionary.Instance(
            {
                json: await File_System.Read_File(`${files_path}/${Data.Consts.DICTIONARY_JSON_NAME}`),
            },
        );
    const file_values: Array<string> = [];
    const file_texts: Array<Text.Instance> = [];

    let maybe_validation_error: Text.Dictionary.Validation_Error | null =
        dictionary.Maybe_Validation_Error();

    Utils.Assert_Even_In_Release(
        maybe_validation_error == null,
        `Dictionary failed to validate: ${maybe_validation_error}`,
    );

    dictionary.Set_Default_Language_Name(default_language_name);

    for (const file_name of file_names) {
        const file_value: string =
            await Read_File_Value(`${files_path}/${file_name}`);
        file_values.push(
            file_value,
        );
        file_texts.push(
            new Text.Instance(
                {
                    dictionary: dictionary,
                    value: file_value,
                },
            ),
        );
    }

    dictionary.Reset_With(file_texts);
    file_texts.splice(0, file_texts.length);
    maybe_validation_error = dictionary.Maybe_Validation_Error();

    Utils.Assert_Even_In_Release(
        maybe_validation_error == null,
        `Dictionary failed to validate: ${maybe_validation_error}`,
    );
    Utils.Assert(
        file_texts.length === 0,
        `did not clear file_texts correctly`,
    );

    for (const file_value of file_values) {
        file_texts.push(
            new Text.Instance(
                {
                    dictionary: dictionary,
                    value: file_value,
                },
            ),
        );
    }

    return [
        dictionary,
        file_values,
        file_texts,
    ];
}

async function Read_File_Value(
    file_path: Path,
):
    Promise<string>
{
    const file_value: string =
        await File_System.Read_And_Write_File_With_No_Carriage_Returns(file_path);

    Utils.Assert_Even_In_Release(
        Language.Greek.Normalize_With_Combined_Points(
            Language.Greek.Normalize_With_Baked_Points(file_value),
        ) === file_value,
        `
            Failed to reproduce original file_value after Greek normalization!
            ${file_value}
        `,
    );

    return file_value;
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
            `${files_path}/${Data.Consts.INFO_JSON_NAME}`,
            `${files_path}/${Data.Consts.DICTIONARY_JSON_NAME}`,
            `${files_path}/${Data.Consts.UNIQUE_PARTS_NAME}`,
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
        File_System.Has_File(`${files_path}/${Data.Consts.ORDER_JSON_NAME}`) &&
        (
            await File_System.Read_Entity_Last_Modified_Time(`${files_path}/${Data.Consts.ORDER_JSON_NAME}`) > last_timestamp
        )
    ) {
        return true;
    }

    for (const file_name of file_names) {
        const compressed_file_path: Path =
            `${files_path}/${file_name.replace(/\.[^.]*$/, `.${Data.Consts.FILE_EXTENSION}`)}`;
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

async function Interlineate():
    Promise<void>
{
    /*
        We'll have to read each file and build a map of encountered interlineation markers in the text.
        We'll have to combine unique book's dictionaries. This can actually result in a flat out hard exit error.
        The reason being that it is possible for dictioanries to be incompatible, in which case we'd have to
        update that dictionary to get it compatible with others. And we can actually produce a warning instead
        that says "this unique book couldn't be interlineated because of incompatible dictionary", but that may
        be a little too complex to write at first.

        So part of the question that remains is how will the interlineation files be stored on disk? See, we'd
        like to be able to choose what is the primary source text to interlineate from. See, it's the text that
        decides how parts of rows get both broken up and sequenced. That means we will probably need to have that
        data stored in each unique book's folder. The data may be very very big however. And again, it would need
        its own dictionary.

        It's okay to run some tests to see how much data it will create. I imagine it will be fairly large.

        Oh! Also, I'm not sure, but it's probably okay to interlineate with source texts that have margin commands.
        I figure, there will be no interlineation in the margin for the time being, so it should work until we
        potentially add another layer of abstraction into text buffers to support true margins. Right now, margins
        share the same layer of abstraction as interlineation blocks, which is maybe not what would be intuitively
        expected by the declaritve programmer.

        If I make the interlineation file its own format above the declaritive language (of which it includes) then
        I can send small bits of info over the net in a header to load up what dictionaries its needs and to combine
        dynamically on the client side. We can use the static generator to set a constant value for the cache, so I
        can actually determine what amount of dictionaries should be cachable at a time based on the max number of
        dictioanries required by the highest volume interlineation.

        And of course the dynamically created dictionaries themselves would be cached, so if you want to look at multiple
        chapters in an interlineation, you won't be having to generate it each time. And the number of generatred dicts
        should be limited to within reason, probably five at a time.

        And actually, the dynamic ones could be an efficient type that just points to already existent dictionaries, but that's
        maybe harder to cache? Perhaps not, as JS will keep them alive as long as they are pointed to. And it's still theoritcally
        going to save memory because we can just grab it from the cache if it's there, point to it, and even when it's removed from
        cache, if one of the bulky interlineations needs it, it will have it even though it's no longer in cache.
    */
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
    const data_info: Data.Info.Instance = new Data.Info.Instance({});

    async function Update_Data():
        Promise<void>
    {
        const books_path: Path = Data.Consts.BOOKS_PATH;
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
                        const version_info: Data.Version.Info.Instance =
                            new Data.Version.Info.Instance({});
                        const [dictionary, file_values, file_texts]: [
                            Text.Dictionary.Instance,
                            Array<Text.Value>,
                            Array<Text.Instance>,
                        ] = await Read_Dictionary_And_Files(files_path, file_names, language_name as Language.Name);
                        const unique_parts: Unique_Parts = new Unique_Parts();
                        version_info.Increment_File_Count(language_name, file_names.length);
                        await Delete_Compiled_Files(files_path);
                        for (
                            let file_idx = 0, file_end = file_names.length;
                            file_idx < file_end;
                            file_idx += 1
                        ) {
                            const text: Text.Instance = file_texts[file_idx];
                            version_info.Update_Buffer_Counts(text);
                            for (
                                let line_idx = 0, line_end = text.Line_Count();
                                line_idx < line_end;
                                line_idx += 1
                            ) {
                                const line: Text.Line.Instance = text.Line(line_idx);
                                const line_language: Line_Language = new Line_Language(language_name as Language.Name);
                                for (
                                    let column_idx = 0, column_end = line.Column_Count();
                                    column_idx < column_end;
                                    column_idx += 1
                                ) {
                                    const column: Text.Column.Instance = line.Column(column_idx);
                                    for (
                                        let row_idx = 0, row_end = column.Row_Count();
                                        row_idx < row_end;
                                        row_idx += 1
                                    ) {
                                        const row: Text.Row.Instance = column.Row(row_idx);
                                        for (
                                            let part_idx = 0, part_end = row.Macro_Part_Count();
                                            part_idx < part_end;
                                            part_idx += 1
                                        ) {
                                            const part: Text.Part.Instance = row.Macro_Part(part_idx);
                                            const part_type: Text.Part.Type = part.Part_Type();
                                            const part_value: string = part.Value();
                                            const part_unit_count: Count = part_value.length;
                                            const part_point_count: Count = Unicode.Point_Count(part_value);
                                            const part_language_name: Name = part.Language() ? part.Language() as Name : language_name;
                                            Utils.Assert_Even_In_Release(
                                                !part.Is_Unknown(),
                                                `Unknown part! Cannot generate:\n` +
                                                `   Book Name:          ${book_name}\n` +
                                                `   Language Name:      ${language_name}\n` +
                                                `   Version Name:       ${version_name}\n` +
                                                `   File Name:          ${file_names[file_idx]}\n` +
                                                `   Line Index:         ${line_idx}\n` +
                                                `   Column Index:       ${column_idx}\n` +
                                                `   Row Index:          ${row_idx}\n` +
                                                `   Macro Part Index:   ${part_idx}\n` +
                                                `   Macro Part Value:   ${part_value}\n`,
                                            );
                                            if (part.Is_Error()) {
                                                Utils.Assert_Even_In_Release(
                                                    part.Has_Error_Style(),
                                                    `Error not wrapped with fix command! Should not generate:\n` +
                                                    `   Book Name:          ${book_name}\n` +
                                                    `   Language Name:      ${language_name}\n` +
                                                    `   Version Name:       ${version_name}\n` +
                                                    `   File Name:          ${file_names[file_idx]}\n` +
                                                    `   Line Index:         ${line_idx}\n` +
                                                    `   Column Index:       ${column_idx}\n` +
                                                    `   Row Index:          ${row_idx}\n` +
                                                    `   Macro Part Index:   ${part_idx}\n` +
                                                    `   Macro Part Value:   ${part_value}\n`,
                                                );
                                            }
                                            unique_parts.Add(part_value);
                                            line_language.Add_Part(part);
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
                                version_info.Increment_Line_Count(line_language.Result(), 1);
                            }
                        }
                        const files_to_write: Array<Promise<void>> = [];
                        const unique_part_values: Array<string> = unique_parts.Values();
                        const unique_part_values_json: string = JSON.stringify(unique_part_values);
                        const compressed_unique_part_values_json: string = Compressor.LZSS_Compress(unique_part_values_json);
                        const decompressed_unique_part_values_json: string = Compressor.LZSS_Decompress(compressed_unique_part_values_json);
                        const compressor: Data.Version.Compressor.Instance = new Data.Version.Compressor.Instance(
                            {
                                unique_parts: unique_part_values,
                            },
                        );
                        const decompressor: Data.Version.Decompressor.Instance = new Data.Version.Decompressor.Instance(
                            {
                                unique_parts: unique_part_values,
                            },
                        );
                        const dictionary_json: Text.Value =
                            dictionary.To_JSON();
                        const compressed_dictionary_json: Text.Value =
                            compressor.Compress_Dictionary(
                                {
                                    dictionary_value: dictionary_json,
                                },
                            );
                        const decompressed_dictionary_json: Text.Value =
                            decompressor.Decompress_Dictionary(
                                {
                                    dictionary_value: compressed_dictionary_json,
                                },
                            );
                        const compressed_file_values: Array<string> = [];
                        Utils.Assert_Even_In_Release(
                            decompressed_unique_part_values_json === unique_part_values_json,
                            `Invalid unique_part_values_json decompression!`,
                        );
                        Utils.Assert_Even_In_Release(
                            decompressed_dictionary_json === dictionary_json,
                            `Invalid dictionary decompression!`,
                        );
                        version_info.Finalize();
                        files_to_write.push(
                            File_System.Write_File(
                                `${files_path}/${Data.Consts.INFO_JSON_NAME}`,
                                version_info.JSON_String(),
                            ),
                        );
                        files_to_write.push(
                            File_System.Write_File(
                                `${files_path}/${Data.Consts.UNIQUE_PARTS_NAME}`,
                                compressed_unique_part_values_json,
                            ),
                        );
                        files_to_write.push(
                            File_System.Write_File(
                                `${files_path}/${Data.Consts.DICTIONARY_JSON_NAME}`,
                                dictionary_json,
                            ),
                        );
                        files_to_write.push(
                            File_System.Write_File(
                                `${files_path}/${Data.Consts.DICTIONARY_NAME}`,
                                compressed_dictionary_json,
                            ),
                        );
                        for (let idx = 0, end = file_names.length; idx < end; idx += 1) {
                            const file_name: string = file_names[idx];
                            const file_value: string = file_values[idx]; // I think we can remove the interlineation markers here, just for this scope. however, not removing it for counts will cause bloat in the optimization for browser, because it's counted in the numbers
                            const compressed_file_value: string =
                                compressor.Compress_File(
                                    {
                                        dictionary: dictionary,
                                        file_value: file_value,
                                    },
                                );
                            const decompressed_file_value: string =
                                decompressor.Decompress_File(
                                    {
                                        dictionary: dictionary,
                                        file_value: compressed_file_value,
                                    },
                                );
                            Utils.Assert_Even_In_Release(
                                decompressed_file_value === file_value,
                                `Invalid decompression!\n` +
                                `   Book Name: ${book_name}\n` +
                                `   Language Name: ${language_name}\n` +
                                `   Version Name: ${version_name}\n` +
                                `   File Name: ${file_name}\n` +
                                `${Decompression_Line_Mismatches(file_value, decompressed_file_value)}`,
                            );
                            compressed_file_values.push(compressed_file_value);
                            files_to_write.push(
                                File_System.Write_File(
                                    `${files_path}/${file_name.replace(/\.[^.]*$/, `.${Data.Consts.FILE_EXTENSION}`)}`,
                                    compressed_file_value,
                                ),
                            );
                        }
                        const compressed_full_text: string = compressed_file_values.join(Data.Consts.VERSION_TEXT_FILE_BREAK);
                        files_to_write.push(
                            File_System.Write_File(
                                `${files_path}/${Data.Consts.VERSION_TEXT_NAME}`,
                                compressed_full_text,
                            ),
                        );
                        await Promise.all(files_to_write);
                        console.log(`        Generated ${book_name}/${language_name}/${version_name}...`);
                    }
                    const version_info: Data.Version.Info.Instance = new Data.Version.Info.Instance(
                        {
                            json: await File_System.Read_File(`${files_path}/${Data.Consts.INFO_JSON_NAME}`),
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
                    data_info.Update_Max_File_Count(version_info.Total_File_Count());
                    data_info.Update_Buffer_Counts(version_info);
                }
            }
        }
        data_info.Finalize();
        const data_info_json: string = data_info.JSON_String();
        const compressed_data_info_json: string = Compressor.LZSS_Compress(data_info_json);
        const decompressed_data_info_json: string = Compressor.LZSS_Decompress(compressed_data_info_json);
        Utils.Assert_Even_In_Release(
            decompressed_data_info_json === data_info_json,
            `LZSS failed to decompress data_info_json`,
        );
        await File_System.Write_File(
            Data.Consts.INFO_PATH,
            compressed_data_info_json,
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
