import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Language from "../language.js";

import * as Dictionary from "./dictionary.js";
import { Value } from "./value.js";
import * as Line from "./line.js";
import * as Path from "./path.js";
import * as Column from "./column.js";
import * as Row from "./row.js";

type Working_Table_Cache = {
    first_line_index: Index;
    max_column_lengths: Array<Count>;
}

type Table_Cache = {
    first_line_index: Index;
    last_line_index: Index;
    column_percents: Array<Count>;
}

export class Instance
{
    private dictionary: Dictionary.Instance;
    private value: Value;
    private lines: Array<Line.Instance>;
    private path_type: Path.Type;

    private has_evaluated_tables: boolean;
    private table_caches: Array<Table_Cache>;
    private working_table_cache: Working_Table_Cache | null;

    constructor(
        {
            dictionary,
            value,
            path_type = Path.Type.DEFAULT,
        }: {
            dictionary: Dictionary.Instance,
            value: Value,
            path_type?: Path.Type,
        } =
            {
                dictionary: new Dictionary.Instance(),
                value: ``,
            },
    )
    {
        this.dictionary = dictionary;
        this.value = value;
        this.lines = [];
        this.path_type = path_type;

        this.has_evaluated_tables = false;
        this.table_caches = [];
        this.working_table_cache = null;

        const line_values: Array<string> = value.split(/\r?\n/g);
        for (let idx = 0, end = line_values.length; idx < end; idx += 1) {
            this.lines.push(
                new Line.Instance(
                    {
                        text: this,
                        index: idx,
                        value: line_values[idx],
                    },
                ),
            );
        }
    }

    Dictionary():
        Dictionary.Instance
    {
        return this.dictionary;
    }

    Value():
        Value
    {
        return this.value;
    }

    Line_Count():
        Count
    {
        return this.lines.length;
    }

    Lines():
        Array<Line.Instance>
    {
        return Array.from(this.lines);
    }

    Has_Line(
        line: Line.Instance,
    ):
        boolean
    {
        return this.lines.indexOf(line) > -1;
    }

    Has_Line_Index(
        line_index: Index,
    ):
        boolean
    {
        return (
            line_index > -1 &&
            line_index < this.Line_Count()
        );
    }

    Line(
        line_index: Index,
    ):
        Line.Instance
    {
        Utils.Assert(
            this.Has_Line_Index(line_index),
            `Text does not have line at the index.`,
        );

        return this.lines[line_index];
    }

    Line_Column_Percents(
        line_index: Index,
    ):
        Array<Count>
    {
        if (!this.has_evaluated_tables) {
            this.Evaluate_Tables();
        }

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

    // We need to be able to add, insert, remove, and set lines,
    // certainly for the sake of the editor, but the perhaps for the browser too.
    // We'll need to re-evaluate tables when adding a line. just set the flag to false

    Path_Type():
        Path.Type
    {
        return this.path_type;
    }

    Set_Path_Type(
        path_type: Path.Type,
    ):
        void
    {
        this.path_type = path_type;
    }

    Default_Language_Name():
        Language.Name | null
    {
        return this.Dictionary().Default_Language_Name();
    }

    private Evaluate_Tables():
        void
    {
        function Push_Working_Table_Cache(
            this: Instance,
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

        this.has_evaluated_tables = false;
        this.table_caches = [];
        this.working_table_cache = null;

        for (
            let line_idx = 0, line_end = this.Line_Count();
            line_idx < line_end;
            line_idx += 1
        ) {
            const line = this.Line(line_idx);

            if (line.Is_First_Row_Of_Table()) {
                Utils.Assert(
                    this.working_table_cache == null,
                    `working_table_cache should be null`,
                );

                this.working_table_cache = {
                    first_line_index: line_idx,
                    max_column_lengths: [],
                };
                for (
                    let column_idx = 0, column_end = line.Column_Count();
                    column_idx < column_end;
                    column_idx += 1
                ) {
                    const column: Column.Instance = line.Column(column_idx);
                    this.working_table_cache.max_column_lengths.push(0);
                }
            }

            if (line.Is_Row_Of_Table()) {
                Utils.Assert(
                    this.working_table_cache != null,
                    `working_table_cache should not be null`,
                );

                const working_table_cache: Working_Table_Cache =
                    this.working_table_cache as Working_Table_Cache;

                for (
                    let column_idx = 0, column_end = line.Column_Count();
                    column_idx < column_end;
                    column_idx += 1
                ) {
                    const column: Column.Instance = line.Column(column_idx);
                    for (
                        let row_idx = 0, row_end = column.Row_Count();
                        row_idx < row_end;
                        row_idx += 1
                    ) {
                        const row: Row.Instance = column.Row(row_idx);
                        const value: Value = row.Value();
                        if (working_table_cache.max_column_lengths[column_idx] < value.length) {
                            working_table_cache.max_column_lengths[column_idx] = value.length;
                        }
                    }
                }
                if (line.Text().Line_Count() - 1 === line_idx) {
                    Push_Working_Table_Cache.bind(this)(line_idx);
                }
            } else {
                if (this.working_table_cache != null) {
                    Push_Working_Table_Cache.bind(this)(line_idx);
                }
            }
        }

        this.has_evaluated_tables = true;
    }
}
