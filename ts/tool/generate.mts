import * as fs from "fs";

import { Name } from "../types.js";
import { Path } from "../types.js";

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

    await Generate_Files(`${folder_path}/Files`);

    await Write_File(
        `${folder_path}/Info.json`,
        JSON.stringify(info, null, 4),
    );
}

async function Generate_Files(
    folder_path: Path,
):
    Promise<void>
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

    await Generate_Search(folder_path, info.names);

    await Write_File(
        `${folder_path}/Info.json`,
        JSON.stringify(info, null, 4),
    );
}

async function Generate_Search(
    folder_path: Path,
    file_names: Array<Name>,
)
{
    return;

    console.log(folder_path);
    console.log(file_names);

    const search = {};

    for (let idx = 0, end = file_names.length; idx < end; idx += 1) {

    }

    //console.log(await Read_File(`${folder_path}/${file_names[0]}`));
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
