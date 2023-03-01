/*
    Copyright 2022 r-neal-kelly
*/

`use strict`;

import * as fs from "fs";
import * as path from "path";

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

const /* string_t */ help_message = `
Info:

    Prints a list of any lines that differ between two files.

Parameter #1 and #2:

    relative or absolute path, e.g. "../chapter_01.txt" or "./chapter_02.txt"

    "-h" or "--help" or (none):
        Displays this message in the terminal.
`;

(/* void_t */ async function Main()
{
    const /* string_t[] */ args = process.argv.slice(2);

    if (args.includes(`-h`) || args.includes(`--help`) || args.length != 2) {
        console.log(help_message);
    } else {
        const /* string_t */ file_path_a = path.resolve(args[0]);
        const /* string_t */ file_path_b = path.resolve(args[1]);

        try {
            const /* string_t */ file_data_a = await Read_File(file_path_a);
            const /* string_t */ file_data_b = await Read_File(file_path_b);

            const /* Array<string_t> */ file_lines_a = file_data_a.split(/\r?\n/);
            const /* Array<string_t> */ file_lines_b = file_data_b.split(/\r?\n/);

            let /* Array<string_t> */ lines_a;
            let /* Array<string_t> */ lines_b;
            if (file_lines_a.length > file_lines_b.length) {
                lines_a = file_lines_a;
                lines_b = file_lines_b;
            } else {
                lines_a = file_lines_b;
                lines_b = file_lines_a;
            }

            for (let idx = 0, end = lines_a.length; idx < end; idx += 1) {
                if (
                    idx >= lines_b.length ||
                    lines_a[idx] !== lines_b[idx]
                ) {
                    console.log(`${idx}`);

                }
            }
        } catch (error) {
            throw error;
        }
    }
})();
