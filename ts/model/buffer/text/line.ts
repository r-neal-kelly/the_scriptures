import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";
import * as Language from "../../language.js";
import * as Text from "../../text.js";
import * as Buffer from "./instance.js";
import * as Column from "./column.js";

export class Instance extends Entity.Instance
{
    private static min_column_count: Count = 1;

    private static blank_column: Column.Instance = new Column.Instance(
        {
            line: null,
            index: null,
            text: null,
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
    private text: Text.Line.Instance | null;
    private columns: Array<Column.Instance>;

    constructor(
        {
            buffer,
            index,
            text,
        }: {
            buffer: Buffer.Instance | null,
            index: Index | null,
            text: Text.Line.Instance | null,
        },
    )
    {
        super();

        this.buffer = buffer;
        this.index = index;
        this.text = text;
        this.columns = [];

        if (text == null) {
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

            for (let idx = 0, end = text.Column_Count(); idx < end; idx += 1) {
                this.columns.push(
                    new Column.Instance(
                        {
                            line: this,
                            index: idx,
                            text: text.Column(idx),
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
        return this.text != null;
    }

    Text():
        Text.Line.Instance
    {
        Utils.Assert(
            this.Has_Text(),
            `Doesn't have text.`,
        );

        return this.text as Text.Line.Instance;
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
        return this.text == null;
    }

    Has_Margin():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `this line is blank`,
        );

        return this.Text().Has_Margin();
    }

    Has_Interlineation():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `this line is blank`,
        );

        return this.Text().Has_Interlineation();
    }

    Has_Forward_Interlineation():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `this line is blank`,
        );

        return this.Text().Has_Forward_Interlineation();
    }

    Has_Reverse_Interlineation():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `this line is blank`,
        );

        return this.Text().Has_Reverse_Interlineation();
    }

    Is_Row_Of_Table():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `this line is blank`,
        );

        return this.Text().Is_Row_Of_Table();
    }

    Is_First_Row_Of_Table():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `this line is blank`,
        );

        return this.Text().Is_First_Row_Of_Table();
    }

    Is_Centered():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `this line is blank`,
        );

        return this.Text().Is_Centered();
    }

    Is_Padded():
        boolean
    {
        Utils.Assert(
            !this.Is_Blank(),
            `this line is blank`,
        );

        return this.Text().Is_Padded();
    }

    Padding_Count():
        Count
    {
        Utils.Assert(
            !this.Is_Blank(),
            `this line is blank`,
        );

        return this.Text().Padding_Count();
    }

    Padding_Direction():
        Language.Direction
    {
        return this.Text().Has_Forward_Interlineation() ?
            Language.Direction.LEFT_TO_RIGHT :
            Language.Direction.RIGHT_TO_LEFT;
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
            if (this.Has_Interlineation()) {
                if (this.Is_Padded()) {
                    const padding_value: string =
                        `${this.Buffer().Pad_EM(this.Padding_Count())}em`;
                    const padding_direction: string =
                        this.Padding_Direction() === Language.Direction.LEFT_TO_RIGHT ?
                            `left` :
                            `right`;

                    return `
                        margin-${padding_direction}: ${padding_value};
                        border-${padding_direction}-width: 1px;
                    `;
                } else {
                    return ``;
                }
            } else {
                const column_count: Count = text.Column_Count();

                let grid_template_columns: string = ``;
                let max_width: string = ``;
                if (this.Is_Row_Of_Table()) {
                    grid_template_columns = `repeat(${column_count}, 1fr)`;
                    max_width = `${column_count * 10}em`;
                } else {
                    for (let idx = 0, end = column_count; idx < end; idx += 1) {
                        const column: Text.Column.Instance = text.Column(idx);
                        if (column.Is_Marginal()) {
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
            }
        } else {
            return ``;
        }
    }
}
