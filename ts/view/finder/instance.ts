import * as Utils from "../../utils.js";
import * as Event from "../../event.js";

import * as Model from "../../model/finder/instance.js";
import * as Layout from "../../model/layout.js";

import * as Events from "../events.js";
import * as Entity from "../entity.js";
import * as Expression from "./expression.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            root,
        }: {
            model: () => Model.Instance | Layout.Window.Program.Model_Instance,
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

        this.model = model as () => Model.Instance;
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Add_This_CSS(
            `
                .Finder {
                    display: grid;
                    grid-template-rows: 1fr 1fr;
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
                .Expression {
                    width: 100%;
                    height: 100%;
                    padding: 2px;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }
            `,
        );

        return [];
    }

    override On_Refresh():
        void
    {
        if (!this.Has_Expression()) {
            this.Abort_All_Children();

            new Expression.Instance(
                {
                    model: () => this.Model(),
                    parent: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Finder`];
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

    Has_Expression():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Expression.Instance
        );
    }

    Expression():
        Expression.Instance
    {
        Utils.Assert(
            this.Has_Expression(),
            `Does not have expression.`,
        );

        return this.Child(0) as Expression.Instance;
    }
}
