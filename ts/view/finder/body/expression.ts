import * as Event from "../../../event.js";

import * as Model from "../../../model/finder/body/expression.js";

import * as Events from "../../events.js";
import * as Entity from "../../entity.js";
import * as Body from "./instance.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            body,
            model,
        }: {
            body: Body.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: body,
                event_grid: body.Event_Grid(),
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

        this.Element().setAttribute(`contentEditable`, `true`);
        this.Element().setAttribute(`spellcheck`, `false`);

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.FINDER_BODY_EXPRESSION_ENTER,
                        this.ID(),
                    ),
                    event_handler: this.On_Finder_Body_Expression_Enter,
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
        return [`Expression`];
    }

    private async On_Key_Down(
        event: KeyboardEvent,
    ):
        Promise<void>
    {
        if (event.key === `Enter`) {
            event.preventDefault();

            await this.Send(
                new Event.Info(
                    {
                        affix: Events.FINDER_BODY_EXPRESSION_ENTER,
                        suffixes: [
                            this.ID(),
                            this.Body().Finder().ID(),
                        ],
                        type: Event.Type.EXCLUSIVE,
                        data: {},
                    },
                ),
            );
        }
    }

    private async On_Finder_Body_Expression_Enter():
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

    Body():
        Body.Instance
    {
        return this.Parent() as Body.Instance;
    }
}
