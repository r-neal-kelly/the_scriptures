/*
    Copyright 2023 r-neal-kelly
*/

`use strict`;

import * as File_System from "./file_system.mjs";

const help_message = `
Info:
    Makes a copy of each text file (.txt) in a directory, for the compare tool.
    Does not overwrite existing copies of texts, only adds those that are missing.

Parameter #1:
    "-h" or "--help" or (none):
        Displays this message in the terminal.

    a tag, such as " COPY"
        Indicates the end that should be added to each original text name.
        Does not make a copy of a file that already ends with the tag.
        E.G. With a supplied tag of "TAG", "fileTAG.txt" would be made as a copy of "file.txt"
`;

(async function Main()
{
    const args = process.argv.slice(2);

    if (args.includes(`-h`) || args.includes(`--help`) || args.length < 1) {
        console.log(help_message);
    } else {
        const tag = args[0];
        const text_regex = new RegExp(`\\.txt$`);
        const tagged_text_regex = new RegExp(`${tag}\\.txt$`);
        const entities = await File_System.Read_Folder(`./`);
        for (const entity of entities) {
            if (
                entity.isFile() &&
                text_regex.test(entity.name) &&
                !tagged_text_regex.test(entity.name)
            ) {
                const file_name = entity.name;
                const file_title = file_name.replace(text_regex, ``);
                const copy_name = `${file_title}${tag}.txt`;
                if (!File_System.Has_File(`./${copy_name}`)) {
                    const file_text = await File_System.Read_File(`./${file_name}`);
                    await File_System.Write_File(`./${copy_name}`, file_text);
                }
            }
        }
    }
})();
