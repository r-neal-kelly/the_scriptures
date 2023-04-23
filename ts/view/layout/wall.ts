import { Count } from "../../types.js";
import { Delta } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Model from "../../model/layout/wall.js";
import * as Window_Model from "../../model/layout/window.js";

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

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();
        const target: Count = model.Count();
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
                        model: () => this.Model().At(idx),
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
        string
    {
        // This is just dumb logic, but I want something working
        // and my brain is having a hard time cooperating. I
        // can barely get this right.
        const model: Model.Instance = this.Model();
        const window_count: Count = model.Count();

        if (window_count === 1) {
            return `
                grid-template-columns: repeat(1, 1fr);
                grid-template-rows: repeat(1, 1fr);
            `;
        } else if (window_count === 2) {
            return `
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(1, 1fr);
            `;
        } else if (window_count === 3) {
            return `
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(2, 1fr);
            `;
        } else if (window_count === 4) {
            return `
                grid-template-columns: repeat(2, 1fr);
                grid-template-rows: repeat(2, 1fr);
            `;
        } else if (window_count === 5) {
            return `
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(2, 1fr);
            `;
        } else if (window_count === 6) {
            return `
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(2, 1fr);
            `;
        } else {
            return `
                grid-template-columns: auto;
                grid-template-rows: auto;
            `;
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
