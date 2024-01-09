import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { Delta } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Event from "../../event.js";

import * as Model from "../../model/layout/wall.js";
import * as Model_Window from "../../model/layout/window.js";
import * as Browser_Model from "../../model/browser.js";
import * as Browser_View from "./../browser.js";
import * as Finder_Model from "../../model/finder.js";
import * as Finder_View from "./../finder.js";

import * as Events from "../events.js";
import * as Entity from "../entity.js";
import * as Desktop from "./desktop.js";
import * as Window from "./window.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;
    private kill_index: Index | null;

    constructor(
        {
            model,
            desktop,
        }: {
            model: () => Model.Instance;
            desktop: Desktop.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: desktop,
                event_grid: desktop.Event_Grid(),
            },
        );

        this.model = model;
        this.kill_index = null;

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        return [
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
                        Event.Prefix.AFTER,
                        Events.WINDOW_CLOSE,
                        this.Desktop().Layout().ID(),
                    ),
                    event_handler: this.After_Window_Close,
                    event_priority: 10,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.OPEN_BROWSER,
                        this.Desktop().Layout().ID(),
                    ),
                    event_handler: this.On_Open_Browser,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.OPEN_BROWSER,
                        this.Desktop().Layout().ID(),
                    ),
                    event_handler: this.After_Open_Browser,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.OPEN_FINDER,
                        this.Desktop().Layout().ID(),
                    ),
                    event_handler: this.On_Open_Finder,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.OPEN_FINDER,
                        this.Desktop().Layout().ID(),
                    ),
                    event_handler: this.After_Open_Finder,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        if (this.kill_index == null) {
            const model: Model.Instance = this.Model();
            const target: Count = model.Window_Count();
            const count: Count = this.Child_Count();
            const delta: Delta = target - count;

            if (delta < 0) {
                for (let idx = count, end = count + delta; idx > end;) {
                    idx -= 1;

                    this.Abort_Child(this.Child(idx));
                }
            } else if (delta > 0) {
                for (let idx = count, end = count + delta; idx < end; idx += 1) {
                    new Window.Instance(
                        {
                            model: () => this.Model().Window_At(idx),
                            wall: this,
                        },
                    );
                }
            }
        } else {
            this.Abort_Child(this.Child(this.kill_index));
            this.Skip_Children();

            for (
                let child_idx = this.kill_index, child_end = this.Child_Count();
                child_idx < child_end;
                child_idx += 1
            ) {
                const child: Window.Instance = this.Child(child_idx) as Window.Instance;
                child.__Set_Model__(() => this.Model().Window_At(child_idx));
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Wall`];
    }

    override On_Restyle():
        string | { [index: string]: string }
    {
        const model: Model.Instance = this.Model();
        const render_type: Model.Render_Type = model.Render_Type();
        const render_limit: Count = model.Render_Limit();
        const window_count: Count = model.Window_Count();
        const maximized_window_count: Count = model.Maximized_Window_Count();
        const grid_template_columns: string = `grid-template-columns`;
        const grid_template_rows: string = `grid-template-rows`;
        const primary_grid_template: string =
            render_type === Model.Render_Type.LANDSCAPE ?
                grid_template_columns :
                grid_template_rows;
        const secondary_grid_template: string =
            primary_grid_template === grid_template_columns ?
                grid_template_rows :
                grid_template_columns;
        const grid_auto_flow: string =
            render_type === Model.Render_Type.LANDSCAPE ?
                `row` :
                `column`;

        return `
            grid-auto-flow: ${grid_auto_flow};
            ${primary_grid_template}: repeat(${render_limit}, ${100 / render_limit}%);
            ${secondary_grid_template}: repeat(${Math.ceil(window_count / render_limit) + maximized_window_count}, 100%);
        `;
    }

    override On_Resize(
        parent_rect: DOMRect,
    ):
        void
    {
        const model: Model.Instance = this.Model();

        if (model.Render_Type() === Model.Render_Type.LANDSCAPE) {
            if (Utils.Is_Portrait()) {
                model.Set_Render_Type(Model.Render_Type.PORTRAIT);
                this.Restyle();
            }
        } else {
            if (Utils.Is_Landscape()) {
                model.Set_Render_Type(Model.Render_Type.LANDSCAPE);
                this.Restyle();
            }
        }

        if (model.Has_Active_Window()) {
            this.Move_Window_Into_View(model.Active_Window().Index());
        } else if (model.Window_Count() > 0) {
            this.Move_Window_Into_View(0);
        }
    }

    private async After_Window_Toggle_Maximization():
        Promise<void>
    {
        this.Reclass();
    }

    private async After_Window_Close(
        {
            window_index,
        }: Events.WINDOW_CLOSE_DATA,
    ):
        Promise<void>
    {
        this.kill_index = window_index;
        this.Refresh();
        this.kill_index = null;

        if (
            window_index === 0 ||
            window_index % this.Model().Render_Limit() === 0
        ) {
            this.Move_Window_Into_View(window_index);
        } else {
            this.Move_Window_Into_View(window_index - 1);
        }
    }

    private async On_Open_Browser():
        Promise<void>
    {
        this.Model().Add_Program(
            new Model_Window.Program.Instance(
                {
                    model_class: Browser_Model.Instance,
                    model_data: {},
                    view_class: Browser_View.Instance,
                    is_window_active: true,
                },
            ),
        );
    }

    private async After_Open_Browser():
        Promise<void>
    {
        this.Desktop().Layout().Refresh();
        this.Move_Window_Into_View(this.Model().Window_Count() - 1);
    }

    private async On_Open_Finder():
        Promise<void>
    {
        this.Model().Add_Program(
            new Model_Window.Program.Instance(
                {
                    model_class: Finder_Model.Instance,
                    model_data: undefined,
                    view_class: Finder_View.Instance,
                    is_window_active: true,
                },
            ),
        );
    }

    private async After_Open_Finder():
        Promise<void>
    {
        this.Desktop().Layout().Refresh();
        this.Move_Window_Into_View(this.Model().Window_Count() - 1);
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Desktop():
        Desktop.Instance
    {
        return this.Parent() as Desktop.Instance;
    }

    Window(
        window_index: Index,
    ):
        Window.Instance
    {
        Utils.Assert(
            window_index > -1 &&
            window_index < this.Child_Count(),
            `does not have window at index ${window_index}`,
        );

        return this.Child(window_index) as Window.Instance;
    }

    Move_Window_Into_View(
        window_index: Index,
    ):
        void
    {
        Utils.Assert(
            this.Is_Alive(),
            `is not alive`,
        );

        const model: Model.Instance = this.Model();

        window_index = Math.min(window_index + 1, model.Window_Count());
        while (window_index > 0) {
            window_index -= 1;
            if (model.Window_At(window_index).Is_Visible()) {
                this.Window(window_index).Move_Into_View();
                return;
            }
        }

        const render_type: Model.Render_Type = model.Render_Type();
        if (render_type === Model.Render_Type.LANDSCAPE) {
            this.Element().scrollTop = 0;
        } else {
            this.Element().scrollLeft = 0;
        }
    }
}
