import { ID } from "../../../types.js";

import * as Model from "../../../model/buffer/text/item.js";

import * as Entity from "../../entity.js";
import * as Segment from "./segment.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            segment,
            model,
        }: {
            segment: Segment.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: segment,
                event_grid: segment.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        this.Element().textContent = model.Value();
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Item`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
        } else {
            if (model.Is_Indented()) {
                classes.push(`Indented_Item`);
            }
            if (model.Has_Italic_Style()) {
                classes.push(`Italic`);
            }
            if (model.Has_Bold_Style()) {
                classes.push(`Bold`);
            }
            if (model.Has_Underline_Style()) {
                classes.push(`Underline`);
            }
            if (model.Has_Small_Caps_Style()) {
                classes.push(`Small_Caps`);
            }
            if (
                model.Is_Error() ||
                model.Has_Error_Style()
            ) {
                classes.push(`Error`);
            }
        }

        return classes;
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Segment():
        Segment.Instance
    {
        return this.Parent() as Segment.Instance;
    }

    Event_Grid_ID():
        ID
    {
        return this.Segment().Event_Grid_ID();
    }
}
