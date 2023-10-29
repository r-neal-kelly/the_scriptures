import * as fs from "fs";

import { Count } from "../types.js";
import { Name } from "../types.js";
import { Path } from "../types.js";

export async function Read_Entity_Stats(
    entity_path: Path,
    use_bigint: boolean = false,
):
    Promise<any>
{
    return new Promise<any>(
        function (
            resolve: (entity_stats: any) => void,
            reject: (error: Error) => void,
        ):
            void
        {
            fs.stat(
                entity_path,
                {
                    bigint: use_bigint,
                },
                function (
                    error: Error | null,
                    entity_stats: any,
                ):
                    void
                {
                    if (error != null) {
                        reject(error);
                    } else {
                        resolve(entity_stats);
                    }
                },
            );
        },
    );
}

export async function Read_Entity_Last_Modified_Time(
    entity_path: Path,
    use_nanoseconds: boolean = false,
):
    Promise<Count>
{
    const stats: any = await Read_Entity_Stats(entity_path, use_nanoseconds);
    if (use_nanoseconds) {
        return stats.mtimeNs;
    } else {
        return stats.mtimeMs;
    }
}

export async function Read_Folder(
    folder_path: Path,
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
                folder_path,
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

export async function Read_Folder_File_Paths_Recursively(
    folder_path: Path,
    names: Array<Name> = [],
):
    Promise<Array<Name>>
{
    const entities: Array<any> = await Read_Folder(folder_path);
    for (let entity of entities) {
        if (entity.isDirectory()) {
            await Read_Folder_File_Paths_Recursively(`${folder_path}/${entity.name}`, names);
        } else {
            names.push(`${folder_path}/${entity.name}`);
        }
    }

    return names;
}

export function Has_File(
    file_path: Path,
):
    boolean
{
    return fs.existsSync(file_path);
}

export async function Read_File(
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

export async function Write_File(
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

export async function Read_And_Write_File_With_No_Carriage_Returns(
    file_path: string,
):
    Promise<string>
{
    let file_text: string = await Read_File(file_path);
    if (/\r/.test(file_text)) {
        file_text = file_text.replace(/\r?\n/g, `\n`);
        await Write_File(file_path, file_text);
    }

    return file_text;
}

export async function Folder_Names(
    folder_path: Path,
):
    Promise<Array<Name>>
{
    const names: Array<Name> = [];

    const entities: Array<any> = await Read_Folder(folder_path);
    for (let entity of entities) {
        if (entity.isDirectory()) {
            names.push(entity.name);
        }
    }

    return names;
}

export async function File_Names(
    folder_path: Path,
):
    Promise<Array<Name>>
{
    const names: Array<Name> = [];

    const entities: Array<any> = await Read_Folder(folder_path);
    for (let entity of entities) {
        if (entity.isFile()) {
            names.push(entity.name);
        }
    }

    return names;
}
