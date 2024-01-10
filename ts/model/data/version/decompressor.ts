import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";
import * as Unicode from "../../../unicode.js";

import * as Text from "../../text.js";

import { Compressed_Symbol } from "./compressed_symbol.js";

// Are we handling surrogates being used as indices messing up the unicode string?
// Or does that matter in this code?

export class Instance
{
    private values: { [index: Index]: string };

    constructor(
        {
            unique_parts = [],
        }: {
            unique_parts?: Array<string>,
        } = {},
    )
    {
        Utils.Assert(
            unique_parts.length <= 0x110000 - Compressed_Symbol._COUNT_,
            `There are too may unique parts in the index to compress.`,
        );

        this.values = {};
        for (let idx = 0, end = unique_parts.length; idx < end; idx += 1) {
            const compressor_index: Index = idx + Compressed_Symbol._COUNT_;
            this.values[compressor_index] = unique_parts[idx];
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
        const zero: string = String.fromCodePoint(0);
        const one: string = String.fromCodePoint(1);
        const quote: string = `"`;
        const comma: string = `,`;

        let decompressed_parts: string = ``;
        let it: Unicode.Iterator = new Unicode.Iterator(
            {
                text: dictionary_value,
            },
        );
        let is_in_sequence: boolean = false;

        for (; !it.Is_At_End(); it = it.Next()) {
            if (is_in_sequence) {
                if (it.Point() === zero) {
                    is_in_sequence = false;
                } else {
                    decompressed_parts += quote;
                    decompressed_parts += this.values[it.Point().codePointAt(0) as Index];
                    decompressed_parts += quote;
                    decompressed_parts += comma;
                }
            } else {
                if (it.Point() === zero) {
                    is_in_sequence = true;
                } else if (it.Point() === one) {
                    it = it.Next();
                    decompressed_parts += quote;
                    decompressed_parts += this.values[it.Point().codePointAt(0) as Index];
                    decompressed_parts += quote;
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
                const value: string = this.values[it.Point().codePointAt(0) as Index];
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
