import * as fs from "fs";

import { Index } from "../types.js";
import { Name } from "../types.js";
import { Path } from "../types.js";

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

async function Generate_Data(
    folder_path: Path,
):
    Promise<void>
{
    const info: Data.Info = {
    };

    await Generate_Books(`${folder_path}/Books`);

    await Write_File(
        `${folder_path}/Info.json`,
        JSON.stringify(info, null, 4),
    );
}

async function Generate_Books(
    folder_path: Path,
):
    Promise<void>
{
    const info: Data.Books.Info = {
        names: [],
    };

    info.names = (await Folder_Names(folder_path)).sort();

    await Promise.all(
        info.names.map(
            async function (
                name,
            )
            {
                await Generate_Book(`${folder_path}/${name}`);
            },
        ),
    );

    await Write_File(
        `${folder_path}/Info.json`,
        JSON.stringify(info, null, 4),
    );
}

async function Generate_Book(
    folder_path: Path,
):
    Promise<void>
{
    const info: Data.Book.Info = {
    };

    await Generate_Languages(`${folder_path}/Languages`);

    await Write_File(
        `${folder_path}/Info.json`,
        JSON.stringify(info, null, 4),
    );
}

async function Generate_Languages(
    folder_path: Path,
):
    Promise<void>
{
    const info: Data.Languages.Info = {
        names: [],
    };

    info.names = (await Folder_Names(folder_path)).sort();

    await Promise.all(
        info.names.map(
            async function (
                name,
            )
            {
                await Generate_Language(`${folder_path}/${name}`);
            },
        ),
    );

    await Write_File(
        `${folder_path}/Info.json`,
        JSON.stringify(info, null, 4),
    );
}

async function Generate_Language(
    folder_path: Path,
):
    Promise<void>
{
    const info: Data.Language.Info = {
    };

    await Generate_Versions(`${folder_path}/Versions`);

    await Write_File(
        `${folder_path}/Info.json`,
        JSON.stringify(info, null, 4),
    );
}

async function Generate_Versions(
    folder_path: Path,
):
    Promise<void>
{
    const info: Data.Versions.Info = {
        names: [],
    };

    info.names = (await Folder_Names(folder_path)).sort();

    await Promise.all(
        info.names.map(
            async function (
                name,
            )
            {
                await Generate_Version(`${folder_path}/${name}`);
            },
        ),
    );

    await Write_File(
        `${folder_path}/Info.json`,
        JSON.stringify(info, null, 4),
    );
}

async function Generate_Version(
    folder_path: Path,
):
    Promise<void>
{
    const info: Data.Version.Info = {
    };

    const files_info: Data.Files.Info = await Generate_Files(`${folder_path}/Files`);

    await Generate_Search(folder_path, files_info.names);

    await Write_File(
        `${folder_path}/Info.json`,
        JSON.stringify(info, null, 4),
    );
}

async function Generate_Files(
    folder_path: Path,
):
    Promise<Data.Files.Info>
{
    const info: Data.Files.Info = {
        names: [],
    };

    info.names = (
        await File_Names(folder_path)
    ).filter(
        function (
            name,
        ):
            boolean
        {
            return (
                /\.txt$/.test(name) &&
                !/COPY\.txt$/.test(name)
            );
        },
    ).sort();

    await Promise.all(
        info.names.map(
            async function (
                file_name: Name,
            ):
                Promise<void>
            {
                await Generate_File(
                    folder_path,
                    file_name,
                );
            },
        ),
    );

    await Write_File(
        `${folder_path}/Info.json`,
        JSON.stringify(info, null, 4),
    );

    return info;
}

async function Generate_File(
    files_folder_path: Path,
    file_name: Path,
):
    Promise<void>
{
    const file_info: Data.File.Info = {
        line_count: 0,
        line_names: [],
    };
    const file_folder_path: Path =
        `${files_folder_path}/${file_name.replace(/\.[^.]*$/, ``)}`;

    if (fs.existsSync(file_folder_path)) {
        fs.rmSync(
            file_folder_path,
            {
                recursive: true,
                force: true,
            },
        );
    }
    fs.mkdirSync(file_folder_path);

    const dictionary: Text.Dictionary.Instance = new Text.Dictionary.Instance(
        {
            json: await Read_File(`${files_folder_path}/Dictionary.json`),
        },
    );
    const text: Text.Instance = new Text.Instance(
        {
            dictionary: dictionary,
            value: await Read_File(`${files_folder_path}/${file_name}`),
        },
    );
    for (let line_idx = 0, end = text.Line_Count(); line_idx < end; line_idx += 1) {
        const line: Text.Line.Instance = text.Line(line_idx);
        const value: Text.Value = line.Value();
        file_info.line_count += 1;
        if (value != ``) {
            file_info.line_names.push(`${line_idx}.txt`);
            await Write_File(`${file_folder_path}/${line_idx}.txt`, line.Value());
        }
    }

    await Write_File(
        `${file_folder_path}/Info.json`,
        JSON.stringify(file_info, null, 4),
    );
}

async function Generate_Search(
    version_folder_path: Path,
    file_names: Array<Name>,
):
    Promise<void>
{
    // We cache data it bite-sized chunks to diminish band-width usage for the serverless
    // client, and at the same time make searching overall more efficient than brute-force.

    // Maybe this code should be in its own module so that the code to write and read it
    // are in the same location. However, wed want to supply it the dictionary data and
    // and the data for each file through node .js, and it can remain agnostic to the
    // environment.

    const uniques: Data.Search.Uniques.Info = {};

    const occurrences: {
        [index: Data.Search.Uniques.First_Point]: Data.Search.Partition.Parts,
    } = {};
    const occurrences_info: Data.Search.Occurrences.Info = {
        names: [],
    };

    for (let file_idx = 0, end = file_names.length; file_idx < end; file_idx += 1) {
        const dictionary: Text.Dictionary.Instance = new Text.Dictionary.Instance(
            {
                json: await Read_File(`${version_folder_path}/Files/Dictionary.json`),
            },
        );
        const text: Text.Instance = new Text.Instance(
            {
                dictionary: dictionary,
                value: await Read_File(`${version_folder_path}/Files/${file_names[file_idx]}`),
            },
        );
        for (let line_idx = 0, end = text.Line_Count(); line_idx < end; line_idx += 1) {
            const line: Text.Line.Instance = text.Line(line_idx);
            for (let part_idx = 0, end = line.Macro_Part_Count(); part_idx < end; part_idx += 1) {
                const part: Text.Part.Instance = line.Macro_Part(part_idx);
                const value: Text.Value = part.Value();
                const point: Text.Value = Unicode.First_Point(value);

                if (!uniques.hasOwnProperty(point)) {
                    uniques[point] = [];
                }
                if (!uniques[point].includes(value)) {
                    uniques[point].push(value);
                }

                if (!occurrences.hasOwnProperty(point)) {
                    occurrences[point] = {};
                }
                if (!occurrences[point].hasOwnProperty(value)) {
                    occurrences[point][value] = {};
                }
                if (!occurrences[point][value].hasOwnProperty(file_idx)) {
                    occurrences[point][value][file_idx] = {};
                }
                if (!occurrences[point][value][file_idx].hasOwnProperty(line_idx)) {
                    occurrences[point][value][file_idx][line_idx] = [];
                }
                occurrences[point][value][file_idx][line_idx].push(part_idx);
            }
        }
    }

    for (const point of Object.keys(uniques)) {
        uniques[point].sort();
    }

    if (fs.existsSync(`${version_folder_path}/Search`)) {
        fs.rmSync(
            `${version_folder_path}/Search`,
            {
                recursive: true,
                force: true,
            },
        );
    }
    fs.mkdirSync(`${version_folder_path}/Search`);
    fs.mkdirSync(`${version_folder_path}/Search/Occurrences`);

    await Write_File(
        `${version_folder_path}/Search/${Data.Search.Uniques.Instance.Name()}`,
        JSON.stringify(uniques),
    );

    for (const point of Object.keys(occurrences)) {
        const name: Name = (point.codePointAt(0) as number).toString();
        occurrences_info.names.push(`${name}.json`);

        await Write_File(
            `${version_folder_path}/Search/Occurrences/${name}.json`,
            JSON.stringify(occurrences[point]),
        );
    }

    await Write_File(
        `${version_folder_path}/Search/Occurrences/Info.json`,
        JSON.stringify(occurrences_info, null, 4),
    );
}

// This maybe should read and write to the info files instead of
// always generating it, that way we can add info to it manually
// when needed. However, things that we might think need to be added
// manually may not need to be, for example which direction a language
// needs to be displayed in the view, either left-to-right, or right-to-left.
// We can simply define that by its language in a global cache, even in this
// file, or maybe from a module. E.g. English is ltr, and Hebrew rtl.
(
    async function Main()
    {
        await Generate_Data(`./Data`);
    }
)();
