import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Language from "../../../model/language.js";
import * as Text from "../../../model/text.js";

import * as Entity from "../../entity.js";

interface Model_Instance_i
{
    Is_Blank():
        boolean;

    Text():
        Text.Line.Instance;

    Min_Column_Count():
        Count;
    Column_Count():
        Count;

    Has_Margin():
        boolean;
    Has_Interlineation():
        boolean;
    Has_Forward_Interlineation():
        boolean;
    Is_Row_Of_Table():
        boolean;
    Is_First_Row_Of_Table():
        boolean;
    Is_Centered():
        boolean;
    Is_Padded():
        boolean;
    Padding_Count():
        Count;
    Padding_Direction():
        Language.Direction;
}

interface Buffer_Instance_i extends Entity.Instance
{
    Event_Grid_ID():
        ID;

    Pad_EM(
        pad_count: Count,
    ): Count;
}

export abstract class Instance<
    Model_Instance extends Model_Instance_i,
    Buffer_Instance extends Buffer_Instance_i,
> extends Entity.Instance
{
    private model: () => Model_Instance;

    constructor(
        {
            buffer,
            model,
        }: {
            buffer: Entity.Instance,
            model: () => Model_Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: buffer,
                event_grid: buffer.Event_Grid(),
            },
        );

        this.model = model;
    }

    override On_Refresh():
        void
    {
        const model: Model_Instance = this.Model();
        const count: Count = this.Child_Count();

        if (count > 0 && model.Is_Blank()) {
            this.Skip_Children();

            if (this.Element().classList.contains(`Blank`)) {
                this.Skip_Remaining_Siblings();
            }
        } else {
            const target: Count = Math.max(model.Min_Column_Count(), model.Column_Count());

            for (let idx = count, end = target; idx < end; idx += 1) {
                this.Add_Column(idx);
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model_Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Line`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
        } else {
            if (model.Has_Margin()) {
                classes.push(`Marginal_Line`);
            } else if (model.Has_Interlineation()) {
                classes.push(`Interlinear_Line`);
                if (model.Has_Forward_Interlineation()) {
                    classes.push(`Forward_Interlinear_Line`);
                } else {
                    classes.push(`Reverse_Interlinear_Line`);
                }
                if (model.Is_Centered()) {
                    classes.push(`Centered_Interlinear_Line`);
                } else if (model.Is_Padded()) {
                    classes.push(`Padded_Interlinear_Line`);
                }
            } else if (model.Is_Row_Of_Table()) {
                classes.push(`Tabular_Line`);
                if (model.Is_First_Row_Of_Table()) {
                    classes.push(`First_Tabular_Line`);
                }
            }
        }

        return classes;
    }

    override On_Restyle():
        string | { [index: string]: string; }
    {
        const model: Model_Instance = this.Model();

        if (!model.Is_Blank()) {
            if (model.Has_Interlineation()) {
                if (model.Is_Padded()) {
                    const padding_value: string =
                        `${this.Buffer().Pad_EM(model.Padding_Count())}em`;
                    const padding_direction: string =
                        model.Padding_Direction() === Language.Direction.LEFT_TO_RIGHT ?
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
                const text: Text.Line.Instance = model.Text();
                const column_count: Count = text.Column_Count();

                let grid_template_columns: string = ``;
                let max_width: string = ``;
                if (model.Is_Row_Of_Table()) {
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

    Model():
        Model_Instance
    {
        return this.model();
    }

    Buffer():
        Buffer_Instance
    {
        return this.Parent() as Buffer_Instance;
    }

    Event_Grid_ID():
        ID
    {
        return this.Buffer().Event_Grid_ID();
    }

    abstract Add_Column(
        column_index: Index,
    ): void;
}
