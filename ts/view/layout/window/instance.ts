import { Count } from "../../../types.js";

import * as Utils from "../../../utils.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/layout/window.js";

import * as Events from "../../events.js";
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

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Element().addEventListener(
            `click`,
            this.On_Click.bind(this),
        );

        this.Refresh_After_Has_Model();

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.WINDOW_ACTIVATE,
                        this.ID(),
                    ),
                    event_handler: this.On_Window_Activate,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.WINDOW_ACTIVATE,
                        this.ID(),
                    ),
                    event_handler: this.After_Window_Activate,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.WINDOW_DEACTIVATE,
                        this.ID(),
                    ),
                    event_handler: this.On_Window_Deactivate,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.WINDOW_TOGGLE_MAXIMIZATION,
                        this.ID(),
                    ),
                    event_handler: this.On_Window_Toggle_Maximization,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.WINDOW_TOGGLE_MAXIMIZATION,
                        this.ID(),
                    ),
                    event_handler: this.After_Window_Toggle_Maximization,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.WINDOW_TOGGLE_MINIMIZATION,
                        this.ID(),
                    ),
                    event_handler: this.On_Window_Toggle_Minimization,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.WINDOW_TOGGLE_MINIMIZATION,
                        this.ID(),
                    ),
                    event_handler: this.After_Window_Toggle_Minimization,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        if (model.Is_Ready()) {
            if (model.Is_Visible()) {
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
                            parent: this,
                            model: () => this.Model().Program().Model_Instance(),
                            event_grid_hook: () => this.ID(),
                        },
                    );
                }
            } else {
                this.Skip_Children();
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        const model: Model.Instance = this.Model();
        const classes: Array<string> = [];

        classes.push(`Window`);
        if (model.Is_Minimized()) {
            classes.push(`Minimized_Window`);
        } else if (model.Is_Maximized()) {
            classes.push(`Maximized_Window`);
        }

        return classes;
    }

    override On_Restyle():
        string | { [index: string]: string }
    {
        const model: Model.Instance = this.Model();

        if (model.Is_Visible()) {
            if (model.Is_Maximized()) {
                const render_type: Model.Render_Type = model.Render_Type();
                const render_limit: Count = model.Render_Limit();
                const grid_column: string = `grid-column`;
                const grid_row: string = `grid-row`;
                const grid: string =
                    render_type === Model.Render_Type.LANDSCAPE ?
                        grid_column :
                        grid_row;

                return `
                    ${grid}: span ${render_limit};
                `;
            } else {
                return ``;
            }
        } else {
            return ``;
        }
    }

    private async On_Click():
        Promise<void>
    {
        await this.Send(
            new Event.Info(
                {
                    affix: Events.WINDOW_ACTIVATE,
                    suffixes: [
                        this.ID(),
                        this.Wall().ID(),
                        this.Wall().Layout().ID(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );
    }

    private async On_Window_Activate():
        Promise<void>
    {
        this.Model().Activate();
    }

    private async After_Window_Activate():
        Promise<void>
    {
        this.Element().scrollIntoView();
    }

    private async On_Window_Deactivate():
        Promise<void>
    {
        this.Model().Deactivate();
    }

    private async On_Window_Toggle_Maximization():
        Promise<void>
    {
        this.Model().Toggle_Maximization();
    }

    private async After_Window_Toggle_Maximization():
        Promise<void>
    {
        this.Reclass();
    }

    private async On_Window_Toggle_Minimization():
        Promise<void>
    {
        this.Model().Toggle_Minimization();
    }

    private async After_Window_Toggle_Minimization():
        Promise<void>
    {
        this.Reclass();
    }

    private async Refresh_After_Has_Model():
        Promise<void>
    {
        // Need to wait to make sure derived type's constructor is done.
        await Utils.Wait_Milliseconds(1);

        while (this.Is_Alive() && !this.Model().Is_Ready()) {
            const element: HTMLElement = this.Element();

            if (element.textContent === `Loading...`) {
                element.textContent = `Loading.`;
            } else if (element.textContent === `Loading.`) {
                element.textContent = `Loading..`;
            } else {
                element.textContent = `Loading...`;
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
