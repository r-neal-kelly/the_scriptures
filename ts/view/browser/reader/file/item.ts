import { Count } from "../../../../types.js";
import { Delta } from "../../../../types.js";

import * as Utils from "../../../../utils.js";
import * as Entity from "../../../../entity.js";

import * as Model from "../../../../model/browser/reader/file/item.js";

import * as Line from "./line.js";
import * as Sub_Item from "./sub_item.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            line,
        }: {
            model: () => Model.Instance,
            line: Line.Instance,
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
        const model: Model.Instance = this.Model();
        const element: HTMLElement = this.Element();
        const target: Count = model.Sub_Item_Count();
        const count: Count = this.Child_Count();
        const delta: Delta = target - count;

        if (delta < 0) {
            for (let idx = count, end = count + delta; idx > end;) {
                idx -= 1;

                this.Abort_Child(this.Child(idx));
            }
            if (target === 0) {
                element.textContent = model.Value();
            }
        } else if (delta > 0) {
            if (count === 0) {
                element.textContent = ``;
            }
            for (let idx = count, end = count + delta; idx < end; idx += 1) {
                new Sub_Item.Instance(
                    {
                        model: () => this.Model().Sub_Item_At(idx),
                        item: this,
                    },
                );
            }
        } else {
            if (target === 0) {
                element.textContent = model.Value();
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        if (model.Has_Part()) {
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
        } else {
            classes.push(`Segment`);
            if (model.Is_Blank()) {
                classes.push(`Blank`);
            }
        }

        return classes;
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Line():
        Line.Instance
    {
        return this.Parent() as Line.Instance;
    }
}
