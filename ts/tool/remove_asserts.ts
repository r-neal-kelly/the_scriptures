import { Name } from "../types.js";
import { Path } from "../types.js";

import * as Unicode from "../unicode.js";

import * as File_System from "./file_system.js";

const ASSERT_REGEX = /^Utils\.Assert\(/;

function Remove_Asserts_From_Text(
    file_text: string,
):
    string
{
    let new_file_text: Array<string> = [];

    let iter: Unicode.Iterator = new Unicode.Iterator(
        {
            text: file_text,
        },
    );
    for (; !iter.Is_At_End();) {
        if (ASSERT_REGEX.test(iter.Points() || ``)) {
            let previous_point: string = new_file_text[new_file_text.length - 1];
            if (previous_point === `,`) {
                new_file_text.pop();
            }

            while (iter.Point() !== `(`) {
                iter = iter.Next();
            }
            iter = iter.Next();

            let parenthesis_depth: number = 1;
            let string_delimiter: string | null = null;
            while (parenthesis_depth > 0) {
                const point: string = iter.Point();
                if (string_delimiter != null) {
                    if (
                        point === string_delimiter &&
                        (iter.Look_Backward_Point() || ``) !== `\\`
                    ) {
                        string_delimiter = null;
                    }
                } else {
                    if (point === `\`` || point === `"` || point === `'`) {
                        string_delimiter = point;
                    } else if (point === `(`) {
                        parenthesis_depth += 1;
                    } else if (point === `)`) {
                        parenthesis_depth -= 1;
                    }
                }
                iter = iter.Next();
            }

            const point: string = iter.Point();
            if (previous_point === `)` && point !== `,` && point !== `;`) {
                new_file_text.push(`;`);
            } else if (previous_point === ` ` && point !== `,` && point !== `;`) {
                if (point === `)`) {
                    new_file_text.push(`0`);
                } else {
                    new_file_text.push(`;`);
                }
            } else if (previous_point === `:`) {
                new_file_text.push(`0`);
            } else if (previous_point !== `,` && point === `,`) {
                new_file_text.push(` `);
                iter = iter.Next();
            }
        } else {
            new_file_text.push(iter.Point());
            iter = iter.Next();
        }
    }

    return new_file_text.join(``);
}

async function Remove_Asserts_From_File(
    file_path: Path,
):
    Promise<void>
{
    await File_System.Write_File(
        file_path,
        Remove_Asserts_From_Text(
            await File_System.Read_File(file_path),
        ),
    );
}

async function Remove_Asserts():
    Promise<void>
{
    const file_paths: Array<Name> =
        await File_System.Read_Folder_File_Paths_Recursively(`./js`);

    const promises: Array<Promise<void>> = [];
    for (const file_path of file_paths) {
        promises.push(Remove_Asserts_From_File(file_path));
    }

    await Promise.all(promises);
}

(
    async function Main():
        Promise<void>
    {
        await Remove_Asserts();
    }
)();
