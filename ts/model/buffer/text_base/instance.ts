import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Language from "../../language.js";
import * as Languages from "../../languages.js";
import * as Font from "../../font.js";
import * as Text from "../../text.js";

import { Default_Min_Counts } from "./default_min_counts.js";

type Working_Table_Cache = {
    first_line_index: Index;
    max_column_lengths: Array<Count>;
}

type Table_Cache = {
    first_line_index: Index;
    last_line_index: Index;
    column_percents: Array<Count>;
}

interface Line_Instance_i
{
    Index():
        Index;
    Text():
        Text.Line.Instance;
}

export abstract class Instance<
    Line_Instance extends Line_Instance_i,
> extends Entity.Instance
{
    private default_language_name: Language.Name;
    private default_font_name: Font.Name;

    private lines: Array<Line_Instance>;

    private table_caches: Array<Table_Cache>;
    private working_table_cache: Working_Table_Cache | null;

    constructor(
        {
            default_language_name,
            default_font_name,
        }: {
            default_language_name: Language.Name,
            default_font_name: Font.Name,
        },
    )
    {
        super();

        this.default_language_name = default_language_name;
        this.default_font_name = default_font_name;

        this.lines = [];

        this.table_caches = [];
        this.working_table_cache = null;
    }

    Default_Language_Name():
        Language.Name
    {
        return this.default_language_name;
    }

    Default_Language_Direction():
        Language.Direction
    {
        return Languages.Singleton().Direction(this.Default_Language_Name());
    }

    Default_Font_Name():
        Font.Name
    {
        return this.default_font_name;
    }

    abstract Override_Font_Name(
        language_name: Language.Name,
    ): Font.Name;

    Min_Line_Count():
        Count
    {
        return Default_Min_Counts.LINE;
    }

    Line_Count():
        Count
    {
        return this.lines.length;
    }

    abstract Blank_Line():
        Line_Instance;

    Line_At(
        line_index: Index,
    ):
        Line_Instance
    {
        Utils.Assert(
            line_index > -1,
            `line_index (${line_index}) must be greater than -1.`,
        );

        if (line_index < this.Line_Count()) {
            return this.lines[line_index];
        } else {
            return this.Blank_Line();
        }
    }

    Line_Column_Percents(
        line_index: Index,
    ):
        Array<Count>
    {
        for (let idx = 0, end = this.table_caches.length; idx < end; idx += 1) {
            const table_cache: Table_Cache = this.table_caches[idx];
            if (
                line_index >= table_cache.first_line_index &&
                line_index <= table_cache.last_line_index
            ) {
                return table_cache.column_percents;
            }
        }

        Utils.Assert(
            false,
            `doesn't not have column_percents for line_index: ${line_index}.`,
        );

        return [];
    }

    protected Push_Line(
        line: Line_Instance,
    ):
        void
    {
        this.lines.push(line);

        const text: Text.Line.Instance = line.Text();
        const index: Index = line.Index();

        if (text.Is_First_Row_Of_Table()) {
            Utils.Assert(
                this.working_table_cache == null,
                `working_table_cache should be null`,
            );

            this.working_table_cache = {
                first_line_index: index,
                max_column_lengths: [],
            };
            for (
                let column_idx = 0, column_end = text.Column_Count();
                column_idx < column_end;
                column_idx += 1
            ) {
                const column: Text.Column.Instance = text.Column(column_idx);
                this.working_table_cache.max_column_lengths.push(0);
            }
        }

        if (text.Is_Row_Of_Table()) {
            Utils.Assert(
                this.working_table_cache != null,
                `working_table_cache should not be null`,
            );

            const working_table_cache: Working_Table_Cache =
                this.working_table_cache as Working_Table_Cache;

            for (
                let column_idx = 0, column_end = text.Column_Count();
                column_idx < column_end;
                column_idx += 1
            ) {
                const column: Text.Column.Instance = text.Column(column_idx);
                for (
                    let row_idx = 0, row_end = column.Row_Count();
                    row_idx < row_end;
                    row_idx += 1
                ) {
                    const row: Text.Row.Instance = column.Row(row_idx);
                    const value: Text.Value = row.Value();
                    if (working_table_cache.max_column_lengths[column_idx] < value.length) {
                        working_table_cache.max_column_lengths[column_idx] = value.length;
                    }
                }
            }
            if (text.Text().Line_Count() - 1 === index) {
                this.Push_Working_Table_Cache(index);
            }
        } else {
            if (this.working_table_cache != null) {
                this.Push_Working_Table_Cache(index);
            }
        }
    }

    private Push_Working_Table_Cache(
        last_line_index: Index,
    ):
        void
    {
        Utils.Assert(
            this.working_table_cache != null,
            `working_table_cache should not be null`,
        );

        const working_table_cache: Working_Table_Cache =
            this.working_table_cache as Working_Table_Cache;
        const table_cache: Table_Cache = {
            first_line_index: working_table_cache.first_line_index,
            last_line_index: last_line_index,
            column_percents: [],
        };

        let total_length: Count = 0;
        for (
            let idx = 0, end = working_table_cache.max_column_lengths.length;
            idx < end;
            idx += 1
        ) {
            total_length += working_table_cache.max_column_lengths[idx];
        }
        for (
            let idx = 0, end = working_table_cache.max_column_lengths.length;
            idx < end;
            idx += 1
        ) {
            table_cache.column_percents.push(
                working_table_cache.max_column_lengths[idx] * 100 / total_length,
            );
        }

        Object.freeze(table_cache.column_percents);
        Object.freeze(table_cache);

        this.table_caches.push(table_cache);
        this.working_table_cache = null;
    }
}
