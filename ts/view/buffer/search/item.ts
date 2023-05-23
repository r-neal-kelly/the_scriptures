import { Count } from "../../../types.js";
import { ID } from "../../../types.js";

import * as Model from "../../../model/buffer/search/item.js";
import * as Model_Languages from "../../../model/languages.js";

import * as Entity from "../../entity.js";
import * as Segment from "./segment.js";
import * as Division from "./division.js";

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
        if (model.Is_Blank()) {
            this.Skip_Children();

            if (this.Element().classList.contains(`Blank`)) {
                this.Skip_Remaining_Siblings();
            }
        } else {
            const target: Count = Math.max(Model.Instance.Min_Division_Count(), model.Division_Count());
            const count: Count = this.Child_Count();

            for (let idx = count, end = target; idx < end; idx += 1) {
                new Division.Instance(
                    {
                        item: this,
                        model: () => this.Model().Division_At(idx),
                    },
                );
            }
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

    override On_Restyle():
        string | { [index: string]: string; }
    {
        const model: Model.Instance = this.Model();
        if (!model.Is_Blank()) {
            const language: Model_Languages.Name | null =
                model.Language();
            if (language) {
                return Model_Languages.Styles(language);
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
