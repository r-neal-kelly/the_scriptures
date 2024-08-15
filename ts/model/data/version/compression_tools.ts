import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";
import * as Unicode from "../../../unicode.js";

import { Compressed_Symbol } from "./compressed_symbol.js";

export const MAX_UNIQUE_PART_COUNT: Count =
    Unicode.POINT_COUNT - Unicode.SURROGATE_POINT_COUNT - Compressed_Symbol._COUNT_;

export function Compressed_Index(
    unique_part_index: Index,
):
    Index
{
    Utils.Assert(
        unique_part_index >= 0,
        `Invalid unique_part_index.`,
    );
    Utils.Assert(
        unique_part_index < MAX_UNIQUE_PART_COUNT,
        `Invalid unique_part_index.`,
    );

    unique_part_index += Compressed_Symbol._COUNT_;

    if (unique_part_index >= Unicode.LEADING_SURROGATE.FIRST) {
        unique_part_index += Unicode.SURROGATE_POINT_COUNT;
    }

    return unique_part_index;
}
