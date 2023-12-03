import { Count } from "../../types.js";

export const COUNT = `0`;
export const VERSION_COUNT = COUNT;
export const FILE_COUNT = COUNT;

export const LINES = `a`;
export const MIN_LINE_COUNT = `b`;
export const MAX_LINE_COUNT = `c`;
export const AVG_LINE_COUNT = `d`;

export const COLUMNS = `e`;
export const MIN_COLUMN_COUNT = `f`;
export const MAX_COLUMN_COUNT = `g`;
export const AVG_COLUMN_COUNT = `h`;

export const MACRO_ROWS = `i`;
export const MICRO_ROWS = `j`;
export const MIN_ROW_COUNT = `k`;
export const MAX_ROW_COUNT = `l`;
export const AVG_ROW_COUNT = `m`;

export const SEGMENTS = `n`;
export const MIN_SEGMENT_COUNT = `o`;
export const MAX_SEGMENT_COUNT = `p`;
export const AVG_SEGMENT_COUNT = `q`;

export const MIN_ITEM_COUNT = `r`;
export const MAX_ITEM_COUNT = `s`;
export const AVG_ITEM_COUNT = `t`;

export type Buffer = {
    [MIN_LINE_COUNT]: Count,
    [MAX_LINE_COUNT]: Count,
    [AVG_LINE_COUNT]: Count,
    [COUNT]: Count,
    [LINES]: [Line],
}

export type Line = {
    [MIN_COLUMN_COUNT]: Count,
    [MAX_COLUMN_COUNT]: Count,
    [AVG_COLUMN_COUNT]: Count,
    [COUNT]: Count,
    [COLUMNS]: [Column],
}

export type Column = {
    [MIN_ROW_COUNT]: Count,
    [MAX_ROW_COUNT]: Count,
    [AVG_ROW_COUNT]: Count,
    [COUNT]: Count,
    [MACRO_ROWS]: [Row],
    [MICRO_ROWS]: [Row],
}

export type Row = {
    [MIN_SEGMENT_COUNT]: Count,
    [MAX_SEGMENT_COUNT]: Count,
    [AVG_SEGMENT_COUNT]: Count,
    [COUNT]: Count,
    [SEGMENTS]: [Segment],
}

export type Segment = {
    [MIN_ITEM_COUNT]: Count,
    [MAX_ITEM_COUNT]: Count,
    [AVG_ITEM_COUNT]: Count,
    [COUNT]: Count,
}
