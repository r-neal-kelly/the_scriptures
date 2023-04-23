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
        this.Element().addEventListener(
            `keydown`,
            this.On_Key_Down.bind(this),
        );
        this.Element().addEventListener(
            `keyup`,
            this.On_Key_Up.bind(this),
        );

        this.Element().setAttribute(`contentEditable`, `true`);
        this.Element().setAttribute(`spellcheck`, `false`);

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.FINDER_BODY_EXPRESSION_KEY_UP,
                        this.ID(),
                    ),
                    event_handler: this.On_Finder_Body_Expression_Key_Up,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        this.Element().textContent = this.Model().Value();
    }

    override On_Reclass():
        Array<string>
    {
        return [`Expression_Input`];
    }

    private async On_Key_Down(
        event: KeyboardEvent,
    ):
        Promise<void>
    {
        if (event.key === `Enter`) {
            event.preventDefault();
        }
    }

    private async On_Key_Up(
        event: KeyboardEvent,
    ):
        Promise<void>
    {
        const events: Array<Promise<void>> = [];

        if (event.key === `Enter`) {
            event.preventDefault();

            events.push(
                this.Send(
                    new Event.Info(
                        {
                            affix: Events.FINDER_BODY_EXPRESSION_ENTER,
                            suffixes: [
                                this.ID(),
                                this.Expression().Body().Finder().ID(),
                            ],
                            type: Event.Type.EXCLUSIVE,
                            data: {},
                        },
                    ),
                ),
            );
        }

        events.push(
            this.Send(
                new Event.Info(
                    {
                        affix: Events.FINDER_BODY_EXPRESSION_KEY_UP,
                        suffixes: [
                            this.ID(),
                            this.Expression().Body().Finder().ID(),
                        ],
                        type: Event.Type.EXCLUSIVE,
                        data: {},
                    },
                ),
            ),
        );

        await Promise.all(events);
    }

    private async On_Finder_Body_Expression_Key_Up():
        Promise<void>
    {
        this.Model().Set_Value(
            this.Element().textContent != null ?
                this.Element().textContent as string :
                ``,
        );
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
