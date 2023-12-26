import * as Event from "../../../../event.js";
import * as Keyboard from "../../../../keyboard.js";

import * as Model from "../../../../model/finder/body/expression.js";

import * as Events from "../../../events.js";
import * as Entity from "../../../entity.js";
import * as Expression from "./instance.js";

class Keyboard_Hook extends Keyboard.Hook.Instance
{
    private instance: Instance;

    constructor(
        instance: Instance,
    )
    {
        super();

        this.instance = instance;
    }

    override async After_Insert_Or_Paste_Or_Delete(
        event: InputEvent,
    ):
        Promise<void>
    {
        await this.instance.Send(
            new Event.Info(
                {
                    affix: Events.FINDER_BODY_EXPRESSION_CHANGE,
                    suffixes: [
                        this.instance.ID(),
                        this.instance.Expression().Body().Finder().ID(),
                    ],
                    type: Event.Type.EXCLUSIVE,
                    data: {},
                },
            ),
        );
    }
}

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;
    private keyboard_hook: Keyboard_Hook;

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
        this.keyboard_hook = new Keyboard_Hook(this);

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Element().setAttribute(`contentEditable`, `true`);
        this.Element().setAttribute(`spellcheck`, `false`);

        Keyboard.Singleton().Add_Div(
            this.Element() as HTMLDivElement,
            this.keyboard_hook,
        );

        // these should eventually go on the keyboard hook I think
        this.Element().addEventListener(
            `keydown`,
            this.On_Key_Down.bind(this),
        );
        this.Element().addEventListener(
            `keyup`,
            this.On_Key_Up.bind(this),
        );

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.FINDER_BODY_EXPRESSION_CHANGE,
                        this.ID(),
                    ),
                    event_handler: this.On_Finder_Body_Expression_Change,
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

    override Before_Death():
        void
    {
        Keyboard.Singleton().Remove_Div(this.Element() as HTMLDivElement);
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
                        affix: Events.FINDER_BODY_EXPRESSION_CHANGE,
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

    private async On_Finder_Body_Expression_Change():
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
