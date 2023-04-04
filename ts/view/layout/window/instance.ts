import * as Utils from "../../../utils.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/layout/window.js";

import * as Entity from "../../entity.js";
import * as Wall from "../wall.js";
import * as Bar from "./bar.js";

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

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Element().addEventListener(
            `click`,
            this.On_Click.bind(this),
        );

        this.Refresh_After_Has_Model();

        return [];
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        if (model.Is_Ready()) {
            if (
                !this.Has_Bar() ||
                !this.Has_View()
            ) {
                this.Abort_All_Children();
                this.Element().textContent = ``;

                new Bar.Instance(
                    {
                        model: () => this.Model().Bar(),
                        window: this,
                    }
                );

                new (this.Model().Program().View_Class())(
                    {
                        model: () => this.Model().Program().Model_Instance(),
                        root: this,
                    },
                );
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Window`];
    }

    async On_Click():
        Promise<void>
    {
        this.Model().Wall().Layout().Set_Active_Window(this.Model());
        this.Wall().Layout().Refresh();
    }

    async Refresh_After_Has_Model():
        Promise<void>
    {
        // Need to wait to make sure derived type's constructor is done.
        await Utils.Wait_Milliseconds(1);

        while (this.Is_Alive() && !this.Model().Is_Ready()) {
            const element: HTMLElement = this.Element();

            if (element.textContent === `Loading.`) {
                element.textContent = `Loading..`;
            } else if (element.textContent === `Loading..`) {
                element.textContent = `Loading...`;
            } else {
                element.textContent = `Loading.`;
            }

            await Utils.Wait_Milliseconds(200);
        }

        this.Wall().Layout().Refresh();
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

    Has_Bar():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Bar.Instance
        );
    }

    Bar():
        Bar.Instance
    {
        Utils.Assert(
            this.Has_Bar(),
            `Does not have a bar.`,
        );

        return this.Child(0) as Bar.Instance;
    }

    Has_View():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof this.Model().Program().View_Class()
        );
    }

    View():
        Model.Program.View_Instance
    {
        Utils.Assert(
            this.Has_View(),
            `Does not have a view.`,
        );

        return this.Child(1) as Model.Program.View_Instance;
    }
}
