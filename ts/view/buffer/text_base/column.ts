import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Text from "../../../model/text.js";

import * as Entity from "../../entity.js";

interface Model_Instance_i
{
    Is_Blank():
        boolean;

    Text():
        Text.Column.Instance;

    Row_Buffer_Count():
        Count;
    Row_Count():
        Count;

    Is_Marginal():
        boolean;
    Is_Inter_Marginal():
        boolean;
    Is_Interlinear():
        boolean;
    Is_Inter_Interlinear():
        boolean;
    Is_Fully_Tabular():
        boolean;
}

interface Buffer_Instance_i
{
    Event_Grid_Hook():
        ID;
}

interface Line_Instance_i<
    Buffer_Instance extends Buffer_Instance_i,
> extends Entity.Instance
{
    Buffer():
        Buffer_Instance;
}

export abstract class Instance<
    Model_Instance extends Model_Instance_i,
    Buffer_Instance extends Buffer_Instance_i,
    Line_Instance extends Line_Instance_i<Buffer_Instance>,
> extends Entity.Instance
{
    private model: () => Model_Instance;

    constructor(
        {
            line,
            model,
        }: {
            line: Line_Instance,
            model: () => Model_Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: line,
                event_grid: line.Event_Grid(),
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
            const target: Count = Math.max(model.Row_Buffer_Count(), model.Row_Count());

            if (count < target) {
                for (let idx = count, end = target; idx < end; idx += 1) {
                    this.Add_Row(idx);
                }
            } else if (count > target) {
                for (let idx = count, end = target; idx > end;) {
                    idx -= 1;

                    this.Abort_Child(this.Child(idx));
                }
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model_Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Column`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
        } else {
            if (model.Is_Marginal()) {
                classes.push(`Marginal_Column`);
            } else if (model.Is_Inter_Marginal()) {
                classes.push(`Inter_Marginal_Column`);
            } else if (model.Is_Interlinear()) {
                classes.push(`Interlinear_Column`);
            } else if (model.Is_Inter_Interlinear()) {
                classes.push(`Inter_Interlinear_Column`);
            } else if (model.Is_Fully_Tabular()) {
                classes.push(`Fully_Tabular_Column`);
            }
        }

        return classes;
    }

    override On_Restyle():
        string | { [index: string]: string; }
    {
        const model: Model_Instance = this.Model();

        if (!model.Is_Blank()) {
            const text: Text.Column.Instance = model.Text();
            if (
                text.Is_Interlinear() ||
                text.Is_Inter_Interlinear()
            ) {
                return `
                    grid-template-rows: repeat(${text.Row_Count()}, 1fr);
                `;
            } else {
                return `
                    grid-template-rows: repeat(${text.Row_Count()}, min-content);
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
        return this.Line().Buffer();
    }

    Line():
        Line_Instance
    {
        return this.Parent() as Line_Instance;
    }

    abstract Add_Row(
        row_index: Index,
    ): void;
}
