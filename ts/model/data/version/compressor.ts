import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

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
const ESCAPE: string =
    `\\`;
const NEWLINE: string =
    String.fromCodePoint(Compressed_Symbol.NEWLINE);
const VERBATIM_CLOSE: string =
    String.fromCodePoint(Compressed_Symbol.VERBATIM_CLOSE);

export class Instance
{
    private values_to_indices: { [value: string]: Index };

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

        this.values_to_indices = {};
        for (let idx = 0, end = unique_parts.length; idx < end; idx += 1) {
            this.values_to_indices[unique_parts[idx]] = Compression_Tools.Compressed_Index(idx);
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
        let compressed_parts: string = ``;
        let is_in_quote: boolean = false;
        let is_in_sequence: boolean = false;
        let part_start_index: Index = 0;

        for (let idx = 0, end = dictionary_value.length; idx < end; idx += 1) {
            const value: string = dictionary_value[idx];

            Utils.Assert(
                value !== ZERO &&
                value !== ONE,
                `Cannot compress a dictionary that contains a code point of 0 or 1.`,
            );

            if (is_in_quote) {
                if (
                    value === ESCAPE &&
                    idx + 1 < end &&
                    dictionary_value[idx + 1] === QUOTE
                ) {
                    idx += 1;
                } else if (value === QUOTE) {
                    const part: string = dictionary_value.slice(part_start_index, idx);
                    if (this.values_to_indices.hasOwnProperty(part)) {
                        if (
                            idx + 1 < end &&
                            dictionary_value[idx + 1] === COMMA
                        ) {
                            if (!is_in_sequence) {
                                compressed_parts += ZERO;
                                is_in_sequence = true;
                            }
                            compressed_parts += String.fromCodePoint(this.values_to_indices[part]);
                            idx += 1;
                        } else {
                            if (is_in_sequence) {
                                compressed_parts += ZERO;
                                is_in_sequence = false;
                            }
                            compressed_parts += ONE;
                            compressed_parts += String.fromCodePoint(this.values_to_indices[part]);
                        }
                    } else {
                        if (is_in_sequence) {
                            compressed_parts += ZERO;
                            is_in_sequence = false;
                        }
                        compressed_parts += QUOTE;
                        compressed_parts += part;
                        compressed_parts += QUOTE;
                    }

                    is_in_quote = false;
                    part_start_index = 0;
                }
            } else {
                if (value === QUOTE) {
                    is_in_quote = true;
                    part_start_index = idx + 1;
                } else {
                    if (is_in_sequence) {
                        compressed_parts += ZERO;
                        is_in_sequence = false;
                    }
                    compressed_parts += value;
                }
            }
        }

        return compressed_parts;
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
            for (
                let column_idx = 0, column_end = line.Column_Count();
                column_idx < column_end;
                column_idx += 1
            ) {
                const column: Text.Column.Instance = line.Column(column_idx);
                for (
                    let row_idx = 0, row_end = column.Row_Count();
                    row_idx < row_end;
                    row_idx += 1
                ) {
                    const row: Text.Row.Instance = column.Row(row_idx);
                    let previous_part_is_word: boolean = false;
                    for (
                        let part_idx = 0, part_end = row.Macro_Part_Count();
                        part_idx < part_end;
                        part_idx += 1
                    ) {
                        const part: Text.Part.Instance = row.Macro_Part(part_idx);
                        const value: Text.Value = part.Value();
                        if (this.values_to_indices.hasOwnProperty(value)) {
                            const index: string = String.fromCodePoint(this.values_to_indices[value]);
                            if (part.Is_Word()) {
                                compressed_parts.push(index);
                                previous_part_is_word = true;
                            } else {
                                if (
                                    !(
                                        value === ` ` &&
                                        previous_part_is_word &&
                                        part_idx + 1 < part_end &&
                                        row.Macro_Part(part_idx + 1).Is_Word()
                                    )
                                ) {
                                    compressed_parts.push(index);
                                }
                                previous_part_is_word = false;
                            }
                        } else {
                            if (compressed_parts[compressed_parts.length - 1] === VERBATIM_CLOSE) {
                                compressed_parts.pop();
                            } else {
                                compressed_parts.push(VERBATIM_CLOSE);
                            }
                            compressed_parts.push(value);
                            compressed_parts.push(VERBATIM_CLOSE);
                            previous_part_is_word = false;
                        }
                    }
                }
            }
            if (line_idx < line_end - 1) {
                compressed_parts.push(NEWLINE);
            }
        }

        return compressed_parts.join(``);
    }
}
