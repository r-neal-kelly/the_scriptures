import * as Utils from "../../utils.js";
import * as Entity from "../../entity.js";

import * as Model from "../../model/layout/window.js";

import * as Wall from "./wall.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            wall,
        }: {
            model: () => Model.Instance;
            wall: Wall.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: wall,
                event_grid: wall.Event_Grid(),
            },
        );

        this.model = model;
    }

    override On_Refresh():
        void
    {
        if (!this.Has_View()) {
            this.Abort_All_Children();

            new (this.Model().View_Class())(
                {
                    model: () => this.Model().Model(),
                    root: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Window`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Wall():
        Wall.Instance
    {
        return this.Parent() as Wall.Instance;
    }

    Has_View():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof this.Model().View_Class()
        );
    }

    View():
        Model.View_Instance
    {
        Utils.Assert(
            this.Has_View(),
            `Does not have a view.`,
        );

        return this.Child(0) as Model.View_Instance;
    }
}
