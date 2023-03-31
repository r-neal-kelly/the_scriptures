import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/reader/file/sub_item.js";

import * as Item from "./item.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            item,
        }: {
            model: () => Model.Instance,
            item: Item.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: item,
                event_grid: item.Event_Grid(),
            },
        );

        this.model = model;
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

        classes.push(`Part`);
        if (model.Is_Blank()) {
            classes.push(`Blank`);
        } else {
            if (model.Is_Indented()) {
                classes.push(`Indented_Part`);
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

    Item():
        Item.Instance
    {
        return this.Parent() as Item.Instance;
    }
}
