import * as Utils from "../../utils.js";
import * as Async from "../../async.js";

import * as Taskbar from "./taskbar.js";
import * as Window from "./window.js";

export class Instance
{
    private windows: Map<Window.ID, Window.Instance>;
    private taskbar: Taskbar.Instance;

    constructor()
    {
        this.windows = new Map();
        this.taskbar = new Taskbar.Instance();
    }

    Has_Window(
        window_id: Window.ID,
    ):
        boolean
    {
        return this.windows.has(window_id);
    }

    Window(
        window_id: Window.ID,
    ):
        Window.Instance
    {
        Utils.Assert(
            this.Has_Window(window_id),
            `Does not have window with the id ${window_id}.`,
        );

        return this.windows.get(window_id) as Window.Instance;
    }

    Add_Window(
        window: Window.Instance,
    ):
        Window.ID
    {
        const window_id: Window.ID = window.ID();
        Utils.Assert(
            !this.Has_Window(window_id),
            `Already has a window with id of ${window_id}.`,
        );
        Utils.Assert(
            window.Is_Alive(),
            `A window must be alive to be added.`,
        );
        Utils.Assert(
            !window.Has_Layout(),
            `Window already has a layout.`,
        );

        this.windows.set(window_id, window);
        this.taskbar.Add_Window_ID(window_id);

        return window_id;
    }

    Remove_Window(
        window_id: Window.ID,
    ):
        void
    {
        Utils.Assert(
            this.Has_Window(window_id),
            `Doesn't have window with id of ${window_id}.`,
        );
        Utils.Assert(
            this.Window(window_id).Is_Alive(),
            `A window must be alive to be removed.`,
        );
        Utils.Assert(
            this.Window(window_id).Layout() === this,
            `Window layout mismatch!`,
        );

        this.taskbar.Remove_Window_ID(window_id);
        this.windows.delete(window_id);
    }

    Taskbar():
        Taskbar.Instance
    {
        return this.taskbar;
    }

    async Add_Program(
        program: Async.Instance,
    ):
        Promise<Window.ID>
    {
        const window: Window.Instance = new Window.Instance(
            {
                layout: this,
                program: program,
            },
        );
        await window.Ready();

        return window.ID();
    }
}
