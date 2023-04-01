import { Count } from "../../types.js";
import { Index } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Layout from "./instance.js";
import * as Window from "./window.js";

export class Instance
{
    private layout: Layout.Instance;
    private windows: Map<Window.ID, Window.Instance>;

    constructor(
        {
            layout,
        }: {
            layout: Layout.Instance,
        },
    )
    {
        this.layout = layout;
        this.windows = new Map();
    }

    Layout():
        Layout.Instance
    {
        return this.layout;
    }

    Count():
        Count
    {
        return this.windows.size;
    }

    Has(
        window: Window.Instance,
    ):
        boolean
    {
        return this.Has_ID(window.ID());
    }

    Has_ID(
        window_id: Window.ID,
    ):
        boolean
    {
        return this.windows.has(window_id);
    }

    From_ID(
        window_id: Window.ID,
    ):
        Window.Instance
    {
        Utils.Assert(
            this.Has_ID(window_id),
            `Does not have window with id ${window_id}.`,
        );

        return this.windows.get(window_id) as Window.Instance;
    }

    Has_At(
        index: Index,
    ):
        boolean
    {
        return this.Layout().Bar().Tabs().Has_At(index);
    }

    At(
        index: Index,
    ):
        Window.Instance
    {
        Utils.Assert(
            this.Has_At(index),
            `Has no window at index ${index}.`,
        );

        return this.Layout().Bar().Tabs().At(index).Window();
    }

    Iterator():
        IterableIterator<Window.Instance>
    {
        return this.windows.values();
    }

    Array():
        Array<Window.Instance>
    {
        return Array.from(this.Iterator());
    }

    Add(
        window: Window.Instance,
    ):
        Window.ID
    {
        const window_id: Window.ID = window.ID();
        Utils.Assert(
            !this.Has_ID(window_id),
            `Already has a window with id of ${window_id}.`,
        );
        Utils.Assert(
            window.Is_Alive(),
            `A window must be alive to be added.`,
        );
        Utils.Assert(
            !window.Is_In_Wall(),
            `Window is already in a wall.`,
        );

        this.windows.set(window_id, window);
        this.Layout().Bar().Tabs().Add_Window(window);

        return window_id;
    }

    Remove(
        window_id: Window.ID,
    ):
        void
    {
        Utils.Assert(
            this.Has_ID(window_id),
            `Doesn't have window with id of ${window_id}.`,
        );
        Utils.Assert(
            this.From_ID(window_id).Is_Alive(),
            `A window must be alive to be removed.`,
        );
        Utils.Assert(
            this.From_ID(window_id).Wall() === this,
            `Window wall mismatch!`,
        );

        this.Layout().Bar().Tabs().Remove_Window(this.From_ID(window_id));
        this.windows.delete(window_id);
    }

    async Add_With(
        {
            model_class,
            view_class,
            model_data = undefined,
        }: {
            model_class: Window.Model_Class,
            view_class: Window.View_Class,
            model_data?: Window.Model_Data,
        },
    ):
        Promise<Window.ID>
    {
        const window: Window.Instance = new Window.Instance(
            {
                wall: this,
                model_class: model_class,
                view_class: view_class,
                model_data: model_data,
            },
        );
        await window.Ready();

        return window.ID();
    }
}
