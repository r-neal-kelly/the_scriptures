import { Count } from "../../../types.js";
import { Index } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Entity from "../../entity.js";

import * as Layout from "../instance.js";
import * as Window from "../window.js";

import { Render_Type } from "./render_type.js";

export class Instance extends Entity.Instance
{
    static DEFAULT_RENDER_LIMIT: Count = 2;

    private layout: Layout.Instance;
    private render_type: Render_Type;
    private render_limit: Count;
    private windows: Array<Window.Instance>;

    constructor(
        {
            layout,
            render_type = Render_Type.LANDSCAPE,
            render_limit = Instance.DEFAULT_RENDER_LIMIT,
        }: {
            layout: Layout.Instance,
            render_type?: Render_Type,
            render_limit?: Count,
        },
    )
    {
        super();

        this.layout = layout;
        this.render_type = render_type;
        this.render_limit = Instance.DEFAULT_RENDER_LIMIT;
        this.windows = [];

        this.Set_Render_Limit(render_limit);

        this.Add_Dependencies(
            [
            ],
        );
    }

    Layout():
        Layout.Instance
    {
        return this.layout;
    }

    Render_Type():
        Render_Type
    {
        return this.render_type;
    }

    Set_Render_Type(
        render_type: Render_Type,
    ):
        void
    {
        this.render_type = render_type;
    }

    Render_Limit():
        Count
    {
        return this.render_limit;
    }

    Set_Render_Limit(
        render_limit: Count,
    ):
        void
    {
        Utils.Assert(
            render_limit > 0,
            `render_limit must be greater than 0`,
        );

        this.render_limit = render_limit;
    }

    Window_Count():
        Count
    {
        return this.windows.length;
    }

    Maximized_Window_Count():
        Count
    {
        let result: Count = 0;

        for (const window of this.windows) {
            if (window.Is_Maximized()) {
                result += 1;
            }
        }

        return result;
    }

    Has_Window(
        window: Window.Instance,
    ):
        boolean
    {
        Utils.Assert(
            window.Maybe_Wall() === this,
            `window is not part of this wall.`,
        );

        return this.windows.indexOf(window) > -1;
    }

    Has_Window_At(
        index: Index,
    ):
        boolean
    {
        return index > -1 && index < this.Window_Count();
    }

    Window_At(
        index: Index,
    ):
        Window.Instance
    {
        Utils.Assert(
            this.Has_Window_At(index),
            `Has no window at index ${index}.`,
        );

        return this.windows[index];
    }

    Window_Index(
        window: Window.Instance,
    ):
        Index
    {
        Utils.Assert(
            window.Maybe_Wall() === this,
            `Window wall mismatch!`,
        );

        return this.windows.indexOf(window);
    }

    Windows():
        Array<Window.Instance>
    {
        return Array.from(this.windows);
    }

    async Add_Program(
        program: Window.Program.Instance,
    ):
        Promise<Window.Instance>
    {
        const window: Window.Instance = new Window.Instance(
            {
                wall: this,
                program: program,
            },
        );

        await window.Ready();

        return window;
    }

    __Add_Window__(
        window: Window.Instance,
    ):
        void
    {
        Utils.Assert(
            window.Is_Alive(),
            `A window must be alive to be added.`,
        );
        Utils.Assert(
            window.Maybe_Wall() !== this,
            `Already has this window.`,
        );
        Utils.Assert(
            !window.Is_In_Wall(),
            `Window is already in another wall.`,
        );

        this.windows.push(window);
        this.Layout().Taskbar().Tabs().Add_Tab(window);
    }

    __Remove_Window__(
        window: Window.Instance,
    ):
        void
    {
        Utils.Assert(
            window.Is_Alive(),
            `A window must be alive to be removed.`,
        );
        Utils.Assert(
            window.Maybe_Wall() === this,
            `Window wall mismatch!`,
        );

        const window_index: Index = this.windows.indexOf(window);

        Utils.Assert(
            window_index > -1,
            `Doesn't have window with id of ${window.ID()}.`,
        );

        this.Layout().Taskbar().Tabs().Remove_Tab(window_index);
        this.windows.splice(window_index, 1);
    }
}
