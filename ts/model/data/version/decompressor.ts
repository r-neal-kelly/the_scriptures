import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";
import * as Unicode from "../../../unicode.js";

import * as Text from "../../text.js";

import * as Compression_Tools from "./compression_tools.js";
import { Compressed_Symbol } from "./compressed_symbol.js";

const ZERO: string =
    String.fromCodePoint(0);
const ONE: string =
    String.fromCodePoint(1);
const QUOTE: string =
    `"`;
const COMMA: string =
    `,`;

export class Instance
{
    private indices_to_values: { [index: Index]: string };

    constructor(
        {
            unique_parts = [],
        }: {
            unique_parts?: Array<string>,
        } = {},
    )
    {
        Utils.Assert(
            unique_parts.length <= Compression_Tools.MAX_UNIQUE_PART_COUNT,
            `There are too may unique parts to compress.`,
        );

        this.indices_to_values = {};
        for (let idx = 0, end = unique_parts.length; idx < end; idx += 1) {
            this.indices_to_values[Compression_Tools.Compressed_Index(idx)] = unique_parts[idx];
        }
    }

    Decompress_Dictionary(
        {
            dictionary_value,
        }: {
            dictionary_value: string,
        },
    ):
        string
    {
        let decompressed_parts: string = ``;
        let it: Unicode.Iterator = new Unicode.Iterator(
            {
                text: dictionary_value,
            },
        );
        let is_in_sequence: boolean = false;

        for (; !it.Is_At_End(); it = it.Next()) {
            if (is_in_sequence) {
                if (it.Point() === ZERO) {
                    is_in_sequence = false;
                } else {
                    Utils.Assert(
                        this.indices_to_values.hasOwnProperty(it.Point().codePointAt(0) as Index),
                        `Cannot decompress unknown index! Bad unique_parts.`,
                    );
                    decompressed_parts += QUOTE;
                    decompressed_parts += this.indices_to_values[it.Point().codePointAt(0) as Index];
                    decompressed_parts += QUOTE;
                    decompressed_parts += COMMA;
                }
            } else {
                if (it.Point() === ZERO) {
                    is_in_sequence = true;
                } else if (it.Point() === ONE) {
                    it = it.Next();
                    Utils.Assert(
                        this.indices_to_values.hasOwnProperty(it.Point().codePointAt(0) as Index),
                        `Cannot decompress unknown index! Bad unique_parts.`,
                    );
                    decompressed_parts += QUOTE;
                    decompressed_parts += this.indices_to_values[it.Point().codePointAt(0) as Index];
                    decompressed_parts += QUOTE;
                } else {
                    decompressed_parts += it.Point();
                }
            }
        }

        return decompressed_parts;
    }

    Decompress_File(
        {
            dictionary,
            file_value,
        }: {
            dictionary: Text.Dictionary.Instance,
            file_value: string,
        },
    ):
        string
    {
        const uncompressed_parts: Array<string> = [];

        let it: Unicode.Iterator = new Unicode.Iterator(
            {
                text: file_value,
            },
        );
        let previous_part_is_word: boolean = false;
        for (; !it.Is_At_End(); it = it.Next()) {
            if (it.Point().codePointAt(0) === Compressed_Symbol.VERBATIM_OPEN) {
                const start: Unicode.Iterator = it.Next();
                it = start;
                while (it.Point().codePointAt(0) !== Compressed_Symbol.VERBATIM_CLOSE) {
                    it = it.Next();
                }
                uncompressed_parts.push(start.Points().slice(0, it.Index() - start.Index()));
                previous_part_is_word = false;
            } else if (it.Point().codePointAt(0) === Compressed_Symbol.NEWLINE) {
                uncompressed_parts.push(`\n`);
                previous_part_is_word = false;
            } else {
                Utils.Assert(
                    this.indices_to_values.hasOwnProperty(it.Point().codePointAt(0) as Index),
                    `Cannot decompress unknown index! Bad unique_parts.`,
                );
                const value: string = this.indices_to_values[it.Point().codePointAt(0) as Index];
                if (
                    dictionary.Is_Word(value) ||
                    dictionary.Is_Word_Error(value)
                ) {
                    if (previous_part_is_word) {
                        uncompressed_parts.push(` `);
                    }
                    uncompressed_parts.push(value);
                    previous_part_is_word = true;
                } else {
                    uncompressed_parts.push(value);
                    previous_part_is_word = false;
                }
            }
        }

        return uncompressed_parts.join(``);
    }
}
