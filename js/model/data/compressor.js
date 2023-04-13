import * as Utils from "../../utils.js";
import * as Unicode from "../../unicode.js";
import * as Text from "../text.js";
export var Symbol;
(function (Symbol) {
    Symbol[Symbol["NEWLINE"] = 0] = "NEWLINE";
    Symbol[Symbol["VERBATIM_OPEN"] = 1] = "VERBATIM_OPEN";
    Symbol[Symbol["VERBATIM_CLOSE"] = 2] = "VERBATIM_CLOSE";
    Symbol[Symbol["_COUNT_"] = 3] = "_COUNT_";
})(Symbol || (Symbol = {}));
export class Instance {
    constructor({ unique_parts, }) {
        Utils.Assert(unique_parts.length <= Number.MAX_SAFE_INTEGER - Symbol._COUNT_, `There are too may unique_parts to compress.`);
        this.indices = {};
        this.values = {};
        for (let idx = 0, end = unique_parts.length; idx < end; idx += 1) {
            const compressor_index = idx + Symbol._COUNT_;
            this.indices[unique_parts[idx]] = compressor_index;
            this.values[compressor_index] = unique_parts[idx];
        }
    }
    Compress({ value, dictionary, }) {
        const compressed_parts = [];
        const newline = String.fromCodePoint(Symbol.NEWLINE);
        const verbatim_open = String.fromCodePoint(Symbol.VERBATIM_OPEN);
        const verbatim_close = String.fromCodePoint(Symbol.VERBATIM_CLOSE);
        const text = new Text.Instance({
            dictionary: dictionary,
            value: value,
        });
        for (let line_idx = 0, line_end = text.Line_Count(); line_idx < line_end; line_idx += 1) {
            const line = text.Line(line_idx);
            let previous_part_is_word = false;
            for (let part_idx = 0, part_end = line.Macro_Part_Count(); part_idx < part_end; part_idx += 1) {
                const part = line.Macro_Part(part_idx);
                const value = part.Value();
                if (this.indices.hasOwnProperty(value)) {
                    const index = String.fromCodePoint(this.indices[value]);
                    if (part.Is_Word()) {
                        compressed_parts.push(index);
                        previous_part_is_word = true;
                    }
                    else {
                        if (!(value === ` ` &&
                            previous_part_is_word &&
                            part_idx + 1 < part_end &&
                            line.Macro_Part(part_idx + 1).Is_Word())) {
                            compressed_parts.push(index);
                        }
                        previous_part_is_word = false;
                    }
                }
                else {
                    if (compressed_parts[compressed_parts.length - 1] === verbatim_close) {
                        compressed_parts.pop();
                    }
                    else {
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
    Decompress({ value, dictionary, }) {
        const uncompressed_parts = [];
        let it = new Unicode.Iterator({
            text: value,
        });
        let previous_part_is_word = false;
        for (; !it.Is_At_End(); it = it.Next()) {
            if (it.Point().codePointAt(0) === Symbol.VERBATIM_OPEN) {
                const start = it.Next();
                it = start;
                while (it.Point().codePointAt(0) !== Symbol.VERBATIM_CLOSE) {
                    it = it.Next();
                }
                uncompressed_parts.push(start.Points().slice(0, it.Index() - start.Index()));
                previous_part_is_word = false;
            }
            else if (it.Point().codePointAt(0) === Symbol.NEWLINE) {
                uncompressed_parts.push(`\n`);
                previous_part_is_word = false;
            }
            else {
                const value = this.values[it.Point().codePointAt(0)];
                if (dictionary.Has_Word(value) ||
                    dictionary.Has_Word_Error(value)) {
                    if (previous_part_is_word) {
                        uncompressed_parts.push(` `);
                    }
                    uncompressed_parts.push(value);
                    previous_part_is_word = true;
                }
                else {
                    uncompressed_parts.push(value);
                    previous_part_is_word = false;
                }
            }
        }
        return uncompressed_parts.join(``);
    }
    Compress_Dictionary(dictionary_value) {
        const zero = String.fromCodePoint(0);
        const one = String.fromCodePoint(1);
        Utils.Assert(dictionary_value.match(zero) == null &&
            dictionary_value.match(one) == null, `Cannot compress a dictionary that contains a code point of 0 or 1.`);
        for (const value of Object.values(this.values).sort(function (a, b) {
            return b.length - a.length;
        })) {
            if (value.length > 1) {
                dictionary_value = dictionary_value.replace(value, zero + String.fromCodePoint(this.indices[value]));
            }
        }
        dictionary_value = dictionary_value.replace(/","\x00/g, one);
        return dictionary_value;
    }
    Decompress_Dictionary(dictionary_value) {
        const zero = String.fromCodePoint(0);
        const one = String.fromCodePoint(1);
        dictionary_value = dictionary_value.replace(new RegExp(one, `g`), `","\x00`);
        for (const value of Object.values(this.values).sort(function (a, b) {
            return b.length - a.length;
        })) {
            if (value.length > 1) {
                dictionary_value = dictionary_value.replace(zero + String.fromCodePoint(this.indices[value]), value);
            }
        }
        return dictionary_value;
    }
}
