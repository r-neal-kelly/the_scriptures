import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { Delta } from "../../types.js";

import * as Event from "../../event.js";

import * as Model from "../../model/layout/tabs.js";

import * as Events from "../events.js";
import * as Entity from "../entity.js";
import * as Taskbar from "./taskbar.js";
import * as Tab from "./tab.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;
    private kill_index: Index | null;

    constructor(
        {
            model,
            taskbar,
        }: {
            model: () => Model.Instance;
            taskbar: Taskbar.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: taskbar,
                event_grid: taskbar.Event_Grid(),
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
                        Events.WINDOW_CLOSE,
                        this.Taskbar().Layout().ID(),
                    ),
                    event_handler: this.After_Window_Close,
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
            const target: Count = model.Tab_Count();
            const count: Count = this.Child_Count();
            const delta: Delta = target - count;

            if (delta < 0) {
                for (let idx = count, end = count + delta; idx > end;) {
                    idx -= 1;

                    this.Abort_Child(this.Child(idx));
                }
            } else if (delta > 0) {
                for (let idx = count, end = count + delta; idx < end; idx += 1) {
                    new Tab.Instance(
                        {
                            model: () => this.Model().Tab_At(idx),
                            tabs: this,
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
                const child: Tab.Instance = this.Child(child_idx) as Tab.Instance;
                child.__Set_Model__(() => this.Model().Tab_At(child_idx));
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Tabs`];
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
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Taskbar():
        Taskbar.Instance
    {
        return this.Parent() as Taskbar.Instance;
    }
}
