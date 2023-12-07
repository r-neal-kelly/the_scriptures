import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { Delta } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Event from "../../event.js";

import * as Model from "../../model/layout/wall.js";
import * as Window_Model from "../../model/layout/window.js";

import * as Events from "../events.js";
import * as Entity from "../entity.js";
import * as Layout from "./instance.js";
import * as Window from "./window.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;
    private kill_index: Index | null;

    constructor(
        {
            model,
            layout,
        }: {
            model: () => Model.Instance;
            layout: Layout.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: layout,
                event_grid: layout.Event_Grid(),
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
                        this.Layout().ID(),
                    ),
                    event_handler: this.After_Window_Close,
                    event_priority: 10,
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
        const grid_column_gap: string = `grid-column-gap`;
        const grid_row_gap: string = `grid-row-gap`;
        const primary_grid_template: string =
            render_type === Model.Render_Type.LANDSCAPE ?
                grid_template_columns :
                grid_template_rows;
        const secondary_grid_template: string =
            primary_grid_template === grid_template_columns ?
                grid_template_rows :
                grid_template_columns;
        const grid_gap_px: Count = 2;

        return `
            ${primary_grid_template}: repeat(${render_limit}, calc(${100 / render_limit}% - ${Math.round((grid_gap_px * (render_limit - 1)) / render_limit)}px));
            ${secondary_grid_template}: repeat(${Math.ceil(window_count / render_limit) + maximized_window_count}, 100%);
            ${grid_column_gap}: ${grid_gap_px}px;
            ${grid_row_gap}: ${grid_gap_px}px;
        `;
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

    Model():
        Model.Instance
    {
        return this.model();
    }

    Layout():
        Layout.Instance
    {
        return this.Parent() as Layout.Instance;
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
