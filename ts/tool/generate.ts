import * as fs from "fs";

import { Index } from "../types.js";
import { Name } from "../types.js";
import { Path } from "../types.js";

import * as Unicode from "../unicode.js";

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

type Data_Info = {
}

type Books_Info = {
    names: Array<Name>,
}

type Book_Info = {
}

type Languages_Info = {
    names: Array<Name>,
}

type Language_Info = {
}

type Versions_Info = {
    names: Array<Name>,
}

type Version_Info = {
}

type Files_Info = {
    names: Array<Name>,
}

type Search = {
}

async function Generate_Data(
    folder_path: Path,
):
    Promise<void>
{
    const info: Data_Info = {
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
    const info: Books_Info = {
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
    const info: Book_Info = {
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
    const info: Languages_Info = {
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
    const info: Language_Info = {
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
    const info: Versions_Info = {
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
    const info: Version_Info = {
    };

    const files_info: Files_Info = await Generate_Files(`${folder_path}/Files`);

    await Generate_Search(folder_path, files_info.names);

    await Write_File(
        `${folder_path}/Info.json`,
        JSON.stringify(info, null, 4),
    );
}

async function Generate_Files(
    folder_path: Path,
):
    Promise<Files_Info>
{
    const info: Files_Info = {
        names: [],
    };

    info.names = (
        await File_Names(folder_path)
    ).filter(
        function (
            name,
        )
        {
            return (
                /\.txt$/.test(name) &&
                !/COPY\.txt$/.test(name)
            );
        },
    ).sort();

    await Write_File(
        `${folder_path}/Info.json`,
        JSON.stringify(info, null, 4),
    );

    return info;
}

async function Generate_Search(
    version_folder_path: Path,
    file_names: Array<Name>,
):
    Promise<void>
{
    // Maybe this code should be in its own module so that the code to write and read it
    // are in the same location. However, wed want to supply it the dictionary data and
    // and the data for each file through node .js, and it can remain agnostic to the
    // environment.

    // ----------------------------------------------------------------------------------

    // We cache data it bite-sized chunks to diminish band-width usage for the serverless
    // client, and at the same time make searching overall more efficient than brute-force.

    // We need a file that lists out all the unique parts by first-point, sorted.

    // We need a set of files, one per first-point, that caches all the places that a
    // unique part appears in the text, by file_index, line_index, and part_index.

    // While a user is typing in the search input, the searcher takes the string,
    // and splits it by word and break using the dictionary of the currently searched
    // version, which can be looped for multiple versions at a time.

    // It then finds all the possible words/breaks it can be, from the unique-word cache.
    // For each successive part in the query, it filters down the possibilities by looking
    // at the occurrence cache, to see if the query actually exists.

    // So if the user has typed a word, and a break, and begins typing another word,
    // the first word's occurrence cache is looked up, as well as the break's. If it's
    // determined that there are occurrences of the break following the first word,
    // then the searcher knows that it's possible there is a query. The second word
    // is getting suggestions from the unique list comparing just the second word,
    // and we may simply wait to do its occurrence check after the search is initiated.
    // But we can do the first two and simply tell the user no results are possible at that
    // point. But we could start comparing to the break's occurrence cache with the second
    // word's occurrence cache, because we'll have downloaded the file of the first point,
    // and from there it's hot in memory. Unless the user changes the first point of the
    // second word, we'd be able to quickly do occurrence check based off of all the possible
    // unique-parts the word could be.

    // ----------------------------------------------------------------------------------

    type Point = string;
    type Unique = string;
    type File_Index = Index;
    type Line_Index = Index;
    type Part_index = Index;

    const uniques: {
        [index: Point]: Array<Unique>,
    } = {};
    const occurrences: {
        [index: Point]: {
            [index: Unique]: {
                [index: File_Index]: {
                    [index: Line_Index]: Array<Part_index>,
                },
            },
        },
    } = {};

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
        `${version_folder_path}/Search/Uniques.json`,
        JSON.stringify(uniques),
    );

    for (const point of Object.keys(occurrences)) {
        await Write_File(
            `${version_folder_path}/Search/Occurrences/${point.codePointAt(0)?.toString(16)}.json`,
            JSON.stringify(occurrences[point]),
        );
    }

    // At some point, we can create a search cache above the versions so it becomes
    // possible to quickly and efficiently search through multiple versions at a time.
}

// This really should read and write to the info file instead of
// always generating it, that way we can add info to it manually
// when needed.
(
    async function Main()
    {
        await Generate_Data(`./Data`);
    }
)();
