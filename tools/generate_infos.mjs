/*
    Copyright 2022 r-neal-kelly
*/

`use strict`;

import * as fs from "fs";
import * as path from "path";

/* string_t[] */ async function Read_Directory(directory_path)
{
    return new Promise(function (/* function_t */ Resolve, /* function_t */ Reject)
    {
        fs.readdir(directory_path, { withFileTypes: true }, function (/* error_t */ error, /* string_t[] */ files)
        {
            if (error) {
                Reject(error);
            } else {
                Resolve(files);
            }
        });
    });
}

/* string_t */ async function Read_File(/* string_t */ path_to_file)
{
    return new Promise(function (/* function_t */ Resolve, /* function_t */ Reject)
    {
        fs.readFile(path_to_file, `utf8`, function (/* error_t */ error, /* string_t */ file_text)
        {
            if (error) {
                Reject(error);
            } else {
                Resolve(file_text);
            }
        });
    });
}

async function Write_File(path_to_file, data)
{
    return new Promise(
        function (Resolve, Reject)
        {
            fs.writeFile(
                path_to_file,
                data,
                `utf8`,
                function (error)
                {
                    if (error != null) {
                        Reject(error);
                    } else {
                        Resolve();
                    }
                },
            );
        },
    );
}

const FOLDER_TYPES = [
    `BOOKS`,
    `LANGUAGES`,
    `VERSIONS`,
    `CHAPTERS`,
];

async function Generate_Info(
    folder_path,
    folder_type,
)
{
    folder_path = folder_path.replace(/\/$/, ``);

    const info = {
        type: FOLDER_TYPES[folder_type],
    };
    const entities = await Read_Directory(folder_path);
    if (
        FOLDER_TYPES[folder_type] === `BOOKS` ||
        FOLDER_TYPES[folder_type] === `LANGUAGES` ||
        FOLDER_TYPES[folder_type] === `VERSIONS`
    ) {
        info.folder_names = [];
        for (let entity of entities) {
            if (entity.isDirectory()) {
                await Generate_Info(`${folder_path}/${entity.name}`, folder_type + 1);
                info.folder_names.push(entity.name);
            }
        }
        info.folder_names.sort();
    } else if (
        FOLDER_TYPES[folder_type] === `CHAPTERS`
    ) {
        info.file_names = [];
        for (let entity of entities) {
            if (entity.isFile()) {
                if (
                    !/\.json$/.test(entity.name) &&
                    !/COPY\.txt$/.test(entity.name)
                ) {
                    info.file_names.push(entity.name);
                }
            }
        }
        info.file_names.sort();
    }

    await Write_File(
        `${folder_path}/Info.json`,
        JSON.stringify(info, null, 4),
    );
}

(
    async function Main()
    {
        await Generate_Info(`./`, 0);
    }
)();
