import * as Utils from "../../utils.js";
import * as Event from "../../event.js";

import * as Model from "../../model/layout/instance.js";

import * as Events from "../events.js";
import * as Entity from "../entity.js";
import * as Wall from "./wall.js";
import * as Bar from "./bar.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            root,
        }: {
            model: () => Model.Instance,
            root: Entity.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: root,
                event_grid: root.Event_Grid(),
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
                .Layout {
                    display: grid;
                    grid-template-rows: 1fr auto;
                    grid-template-columns: auto;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;

                    color: white;
                }
            `,
        );

        this.Add_Children_CSS(
            `
                .Wall {
                    display: grid;
                    grid-row-gap: 2px;
                    grid-column-gap: 2px;

                    width: 100%;
                    height: 100%;
                    padding: 0 2px;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Window {
                    display: grid;
                    grid-template-rows: auto 1fr;
                    grid-template-columns: auto;

                    width: 100%;
                    height: 100%;

                    overflow-x: auto;
                    overflow-y: auto;

                    border-color: white;
                    border-style: solid;
                    border-width: 1px;
                }
            `,
        );

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.WINDOW_CLOSE,
                        this.ID(),
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
        if (
            !this.Has_Wall() ||
            !this.Has_Bar()
        ) {
            this.Abort_All_Children();

            new Wall.Instance(
                {
                    model: () => this.Model().Wall(),
                    layout: this,
                },
            );
            new Bar.Instance(
                {
                    model: () => this.Model().Bar(),
                    layout: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Layout`];
    }

    async After_Window_Close():
        Promise<void>
    {
        this.Refresh();
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Root():
        Entity.Instance
    {
        return this.Parent();
    }

    Has_Wall():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Wall.Instance
        );
    }

    Wall():
        Wall.Instance
    {
        Utils.Assert(
            this.Has_Wall(),
            `Does not have a wall.`,
        );

        return this.Child(0) as Wall.Instance;
    }

    Has_Bar():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Bar.Instance
        );
    }

    Bar():
        Bar.Instance
    {
        Utils.Assert(
            this.Has_Bar(),
            `Does not have a bar.`,
        );

        return this.Child(1) as Bar.Instance;
    }
}
