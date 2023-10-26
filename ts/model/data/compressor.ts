import { Index } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Unicode from "../../unicode.js";

import * as Text from "../text.js";

const LINE_PATH_TYPE: Text.Line.Path_Type =
    Text.Line.Path_Type.DEFAULT;

export enum Symbol
{
    NEWLINE,

    VERBATIM_OPEN,
    VERBATIM_CLOSE,

    _COUNT_,
}

export class Instance
{
    private indices: { [index: string]: Index };
    private values: { [index: Index]: string };

    constructor(
        {
            unique_parts,
        }: {
            unique_parts: Array<string>,
        },
    )
    {
        Utils.Assert(
            unique_parts.length <= Number.MAX_SAFE_INTEGER - Symbol._COUNT_,
            `There are too may unique parts in the index to compress.`,
        );

        this.indices = {};
        this.values = {};
        for (let idx = 0, end = unique_parts.length; idx < end; idx += 1) {
            const compressor_index: Index = idx + Symbol._COUNT_;
            this.indices[unique_parts[idx]] = compressor_index;
            this.values[compressor_index] = unique_parts[idx];
        }
    }

    Compress_Dictionary(
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
        const escape: string = `\\`;

        let compressed_parts: string = ``;
        let is_in_quote: boolean = false;
        let is_in_sequence: boolean = false;
        let part_start_index: Index = 0;

        for (let idx = 0, end = dictionary_value.length; idx < end; idx += 1) {
            const value: string = dictionary_value[idx];

            Utils.Assert(
                value !== zero &&
                value !== one,
                `Cannot compress a dictionary that contains a code point of 0 or 1.`,
            );

            if (is_in_quote) {
                if (
                    value === escape &&
                    idx + 1 < end &&
                    dictionary_value[idx + 1] === quote
                ) {
                    idx += 1;
                } else if (value === quote) {
                    const part: string = dictionary_value.slice(part_start_index, idx);
                    if (this.indices.hasOwnProperty(part)) {
                        if (
                            idx + 1 < end &&
                            dictionary_value[idx + 1] === comma
                        ) {
                            if (!is_in_sequence) {
                                compressed_parts += zero;
                                is_in_sequence = true;
                            }
                            compressed_parts += String.fromCodePoint(this.indices[part]);
                            idx += 1;
                        } else {
                            if (is_in_sequence) {
                                compressed_parts += zero;
                                is_in_sequence = false;
                            }
                            compressed_parts += one;
                            compressed_parts += String.fromCodePoint(this.indices[part]);
                        }
                    } else {
                        if (is_in_sequence) {
                            compressed_parts += zero;
                            is_in_sequence = false;
                        }
                        compressed_parts += quote;
                        compressed_parts += part;
                        compressed_parts += quote;
                    }

                    is_in_quote = false;
                    part_start_index = 0;
                }
            } else {
                if (value === quote) {
                    is_in_quote = true;
                    part_start_index = idx + 1;
                } else {
                    if (is_in_sequence) {
                        compressed_parts += zero;
                        is_in_sequence = false;
                    }
                    compressed_parts += value;
                }
            }
        }

        return compressed_parts;
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

    Compress_File(
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
        const compressed_parts: Array<string> = [];
        const newline: string = String.fromCodePoint(Symbol.NEWLINE);
        const verbatim_open: string = String.fromCodePoint(Symbol.VERBATIM_OPEN);
        const verbatim_close: string = String.fromCodePoint(Symbol.VERBATIM_CLOSE);

        const text: Text.Instance = new Text.Instance(
            {
                dictionary: dictionary,
                value: file_value,
            },
        );
        for (
            let line_idx = 0, line_end = text.Line_Count();
            line_idx < line_end;
            line_idx += 1
        ) {
            const line: Text.Line.Instance = text.Line(line_idx);
            let previous_part_is_word: boolean = false;
            for (
                let part_idx = 0, part_end = line.Macro_Part_Count(LINE_PATH_TYPE);
                part_idx < part_end;
                part_idx += 1
            ) {
                const part: Text.Part.Instance = line.Macro_Part(part_idx, LINE_PATH_TYPE);
                const value: Text.Value = part.Value();
                if (this.indices.hasOwnProperty(value)) {
                    const index: string = String.fromCodePoint(this.indices[value]);
                    if (part.Is_Word()) {
                        compressed_parts.push(index);
                        previous_part_is_word = true;
                    } else {
                        if (
                            !(
                                value === ` ` &&
                                previous_part_is_word &&
                                part_idx + 1 < part_end &&
                                line.Macro_Part(part_idx + 1, LINE_PATH_TYPE).Is_Word()
                            )
                        ) {
                            compressed_parts.push(index);
                        }
                        previous_part_is_word = false;
                    }
                } else {
                    if (compressed_parts[compressed_parts.length - 1] === verbatim_close) {
                        compressed_parts.pop();
                    } else {
                        compressed_parts.push(verbatim_open);
                    }
                    compressed_parts.push(value);
                    compressed_parts.push(verbatim_close);
                    previous_part_is_word = false;
                }
            }
            if (line_idx < line_end - 1) {
                compressed_parts.push(newline);
            }
        }

        return compressed_parts.join(``);
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
            if (it.Point().codePointAt(0) === Symbol.VERBATIM_OPEN) {
                const start: Unicode.Iterator = it.Next();
                it = start;
                while (it.Point().codePointAt(0) !== Symbol.VERBATIM_CLOSE) {
                    it = it.Next();
                }
                uncompressed_parts.push(start.Points().slice(0, it.Index() - start.Index()));
                previous_part_is_word = false;
            } else if (it.Point().codePointAt(0) === Symbol.NEWLINE) {
                uncompressed_parts.push(`\n`);
                previous_part_is_word = false;
            } else {
                const value: string = this.values[it.Point().codePointAt(0) as Index];
                if (
                    dictionary.Has_Word(value) ||
                    dictionary.Has_Word_Error(value)
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
