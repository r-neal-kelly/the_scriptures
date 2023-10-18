import { ID } from "../../../types.js";

import * as Utils from "../../../utils.js";

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
        const element: HTMLElement = this.Element();

        if (element instanceof HTMLDivElement) {
            if (model.Has_Image_Value()) {
                this.Replace_Element(`img`);
                this.Element().setAttribute(`src`, model.Value());
            } else {
                this.Element().textContent = model.Value();
            }
        } else if (element instanceof HTMLImageElement) {
            if (model.Has_Image_Value()) {
                this.Element().setAttribute(`src`, model.Value());
            } else {
                this.Replace_Element(`div`);
                this.Element().textContent = model.Value();
            }
        } else {
            Utils.Assert(
                false,
                `invalid element type.`,
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Item`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
        } else if (model.Has_Image_Value()) {
            classes.push(`Image`);
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
            if (model.Has_Argument_Style()) {
                classes.push(`Argument`);
            }
        }

        return classes;
    }

    override On_Restyle():
        string | { [index: string]: string; }
    {
        const model: Model.Instance = this.Model();
        if (!model.Is_Blank() && !model.Has_Image_Value()) {
            if (model.Has_Override_Font_Styles()) {
                return model.Some_Override_Font_Styles();
            } else {
                return ``;
            }
        } else {
            return ``;
        }
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
