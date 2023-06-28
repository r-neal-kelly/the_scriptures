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

const /* string_t */ help_message = `
Info:
    Prints a list of any lines that differ between each file in the cwd and its tagged complement.

Parameter #1:
    "-h" or "--help" or (none):
        Displays this message in the terminal.

    a tag, such as " COPY"
        Indicates the set of files to compare to another set of files
        without the tag. E.G. With a supplied tag of "TAG", "fileTAG.txt" would be compared to "file.txt"
`;

/* Array<string_t> */ async function Compare(
    /* string_t */ file_path_a,
    /* string_t */ file_path_b,
)
{
    const /* Array<string_t> */ results = [];

    const /* string_t */ file_data_a = await Read_File(path.resolve(file_path_a));
    const /* string_t */ file_data_b = await Read_File(path.resolve(file_path_b));

    const /* Array<string_t> */ file_lines_a = file_data_a.split(/\r?\n/);
    const /* Array<string_t> */ file_lines_b = file_data_b.split(/\r?\n/);

    let /* Array<string_t> */ rows_a;
    let /* Array<string_t> */ rows_b;
    if (file_lines_a.length > file_lines_b.length) {
        rows_a = file_lines_a;
        rows_b = file_lines_b;
    } else {
        rows_a = file_lines_b;
        rows_b = file_lines_a;
    }

    for (let row = 0, end = rows_a.length; row < end; row += 1) {
        if (row >= rows_b.length) {
            results.push(`Row: ${row + 1}, Column: --`);
        } else {
            let /* string_t */ columns_a;
            let /* string_t */ columns_b;
            if (rows_a[row] > rows_b[row]) {
                columns_a = rows_a[row];
                columns_b = rows_b[row];
            } else {
                columns_a = rows_b[row];
                columns_b = rows_a[row];
            }
            for (let column = 0, end = columns_a.length; column < end; column += 1) {
                if (
                    column >= columns_b.length ||
                    columns_a[column] !== columns_b[column]
                ) {
                    const COLUMNS_A_FRONT_COUNT = 24;
                    const columns_a_front = columns_a.length > COLUMNS_A_FRONT_COUNT ?
                        `${columns_a.slice(0, COLUMNS_A_FRONT_COUNT)}...` :
                        columns_a.slice(0, COLUMNS_A_FRONT_COUNT);

                    results.push(`Row: ${row + 1}, Column: ${column + 1}, Front: ${columns_a_front}`);

                    break;
                }
            }
        }
    }

    return results;
}

(async function Main()
{
    const args = process.argv.slice(2);

    if (args.includes(`-h`) || args.includes(`--help`) || args.length < 1) {
        console.log(help_message);
    } else {
        const tag = args[0];
        const regex = new RegExp(`${tag}(\\..+)$`);

        const messages = [];
        let message_indent = 0;

        const files = await Read_Directory(path.resolve(`.`));
        for (const file of files) {
            if (regex.test(file.name)) {
                const untagged_file_name = file.name.replace(regex, `$1`);
                const results = await Compare(`./${file.name}`, `./${untagged_file_name}`);
                if (results.length === 0) {
                    messages.push(
                        {
                            name: untagged_file_name,
                            mismatches: null,
                        },
                    );
                } else {
                    messages.push(
                        {
                            name: untagged_file_name,
                            mismatches: results,
                        },
                    );
                }
                if (untagged_file_name.length > message_indent) {
                    message_indent = untagged_file_name.length;
                }
            }
        }

        for (const message of messages) {
            let spaces = ``;
            for (let idx = 0, end = message_indent - message.name.length; idx < end; idx += 1) {
                spaces += ` `;
            }

            const name = message.name + spaces;
            const mismatches = message.mismatches;

            if (message.mismatches == null) {
                console.log(`${name} - Perfect Match!`);
            } else {
                for (let idx = 0, end = message.name.length; idx < end; idx += 1) {
                    spaces += ` `;
                }

                console.log(`${name} - Mismatch:`);
                for (
                    let idx = 0, end = mismatches.length > 50 ? 50 : mismatches.length;
                    idx < end;
                    idx += 1
                ) {
                    console.log(spaces + `   ` + mismatches[idx]);
                }
                if (mismatches.length > 50) {
                    console.log(spaces + ` + ${mismatches.length - 50} more lines...`)
                }
            }
        }
    }
})();
