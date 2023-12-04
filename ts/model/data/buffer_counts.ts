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

export type Buffer = {
    [MAX_LINE_COUNT]: Count,
    [AVG_LINE_COUNT]: Count,
    [FILE_COUNT]: Count,
    [LINES]: [Line],
}

export type Line = {
    [MAX_COLUMN_COUNT]: Count,
    [AVG_COLUMN_COUNT]: Count,
    [FILE_COUNT]: Count,
    [COLUMNS]: [Column],
}

export type Column = {
    [MAX_ROW_COUNT]: Count,
    [AVG_ROW_COUNT]: Count,
    [FILE_COUNT]: Count,
    [MACRO_ROWS]: [Row],
    [MICRO_ROWS]: [Row],
}

export type Row = {
    [MAX_SEGMENT_COUNT]: Count,
    [AVG_SEGMENT_COUNT]: Count,
    [FILE_COUNT]: Count,
    [SEGMENTS]: [Segment],
}

export type Segment = {
    [MAX_ITEM_COUNT]: Count,
    [AVG_ITEM_COUNT]: Count,
    [FILE_COUNT]: Count,
}
