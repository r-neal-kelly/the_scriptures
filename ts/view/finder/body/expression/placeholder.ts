import * as Event from "../../../../event.js";

import * as Model from "../../../../model/finder/body/expression.js";

import * as Events from "../../../events.js";
import * as Entity from "../../../entity.js";
import * as Expression from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            expression,
            model,
        }: {
            expression: Expression.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: expression,
                event_grid: expression.Event_Grid(),
            },
        );

        this.model = model;

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.FINDER_BODY_EXPRESSION_CHANGE,
                        this.Expression().Body().Finder().ID(),
                    ),
                    event_handler: this.On_Finder_Body_Expression_Change,
                    event_priority: 10,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        const value: string = this.Model().Value();
        if (value === ``) {
            this.Element().textContent = this.Model().Placeholder();
        } else {
            this.Element().textContent = ``;
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Expression_Placeholder`];
    }

    private async On_Finder_Body_Expression_Change():
        Promise<void>
    {
        this.Refresh();
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Expression():
        Expression.Instance
    {
        return this.Parent() as Expression.Instance;
    }
}
