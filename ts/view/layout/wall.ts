import { Count } from "../../types.js";
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
        ];
    }

    override On_Refresh():
        void
    {
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

        return `
            ${primary_grid_template}: repeat(${render_limit}, ${100 / render_limit}%);
            ${secondary_grid_template}: repeat(${Math.ceil(window_count / render_limit) + maximized_window_count}, 100%);
        `;
    }

    private async After_Window_Toggle_Maximization():
        Promise<void>
    {
        this.Reclass();
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

    Window_With_Model(
        window_model: Window_Model.Instance,
    ):
        Window.Instance
    {
        for (let idx = 0, end = this.Child_Count(); idx < end; idx += 1) {
            const window: Window.Instance = this.Child(idx) as Window.Instance;
            if (window.Model() === window_model) {
                return window;
            }
        }

        Utils.Assert(
            false,
            `Does not have window with that model.`,
        );

        return this.Child(0) as Window.Instance;
    }
}
