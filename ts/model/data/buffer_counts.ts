import { Count } from "../../types.js";

export const FILE_COUNT = `0`;

export const LINES = `a`;
export const MAX_LINE_COUNT = `b`;
export const AVG_LINE_COUNT = `c`;

export const COLUMNS = `d`;
export const MAX_COLUMN_COUNT = `e`;
export const AVG_COLUMN_COUNT = `f`;

export const MACRO_ROWS = `f`;
export const MICRO_ROWS = `g`;
export const MAX_ROW_COUNT = `h`;
export const AVG_ROW_COUNT = `i`;

export const SEGMENTS = `j`;
export const MAX_SEGMENT_COUNT = `k`;
export const AVG_SEGMENT_COUNT = `l`;

export const MAX_ITEM_COUNT = `m`;
export const AVG_ITEM_COUNT = `n`;

// The Full set is used on version infos which must save the file count.
export type Full_Buffer = {
    [MAX_LINE_COUNT]: Count,
    [AVG_LINE_COUNT]: Count,
    [FILE_COUNT]: Count,
    [LINES]: [Full_Line],
}

export type Full_Line = {
    [MAX_COLUMN_COUNT]: Count,
    [AVG_COLUMN_COUNT]: Count,
    [FILE_COUNT]: Count,
    [COLUMNS]: [Full_Column],
}

export type Full_Column = {
    [MAX_ROW_COUNT]: Count,
    [AVG_ROW_COUNT]: Count,
    [FILE_COUNT]: Count,
    [MACRO_ROWS]: [Full_Row],
    [MICRO_ROWS]: [Full_Row],
}

export type Full_Row = {
    [MAX_SEGMENT_COUNT]: Count,
    [AVG_SEGMENT_COUNT]: Count,
    [FILE_COUNT]: Count,
    [SEGMENTS]: [Full_Segment],
}

export type Full_Segment = {
    [MAX_ITEM_COUNT]: Count,
    [AVG_ITEM_COUNT]: Count,
    [FILE_COUNT]: Count,
}

// The Compact set is used on the main info which doesn't need the file count.
export type Compact_Buffer = {
    [MAX_LINE_COUNT]: Count,
    [AVG_LINE_COUNT]: Count,
    [LINES]: [Compact_Line],
}

export type Compact_Line = {
    [MAX_COLUMN_COUNT]: Count,
    [AVG_COLUMN_COUNT]: Count,
    [COLUMNS]: [Compact_Column],
}

export type Compact_Column = {
    [MAX_ROW_COUNT]: Count,
    [AVG_ROW_COUNT]: Count,
    [MACRO_ROWS]: [Compact_Row],
    [MICRO_ROWS]: [Compact_Row],
}

export type Compact_Row = {
    [MAX_SEGMENT_COUNT]: Count,
    [AVG_SEGMENT_COUNT]: Count,
    [SEGMENTS]: [Compact_Segment],
}

export type Compact_Segment = {
    [MAX_ITEM_COUNT]: Count,
    [AVG_ITEM_COUNT]: Count,
}

// The Partial set is used on the main info temporarily to calculate average counts.
export type Partial_Buffer = {
    [FILE_COUNT]: Count,
    [LINES]: [Partial_Line],
}

export type Partial_Line = {
    [FILE_COUNT]: Count,
    [COLUMNS]: [Partial_Column],
}

export type Partial_Column = {
    [FILE_COUNT]: Count,
    [MACRO_ROWS]: [Partial_Row],
    [MICRO_ROWS]: [Partial_Row],
}

export type Partial_Row = {
    [FILE_COUNT]: Count,
    [SEGMENTS]: [Partial_Segment],
}

export type Partial_Segment = {
    [FILE_COUNT]: Count,
}
