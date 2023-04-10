import * as fs from "fs";

import { Integer } from "../types.js";
import { Count } from "../types.js";
import { Index } from "../types.js";
import { Name } from "../types.js";
import { Path } from "../types.js";

import * as Utils from "../utils.js";
import * as Unicode from "../unicode.js";

import * as Data from "../model/data.js";
import * as Text from "../model/text.js";

async function Read_Directory(
    directory_path: Path,
):
    Promise<Array<any>>
{
    return new Promise(
        function (
            resolve,
            reject,
        )
        {
            fs.readdir(
                directory_path,
                {
                    withFileTypes: true,
                },
                function (
                    error: Error,
                    entities: Array<any>,
                )
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
    return new Promise(
        function (
            resolve,
            reject,
        )
        {
            fs.readFile(
                file_path,
                `utf8`,
                function (
                    error: Error,
                    file_text: string,
                )
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
    return new Promise(
        function (
            resolve,
            reject,
        )
        {
            fs.writeFile(
                file_path,
                data,
                `utf8`,
                function (
                    error: Error,
                )
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
    const names = [];

    const entities = await Read_Directory(folder_path);
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
    const names = [];

    const entities = await Read_Directory(folder_path);
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

class Unique_Part_Indices
{
    private parts: { [index: string]: Index };

    constructor(
        {
            unique_part_values,
        }: {
            unique_part_values: Array<string>,
        },
    )
    {
        this.parts = {};
        for (let idx = 0, end = unique_part_values.length; idx < end; idx += 1) {
            this.parts[unique_part_values[idx]] = idx;
        }
    }

    Index(
        part_value: string,
    ):
        Index
    {
        Utils.Assert(
            this.parts.hasOwnProperty(part_value),
            `Unknown part_value.`,
        );

        return this.parts[part_value];
    }
}

class Unique_Part_Values
{
    private parts: { [index: Index]: string };

    constructor(
        {
            unique_part_values,
        }: {
            unique_part_values: Array<string>,
        },
    )
    {
        this.parts = {};
        for (let idx = 0, end = unique_part_values.length; idx < end; idx += 1) {
            this.parts[idx] = unique_part_values[idx];
        }
    }

    Value(
        part_index: Index,
    ):
        string
    {
        Utils.Assert(
            this.parts.hasOwnProperty(part_index),
            `Unknown part_index.`,
        );

        return this.parts[part_index];
    }
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
        unique_part_values: [],
    };
    const unique_names = new Unique_Names();
    const unique_parts = new Unique_Parts();

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
                language_branch.versions.push(version_branch);
                unique_names.Add_Version(version_name);
                for (
                    const file_name of (await File_Names(files_path)).filter(
                        function (
                            file_name,
                        ):
                            boolean
                        {
                            return (
                                /\.txt$/.test(file_name) &&
                                !/COPY\.txt$/.test(file_name)
                            );
                        },
                    ).sort()
                ) {
                    const file_path: Path = `${files_path}/${file_name}`;
                    const file_leaf: Data.File.Leaf = {
                        name: file_name,
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

    const unique_part_indices: Unique_Part_Indices = new Unique_Part_Indices(
        {
            unique_part_values: data_info.unique_part_values,
        },
    );
    const compressed_parts: Array<string> = [];
    for (const book_name of (await Folder_Names(books_path)).sort()) {
        const languages_path: Path = `${books_path}/${book_name}`;
        for (const language_name of (await Folder_Names(languages_path)).sort()) {
            const versions_path: Path = `${languages_path}/${language_name}`;
            for (const version_name of (await Folder_Names(versions_path)).sort()) {
                const files_path: Path = `${versions_path}/${version_name}`;
                const dictionary: Text.Dictionary.Instance = new Text.Dictionary.Instance(
                    {
                        json: await Read_File(`${files_path}/Dictionary.json`),
                    },
                );
                for (
                    const file_name of (await File_Names(files_path)).filter(
                        function (
                            file_name,
                        ):
                            boolean
                        {
                            return (
                                /\.txt$/.test(file_name) &&
                                !/COPY\.txt$/.test(file_name)
                            );
                        },
                    ).sort()
                ) {
                    const file_path: Path = `${files_path}/${file_name}`;
                    const text: Text.Instance = new Text.Instance(
                        {
                            dictionary: dictionary,
                            value: await Read_File(file_path),
                        },
                    );
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
                            const index: Index = unique_part_indices.Index(part.Value());
                            compressed_parts.push(String.fromCodePoint(index));
                        }
                    }
                }
            }
        }
    }

    /*
    await Write_File(
        `${data_path}/Test_Compressed.txt`,
        compressed_parts.join(``),
    );
    */

    const unique_part_values: Unique_Part_Values = new Unique_Part_Values(
        {
            unique_part_values: data_info.unique_part_values,
        },
    );
    const uncompressed_parts: Array<string> = [];
    for (const compressed_part of compressed_parts) {
        uncompressed_parts.push(unique_part_values.Value(compressed_part.codePointAt(0) as Index));
    }

    /*
    await Write_File(
        `${data_path}/Test_Uncompressed.txt`,
        uncompressed_parts.join(``),
    );
    */
}

/*
if (fs.existsSync(`${versions_path}/${version_name}/Search`)) {
    fs.rmSync(
        `${versions_path}/${version_name}/Search`,
        {
            recursive: true,
            force: true,
        },
    );
}
*/

(
    async function Main()
    {
        await Generate();
    }
)();
