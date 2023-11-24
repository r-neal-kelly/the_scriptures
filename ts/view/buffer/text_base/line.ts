import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Entity from "../../entity.js";

export interface Model_Instance_i
{
    Min_Column_Count(): Count;
    Column_Count(): Count;
    Column_At(line_index: Index): any;

    Is_Blank(): boolean;
    Has_Margin(): boolean;
    Has_Interlineation(): boolean;
    Has_Forward_Interlineation(): boolean;
    Is_Row_Of_Table(): boolean;
    Is_First_Row_Of_Table(): boolean;
    Is_Centered(): boolean;
    Is_Padded(): boolean;

    Styles(): string | { [css_property: string]: string };
}

export interface Buffer_Instance_i extends Entity.Instance
{
    Event_Grid_ID(): ID;
}

export interface Column_Class_i
{
    new(
        {
            line,
            model,
        }: {
            line: any,
            model: () => any,
        },
    ): any;
}

export class Instance<
    Model_Instance extends Model_Instance_i,
    Buffer_Instance extends Buffer_Instance_i,
> extends Entity.Instance
{
    private model: () => Model_Instance;
    private column_class: Column_Class_i;

    constructor(
        {
            buffer,
            model,
            column_class,
        }: {
            buffer: Entity.Instance,
            model: () => Model_Instance,
            column_class: Column_Class_i,
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
        this.column_class = column_class;
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
                new (this.Column_Class())(
                    {
                        line: this,
                        model: () => this.Model().Column_At(idx),
                    },
                );
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

        return model.Styles();
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

    Column_Class():
        Column_Class_i
    {
        return this.column_class;
    }
}
