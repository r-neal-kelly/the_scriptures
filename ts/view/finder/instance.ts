import * as Utils from "../../utils.js";
import * as Event from "../../event.js";

import * as Model from "../../model/finder.js";
import * as Layout from "../../model/layout.js";

import * as Events from "../events.js";
import * as Entity from "../entity.js";
import * as Commander from "./commander.js";
import * as Body from "./body.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            root,
            model,
        }: {
            root: Entity.Instance,
            model: () => Model.Instance | Layout.Window.Program.Model_Instance,
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

        this.model = model as () => Model.Instance;

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Add_This_CSS(
            `
                .Finder {
                    display: grid;
                    grid-template-rows: auto 1fr;
                    grid-template-columns: 1fr;
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
                .Invisible {
                    display: none;
                }
            `,
        );

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.FINDER_BODY_EXPRESSION_ENTER,
                        this.ID(),
                    ),
                    event_handler: this.On_Finder_Body_Expression_Enter,
                    event_priority: 10,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.SELECTOR_TOGGLE,
                        this.ID(),
                    ),
                    event_handler: this.After_Selector_Toggle,
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
                    finder: this,
                    model: () => this.Model().Commander(),
                },
            );
            new Body.Instance(
                {
                    finder: this,
                    model: () => this.Model().Body(),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Finder`];
    }

    private async On_Finder_Body_Expression_Enter():
        Promise<void>
    {
        await this.Send(
            new Event.Info(
                {
                    affix: Events.WINDOW_REFRESH_TITLE,
                    suffixes: [
                        this.ID(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );
    }

    private async After_Selector_Toggle():
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
            `Does not have Commander.`,
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
            `Does not have Body.`,
        );

        return this.Child(1) as Body.Instance;
    }
}
