import { Float } from "../../../../types.js";

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
        keyboard: Keyboard.Instance,
        instance: Instance,
    )
    {
        super(
            {
                keyboard: keyboard,
                div: instance.Element() as HTMLDivElement,
            },
        );

        this.instance = instance;
    }

    Instance():
        Instance
    {
        return this.instance;
    }

    Underlying_Font_Size_PX():
        Float
    {
        return this.instance.Model().Body().Options().Underlying_Font_Size_PX();
    }

    override async On_Key_Down(
        event: KeyboardEvent,
    ):
        Promise<void>
    {
        if (event.key === `Enter`) {
            event.preventDefault();
        }
    }

    override async On_Key_Up(
        event: KeyboardEvent,
    ):
        Promise<void>
    {
        const events: Array<Promise<void>> = [];

        if (event.key === `Enter`) {
            event.preventDefault();

            events.push(
                this.instance.Send(
                    new Event.Info(
                        {
                            affix: Events.FINDER_BODY_EXPRESSION_ENTER,
                            suffixes: [
                                this.instance.ID(),
                                this.instance.Expression().Body().Finder().ID(),
                            ],
                            type: Event.Type.EXCLUSIVE,
                            data: {},
                        },
                    ),
                ),
            );
        }

        events.push(
            this.instance.Send(
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
            ),
        );

        await Promise.all(events);
    }

    override async After_Insert_Or_Paste_Or_Delete():
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
        this.keyboard_hook = new Keyboard_Hook(Keyboard.Singleton(), this);

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Element().setAttribute(`spellcheck`, `false`);

        this.keyboard_hook.Enable();

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
        this.keyboard_hook.Disable();
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
