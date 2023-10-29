import * as child_process from "child_process";

import { Name } from "../types.js";

import * as File_System from "./file_system.js";

async function Minify():
    Promise<void>
{
    const file_paths: Array<Name> =
        (await File_System.Read_Folder_File_Paths_Recursively(`./js`)).map(s => `"${s}"`);

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
