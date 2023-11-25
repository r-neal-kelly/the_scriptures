import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Entity from "../../entity.js";

interface Model_Instance_i
{
    Is_Blank():
        boolean;

    Min_Item_Count():
        Count;
    Item_Count():
        Count;

    Has_Left_To_Right_Style():
        boolean;
    Has_Right_To_Left_Style():
        boolean;
}

interface Buffer_Instance_i
{
    Event_Grid_ID():
        ID;
}

interface Row_Instance_i<
    Buffer_Instance extends Buffer_Instance_i,
> extends Entity.Instance
{
    Buffer():
        Buffer_Instance;
}

export abstract class Instance<
    Model_Instance extends Model_Instance_i,
    Buffer_Instance extends Buffer_Instance_i,
    Row_Instance extends Row_Instance_i<Buffer_Instance>,
> extends Entity.Instance
{
    private model: () => Model_Instance;

    constructor(
        {
            row,
            model,
        }: {
            row: Row_Instance,
            model: () => Model_Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: row,
                event_grid: row.Event_Grid(),
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
            const target: Count = Math.max(model.Min_Item_Count(), model.Item_Count());

            for (let idx = count, end = target; idx < end; idx += 1) {
                this.Add_Item(idx);
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model_Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Segment`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
        } else {
            if (model.Has_Left_To_Right_Style()) {
                classes.push(`Left_To_Right`);
            } else if (model.Has_Right_To_Left_Style()) {
                classes.push(`Right_To_Left`);
            }
        }

        return classes;
    }

    Model():
        Model_Instance
    {
        return this.model();
    }

    Buffer():
        Buffer_Instance
    {
        return this.Row().Buffer();
    }

    Row():
        Row_Instance
    {
        return this.Parent() as Row_Instance;
    }

    Event_Grid_ID():
        ID
    {
        return this.Buffer().Event_Grid_ID();
    }

    abstract Add_Item(
        item_index: Index,
    ): void;
}
