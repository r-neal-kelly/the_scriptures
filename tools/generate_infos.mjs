/*
    Copyright 2022 r-neal-kelly
*/

`use strict`;

import * as fs from "fs";

async function Read_Directory(
    directory_path,
)
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
                    error,
                    entities,
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
    file_path,
)
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
                    error,
                    file_text,
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
    file_path,
    data,
)
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
                    error,
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
    folder_path,
)
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
    folder_path,
)
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

const FOLDER_TYPES = [
    `Browser`,
    `Books`,
    `Book`,
    `Languages`,
    `Language`,
    `Versions`,
    `Version`,
    `Files`,
];
Object.freeze(FOLDER_TYPES);

async function Generate_Info(
    folder_type,
    folder_path,
)
{
    const info = {};

    if (FOLDER_TYPES[folder_type] === `Browser`) {
        await Generate_Info(folder_type + 1, `${folder_path}/Books`);

    } else if (FOLDER_TYPES[folder_type] === `Books`) {
        info.names = (await Folder_Names(folder_path)).sort();
        await Promise.all(
            info.names.map(
                async function (
                    name,
                )
                {
                    await Generate_Info(folder_type + 1, `${folder_path}/${name}`);
                },
            ),
        );

    } else if (FOLDER_TYPES[folder_type] === `Book`) {
        await Generate_Info(folder_type + 1, `${folder_path}/Languages`);

    } else if (FOLDER_TYPES[folder_type] === `Languages`) {
        info.names = (await Folder_Names(folder_path)).sort();
        await Promise.all(
            info.names.map(
                async function (
                    name,
                )
                {
                    await Generate_Info(folder_type + 1, `${folder_path}/${name}`);
                },
            ),
        );

    } else if (FOLDER_TYPES[folder_type] === `Language`) {
        await Generate_Info(folder_type + 1, `${folder_path}/Versions`);

    } else if (FOLDER_TYPES[folder_type] === `Versions`) {
        info.names = (await Folder_Names(folder_path)).sort();
        await Promise.all(
            info.names.map(
                async function (
                    name,
                )
                {
                    await Generate_Info(folder_type + 1, `${folder_path}/${name}`);
                },
            ),
        );

    } else if (FOLDER_TYPES[folder_type] === `Version`) {
        await Generate_Info(folder_type + 1, `${folder_path}/Files`);

    } else if (FOLDER_TYPES[folder_type] === `Files`) {
        info.names = (await File_Names(folder_path)).filter(
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

    } else {
        throw new Error(
            `Invalid folder type.`,
        );
    }

    await Write_File(
        `${folder_path}/Info.json`,
        JSON.stringify(info, null, 4),
    );
}

(
    async function Main()
    {
        await Generate_Info(0, `./${FOLDER_TYPES[0]}`);
    }
)();
