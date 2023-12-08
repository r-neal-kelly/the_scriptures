import * as Utils from "../../utils.js";
import * as Event from "../../event.js";

import * as Model from "../../model/layout/taskbar.js";

import * as Entity from "../entity.js";
import * as Layout from "./instance.js";
import * as Starter from "./starter.js";
import * as Tabs from "./tabs.js";

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
        this.Add_This_CSS(
            `
                .Taskbar {
                    display: grid;
                    grid-template-columns: auto 1fr;
                    
                    width: 100%;
                    height: 100%;
                    padding: 0 2px;

                    overflow-x: hidden;
                    overflow-y: hidden;

                    border-color: white;
                    border-style: solid;
                    border-width: 1px 0 0 0;
                }
            `,
        );

        this.Add_Children_CSS(
            `
                .Starter {
                    width: 1em;
                    height: 100%;

                    text-align: center;

                    cursor: pointer;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }

                .Tabs {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;

                    width: 100%;
                    height: 100%;

                    overflow-x: auto;
                    overflow-y: hidden;
                }

                .Tab {
                    height: 100%;

                    margin-left: 7px;
                    padding: 2px;

                    border-color: white;
                    border-style: solid;
                    border-width: 0 1px;

                    font-size: 0.8em;
                    text-align: center;

                    cursor: pointer;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }

                .Active_Tab {
                    color: black;
                    background-color: white;
                }

                .Maximized_Tab {
                    text-decoration: underline;
                }

                .Minimized_Tab {
                    align-self: self-end;

                    height: 80%;

                    border-width: 1px;

                    font-size: 0.7em;
                }
            `,
        );

        return [];
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Starter() ||
            !this.Has_Tabs()
        ) {
            this.Abort_All_Children();

            new Starter.Instance(
                {
                    model: () => this.Model().Starter(),
                    taskbar: this,
                },
            );
            new Tabs.Instance(
                {
                    model: () => this.Model().Tabs(),
                    taskbar: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Taskbar`];
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

    Has_Starter():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Starter.Instance
        );
    }

    Starter():
        Starter.Instance
    {
        Utils.Assert(
            this.Has_Starter(),
            `Does not have starter.`,
        );

        return this.Child(0) as Starter.Instance;
    }

    Has_Tabs():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Tabs.Instance
        );
    }

    Tabs():
        Tabs.Instance
    {
        Utils.Assert(
            this.Has_Tabs(),
            `Does not have tabs.`,
        );

        return this.Child(1) as Tabs.Instance;
    }
}
