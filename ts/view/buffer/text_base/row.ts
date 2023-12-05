import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Language from "../../../model/language.js";

import * as Entity from "../../entity.js";

interface Model_Instance_i
{
    Is_Blank():
        boolean;

    Min_Segment_Count():
        Count;
    Segment_Count():
        Count;

    Is_Transparent():
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

interface Buffer_Instance_i
{
    Event_Grid_Hook():
        ID;

    Pad_EM(
        pad_count: Count,
    ): Count;
}

interface Line_Instance_i extends Entity.Instance
{
}

interface Column_Instance_i<
    Buffer_Instance extends Buffer_Instance_i,
    Line_Instance extends Line_Instance_i,
> extends Entity.Instance
{
    Buffer():
        Buffer_Instance;
    Line():
        Line_Instance;
}

export abstract class Instance<
    Model_Instance extends Model_Instance_i,
    Buffer_Instance extends Buffer_Instance_i,
    Line_Instance extends Line_Instance_i,
    Column_Instance extends Column_Instance_i<Buffer_Instance, Line_Instance>,
> extends Entity.Instance
{
    private model: () => Model_Instance;

    constructor(
        {
            column,
            model,
        }: {
            column: Column_Instance,
            model: () => Model_Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: column,
                event_grid: column.Event_Grid(),
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
            const target: Count = Math.max(model.Min_Segment_Count(), model.Segment_Count());

            for (let idx = count, end = target; idx < end; idx += 1) {
                this.Add_Segment(idx);
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model_Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Row`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
        } else {
            if (model.Is_Transparent()) {
                classes.push(`Transparent_Row`);
            } else if (model.Is_Centered()) {
                classes.push(`Centered_Row`);
            } else if (model.Is_Padded()) {
                classes.push(`Padded_Row`);
            }
        }

        return classes;
    }

    override On_Restyle():
        string | { [index: string]: string; }
    {
        const model: Model_Instance = this.Model();

        if (!model.Is_Blank()) {
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
        return this.Column().Buffer();
    }

    Column():
        Column_Instance
    {
        return this.Parent() as Column_Instance;
    }

    abstract Add_Segment(
        segment_index: Index,
    ): void;
}
