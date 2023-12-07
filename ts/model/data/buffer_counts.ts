import { Count } from "../../types.js";

// The Full set is used on version infos which must save the file count.
export const FULL_FILE_COUNT = `0`;
export const FULL_AVG_LINE_COUNT = `a`;
export const FULL_AVG_COLUMN_COUNT = `b`;
export const FULL_AVG_ROW_COUNT = `c`;
export const FULL_AVG_SEGMENT_COUNT = `d`;
export const FULL_AVG_ITEM_COUNT = `e`;

export const FULL_LINES = `A`;
export const FULL_COLUMNS = `B`;
export const FULL_MACRO_ROWS = `C`;
export const FULL_MICRO_ROWS = `D`;
export const FULL_SEGMENTS = `E`;

export type Full_Buffer = {
    [FULL_FILE_COUNT]: Count,
    [FULL_AVG_LINE_COUNT]: Count,
    [FULL_LINES]: [Full_Line],
};

export type Full_Line = {
    [FULL_FILE_COUNT]: Count,
    [FULL_AVG_COLUMN_COUNT]: Count,
    [FULL_COLUMNS]: [Full_Column],
};

export type Full_Column = {
    [FULL_FILE_COUNT]: Count,
    [FULL_AVG_ROW_COUNT]: Count,
    [FULL_MACRO_ROWS]: [Full_Row],
    [FULL_MICRO_ROWS]: [Full_Row],
};

export type Full_Row = {
    [FULL_FILE_COUNT]: Count,
    [FULL_AVG_SEGMENT_COUNT]: Count,
    [FULL_SEGMENTS]: [Full_Segment],
};

export type Full_Segment = {
    [FULL_FILE_COUNT]: Count,
    [FULL_AVG_ITEM_COUNT]: Count,
};

// The Compact set is used on the main info which doesn't need the file count.
export const COMPACT_AVG_LINE_COUNT = 0;
export const COMPACT_AVG_COLUMN_COUNT = 0;
export const COMPACT_AVG_ROW_COUNT = 0;
export const COMPACT_AVG_SEGMENT_COUNT = 0;

export const COMPACT_LINES = 1;
export const COMPACT_COLUMNS = 1;
export const COMPACT_MACRO_ROWS = 1;
export const COMPACT_MICRO_ROWS = 2;
export const COMPACT_SEGMENTS = 1;

export type Compact_Buffer = [
    Count, // COMPACT_AVG_LINE_COUNT
    [Compact_Line],
];

export type Compact_Line = [
    Count, // COMPACT_AVG_COLUMN_COUNT
    [Compact_Column],
];

export type Compact_Column = [
    Count, // COMPACT_AVG_ROW_COUNT
    [Compact_Row],
    [Compact_Row],
];

export type Compact_Row = [
    Count, // COMPACT_AVG_SEGMENT_COUNT
    [Compact_Segment],
];

export type Compact_Segment = Count; // COMPACT_AVG_ITEM_COUNT

// The Partial set is used on the main info temporarily to calculate average counts.
export const PARTIAL_FILE_COUNT = 0;

export const PARTIAL_LINES = 1;
export const PARTIAL_COLUMNS = 1;
export const PARTIAL_MACRO_ROWS = 1;
export const PARTIAL_MICRO_ROWS = 2;
export const PARTIAL_SEGMENTS = 1;

export type Partial_Buffer = [
    Count, // PARTIAL_FILE_COUNT
    [Partial_Line],
];

export type Partial_Line = [
    Count, // PARTIAL_FILE_COUNT
    [Partial_Column],
];

export type Partial_Column = [
    Count, // PARTIAL_FILE_COUNT
    [Partial_Row],
    [Partial_Row],
];

export type Partial_Row = [
    Count, // PARTIAL_FILE_COUNT
    [Partial_Segment],
];

export type Partial_Segment = Count; // PARTIAL_FILE_COUNT
