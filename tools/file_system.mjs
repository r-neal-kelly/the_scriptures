/*
    Copyright 2023 r-neal-kelly
*/

`use strict`;

import * as fs from "fs";

export async function Read_Folder(
    folder_path,
)
{
    return new Promise(
        function (
            resolve,
            reject,
        )
        {
            fs.readdir(
                folder_path,
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

export function Has_File(
    file_path,
)
{
    return fs.existsSync(file_path);
}

export async function Read_File(
    file_path,
    encoding = `utf8`,
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
                encoding,
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

export async function Write_File(
    file_path,
    data,
    encoding = `utf8`,
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
                encoding,
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
