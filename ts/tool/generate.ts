import * as fs from "fs";

import { Integer } from "../types.js";
import { Count } from "../types.js";
import { Name } from "../types.js";
import { Path } from "../types.js";

import * as Utils from "../utils.js";

import * as Data from "../model/data.js";
import * as Text from "../model/text.js";

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

async function Read_File(
    file_path: Path,
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
                `utf8`,
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
                `utf8`,
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
        unique_part_values: [],
    };
    const unique_names: Unique_Names = new Unique_Names();
    const unique_parts: Unique_Parts = new Unique_Parts();

    const data_path: Path = `./Data`;
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
                const file_names: Array<string> =
                    (await File_Names(files_path)).filter(Filter_File_Names).sort();
                language_branch.versions.push(version_branch);
                unique_names.Add_Version(version_name);
                for (const [file_index, file_name] of file_names.entries()) {
                    const file_path: Path = `${files_path}/${file_name}`;
                    const file_leaf: Data.File.Leaf = {
                        name: file_name.replace(/\.[^.]*$/, `.comp`),
                        index: file_index,
                    };
                    const text: Text.Instance = new Text.Instance(
                        {
                            dictionary: dictionary,
                            value: await Read_File(file_path),
                        },
                    );
                    version_branch.files.push(file_leaf);
                    for (
                        let line_idx = 0, line_end = text.Line_Count();
                        line_idx < line_end;
                        line_idx += 1
                    ) {
                        const line: Text.Line.Instance = text.Line(line_idx);
                        for (
                            let part_idx = 0, part_end = line.Macro_Part_Count();
                            part_idx < part_end;
                            part_idx += 1
                        ) {
                            const part: Text.Part.Instance = line.Macro_Part(part_idx);
                            unique_parts.Add(part.Value());
                        }
                    }
                }
            }
        }
    }

    data_info.unique_book_names = unique_names.Books();
    data_info.unique_language_names = unique_names.Languages();
    data_info.unique_version_names = unique_names.Versions();
    data_info.unique_part_values = unique_parts.Values();

    await Write_File(
        `${data_path}/Info.json`,
        JSON.stringify(data_info),
    );

    const dictionary_compressor: Data.Compressor.Instance = new Data.Compressor.Instance(
        {
            unique_parts: data_info.unique_part_values,
        },
    );
    for (const book_name of (await Folder_Names(books_path)).sort()) {
        const languages_path: Path = `${books_path}/${book_name}`;
        for (const language_name of (await Folder_Names(languages_path)).sort()) {
            const versions_path: Path = `${languages_path}/${language_name}`;
            for (const version_name of (await Folder_Names(versions_path)).sort()) {
                const files_path: Path = `${versions_path}/${version_name}`;
                const file_names: Array<string> =
                    (await File_Names(files_path)).filter(Filter_File_Names).sort();
                const file_texts: Array<string> = [];
                const version_dictionary_json: Text.Value =
                    await Read_File(`${files_path}/Dictionary.json`);
                const version_dictionary: Text.Dictionary.Instance = new Text.Dictionary.Instance(
                    {
                        json: version_dictionary_json,
                    },
                );
                const compressed_version_dictionary_json: Text.Value =
                    dictionary_compressor.Compress_Dictionary(version_dictionary_json);
                const uncompressed_version_dictionary_json: Text.Value =
                    dictionary_compressor.Decompress_Dictionary(compressed_version_dictionary_json);
                Utils.Assert(
                    uncompressed_version_dictionary_json === version_dictionary_json,
                    `Invalid dictionary decompression!`,
                );
                await Write_File(
                    `${files_path}/${Data.Version.Dictionary.Symbol.NAME}.${Data.Version.Dictionary.Symbol.EXTENSION}`,
                    compressed_version_dictionary_json,
                );
                const version_compressor: Data.Compressor.Instance = new Data.Compressor.Instance(
                    {
                        unique_parts: Array.from(version_dictionary.Unique_Parts()),
                    },
                );
                for (const file_name of file_names) {
                    const file_path: Path = `${files_path}/${file_name}`;
                    const file_text: Text.Value = await Read_File(file_path);
                    file_texts.push(file_text);
                    const compressed_file_text: string =
                        version_compressor.Compress(
                            {
                                value: file_text,
                                dictionary: version_dictionary,
                            },
                        );
                    const uncompressed_file_text: string =
                        version_compressor.Decompress(
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
                        `${files_path}/${file_name.replace(/\.[^.]*$/, `.comp`)}`,
                        compressed_file_text,
                    );
                }
                const version_text = file_texts.join(Data.Version.Symbol.FILE_BREAK);
                const compressed_version_text: string =
                    version_compressor.Compress(
                        {
                            value: version_text,
                            dictionary: version_dictionary,
                        },
                    );
                const uncompressed_version_text: string =
                    version_compressor.Decompress(
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
}

(
    async function Main():
        Promise<void>
    {
        await Generate();
    }
)();
