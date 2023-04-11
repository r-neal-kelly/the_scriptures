import { Index } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Unicode from "../../unicode.js";

import * as Text from "../text.js";

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
            `There are too may unique_parts to compress.`,
        );

        this.indices = {};
        this.values = {};
        for (let idx = 0, end = unique_parts.length; idx < end; idx += 1) {
            const compressor_index: Index = idx + Symbol._COUNT_;
            this.indices[unique_parts[idx]] = compressor_index;
            this.values[compressor_index] = unique_parts[idx];
        }
    }

    Compress(
        text: Text.Instance,
    ):
        string
    {
        const compressed_parts: Array<string> = [];

        for (
            let line_idx = 0, line_end = text.Line_Count();
            line_idx < line_end;
            line_idx += 1
        ) {
            const line: Text.Line.Instance = text.Line(line_idx);
            for (
                let part_idx = 0, part_end = line.Macro_Part_Count();
                part_idx < part_end;
                part_idx += 1
            ) {
                const part: Text.Part.Instance = line.Macro_Part(part_idx);
                const value: Text.Value = part.Value();
                if (this.indices.hasOwnProperty(value)) {
                    compressed_parts.push(String.fromCodePoint(this.indices[value]));
                } else {
                    compressed_parts.push(String.fromCodePoint(Symbol.VERBATIM_OPEN));
                    compressed_parts.push(value);
                    compressed_parts.push(String.fromCodePoint(Symbol.VERBATIM_CLOSE));
                }
            }
            if (line_idx < line_end - 1) {
                compressed_parts.push(String.fromCodePoint(Symbol.NEWLINE));
            }
        }

        return compressed_parts.join(``);
    }

    Decompress(
        text: string,
    ):
        string
    {
        const uncompressed_parts: Array<string> = [];

        let it: Unicode.Iterator = new Unicode.Iterator(
            {
                text: text,
            },
        );
        for (; !it.Is_At_End(); it = it.Next()) {
            if (it.Point().codePointAt(0) === Symbol.VERBATIM_OPEN) {
                const start: Unicode.Iterator = it.Next();
                it = start;
                while (it.Point().codePointAt(0) !== Symbol.VERBATIM_CLOSE) {
                    it = it.Next();
                }
                uncompressed_parts.push(start.Points().slice(0, it.Index() - start.Index()));
            } else if (it.Point().codePointAt(0) === Symbol.NEWLINE) {
                uncompressed_parts.push(`\n`);
            } else {
                uncompressed_parts.push(this.values[it.Point().codePointAt(0) as Index]);
            }
        }

        return uncompressed_parts.join(``);
    }
}
