import * as fs from "fs";
import * as child_process from "child_process";

import { Name } from "../types.js";
import { Path } from "../types.js";

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

async function Recursive_File_Paths(
    folder_path: Path,
    names: Array<Name> = [],
):
    Promise<Array<Name>>
{
    const entities: Array<any> = await Read_Directory(folder_path);
    for (let entity of entities) {
        if (entity.isDirectory()) {
            await Recursive_File_Paths(`${folder_path}/${entity.name}`, names);
        } else {
            names.push(`${folder_path}/${entity.name}`);
        }
    }

    return names;
}

async function Minify():
    Promise<void>
{
    const file_paths: Array<Name> =
        (await Recursive_File_Paths(`./js`)).map(s => `"${s}"`);

    const promises: Array<Promise<void>> = [];
    for (const file_path of file_paths) {
        promises.push(
            new Promise<void>(
                function (
                    resolve: () => void,
                ):
                    void
                {
                    child_process.spawn(
                        "terser",
                        [
                            file_path,
                            `-c`,
                            `-m`,
                            `-o ${file_path}`,
                        ],
                        {
                            shell: true,
                        },
                    ).on(
                        `close`,
                        function ():
                            void
                        {
                            resolve();
                        },
                    );
                },
            ),
        );
    }

    await Promise.all(promises);
}

(
    async function Main():
        Promise<void>
    {
        await Minify();
    }
)();
