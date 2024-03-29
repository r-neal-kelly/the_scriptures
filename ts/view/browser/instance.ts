import { ID } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Event from "../../event.js";

import * as Model from "../../model/browser/instance.js";
import * as Model_Layout from "../../model/layout.js";

import * as Events from "../events.js";
import * as Entity from "../entity.js";
import * as Commander from "./commander.js";
import * as Body from "./body.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;
    private event_grid_hook: () => ID;

    constructor(
        {
            parent,
            model,
            event_grid_hook,
        }: {
            parent: Entity.Instance,
            model: () => Model.Instance | Model_Layout.Window.Program.Model_Instance,
            event_grid_hook: () => ID,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: parent,
                event_grid: parent.Event_Grid(),
            },
        );

        this.model = model as () => Model.Instance;
        this.event_grid_hook = event_grid_hook;

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Add_This_CSS(
            `
                .Browser {
                    display: grid;
                    grid-template-rows: 1fr;
                    grid-template-columns: auto 1fr;
                    justify-content: start;

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
                .Body {
                    display: grid;
                    grid-template-rows: 1fr;
                    grid-template-columns: 1fr;
                    justify-content: start;

                    position: relative;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Reader {
                    z-index: 0;

                    width: 100%;

                    overflow-x: auto;
                    overflow-y: auto;
                }

                .Hidden {
                    display: none;
                }
            `,
        );

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.BROWSER_COMMANDER_PREVIOUS,
                        this.Event_Grid_Hook(),
                    ),
                    event_handler: this.After_Browser_Commander_Previous,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.BROWSER_COMMANDER_NEXT,
                        this.Event_Grid_Hook(),
                    ),
                    event_handler: this.After_Browser_Commander_Next,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.TOGGLE_ALLOW_ERRORS,
                        this.ID(),
                    ),
                    event_handler: this.After_Toggle_Allow_Errors,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Commander() ||
            !this.Has_Body()
        ) {
            this.Abort_All_Children();

            new Commander.Instance(
                {
                    model: () => this.Model().Commander(),
                    browser: this,
                },
            );
            new Body.Instance(
                {
                    model: () => this.Model().Body(),
                    browser: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Browser`];
    }

    override On_Restyle():
        string | { [index: string]: string; }
    {
        const model: Model.Instance = this.Model();

        return `
            font-size: ${model.Body().Options().Underlying_Font_Size_PX()}px;
        `;
    }

    private async After_Browser_Commander_Previous():
        Promise<void>
    {
        this.Refresh();
    }

    private async After_Browser_Commander_Next():
        Promise<void>
    {
        this.Refresh();
    }

    private async After_Toggle_Allow_Errors():
        Promise<void>
    {
        this.Refresh();
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Event_Grid_Hook():
        ID
    {
        return this.event_grid_hook();
    }

    Has_Commander():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Commander.Instance
        );
    }

    Commander():
        Commander.Instance
    {
        Utils.Assert(
            this.Has_Commander(),
            `Does not have a commander.`,
        );

        return this.Child(0) as Commander.Instance;
    }

    Has_Body():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Body.Instance
        );
    }

    Body():
        Body.Instance
    {
        Utils.Assert(
            this.Has_Body(),
            `Does not have a body.`,
        );

        return this.Child(1) as Body.Instance;
    }
}
