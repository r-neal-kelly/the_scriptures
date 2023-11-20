import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Text from "../../text.js";
import * as Search from "../../search.js";
import * as Buffer from "./instance.js";
import * as Column from "./column.js";

export class Instance extends Entity.Instance
{
    private static min_column_count: Count = 1;

    private static blank_column: Column.Instance = new Column.Instance(
        {
            line: null,
            index: null,
        },
    );

    static Min_Column_Count():
        Count
    {
        return Instance.min_column_count;
    }

    static Set_Min_Column_Count(
        min_column_count: Count,
    ):
        void
    {
        Utils.Assert(
            min_column_count >= 0,
            `min_column_count must be greater than or equal to 0.`,
        );

        Instance.min_column_count = min_column_count;
    }

    private buffer: Buffer.Instance | null;
    private index: Index | null;
    private result: Search.Result.Instance | null;
    private columns: Array<Column.Instance>;

    constructor(
        {
            buffer,
            index,
            result,
        }: {
            buffer: Buffer.Instance | null,
            index: Index | null,
            result: Search.Result.Instance | null,
        },
    )
    {
        super();

        this.buffer = buffer;
        this.index = index;
        this.result = result;
        this.columns = [];

        if (result == null) {
            Utils.Assert(
                buffer == null,
                `buffer must be null.`,
            );
            Utils.Assert(
                index == null,
                `index must be null.`,
            );
        } else {
            Utils.Assert(
                buffer != null,
                `buffer must not be null.`,
            );
            Utils.Assert(
                index != null && index > -1,
                `index must not be null, and must be greater than -1.`,
            );

            for (let idx = 0, end = this.Text().Column_Count(); idx < end; idx += 1) {
                this.columns.push(
                    new Column.Instance(
                        {
                            line: this,
                            index: idx,
                        },
                    ),
                );
            }
        }

        this.Add_Dependencies(
            this.columns,
        );
    }

    Buffer():
        Buffer.Instance
    {
        Utils.Assert(
            this.buffer != null,
            `Doesn't have buffer.`,
        );

        return this.buffer as Buffer.Instance;
    }

    Index():
        Index
    {
        Utils.Assert(
            this.index != null,
            `Doesn't have an index.`,
        );

        return this.index as Index;
    }

    Has_Text():
        boolean
    {
        return this.Has_Result();
    }

    Text():
        Text.Line.Instance
    {
        Utils.Assert(
            this.Has_Text(),
            `Doesn't have text.`,
        );

        return (this.result as Search.Result.Instance).Line();
    }

    Has_Result():
        boolean
    {
        return this.result != null;
    }

    Result():
        Search.Result.Instance
    {
        Utils.Assert(
            this.Has_Result(),
            `Doesn't have result.`,
        );

        return this.result as Search.Result.Instance;
    }

    Column_Count():
        Count
    {
        return this.columns.length;
    }

    Column_At(
        column_index: Index,
    ):
        Column.Instance
    {
        Utils.Assert(
            column_index > -1,
            `column_index (${column_index}) must be greater than -1.`,
        );

        if (column_index < this.Column_Count()) {
            return this.columns[column_index];
        } else {
            return Instance.blank_column;
        }
    }

    Is_Blank():
        boolean
    {
        return this.result == null;
    }

    Is_Part_Of_Table():
        boolean
    {
        return this.Has_Text() && this.Text().Is_Part_Of_Table();
    }

    Is_First_Part_Of_Table():
        boolean
    {
        return this.Has_Text() && this.Text().Is_First_Part_Of_Table();
    }

    Has_Styles():
        boolean
    {
        return this.Has_Text();
    }

    Styles():
        string | { [index: string]: string; }
    {
        if (this.Has_Styles()) {
            const text: Text.Line.Instance = this.Text();
            const column_count: Count = text.Column_Count();

            let grid_template_columns: string = ``;
            let max_width: string = ``;
            if (this.Is_Part_Of_Table()) {
                grid_template_columns = `repeat(${column_count}, 1fr)`;
                max_width = `${column_count * 10}em`;
            } else {
                for (let idx = 0, end = column_count; idx < end; idx += 1) {
                    const column: Text.Column.Instance = text.Column(idx);
                    if (column.Is_Margin()) {
                        grid_template_columns += ` 0.5fr`;
                    } else {
                        grid_template_columns += ` 1fr`;
                    }
                }
                max_width = `100%`;
            }

            return `
                grid-template-columns: ${grid_template_columns};

                max-width: ${max_width};
            `;
        } else {
            return ``;
        }
    }
}
