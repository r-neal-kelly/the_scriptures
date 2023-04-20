import * as Utils from "../../../../utils.js";
import * as Event from "../../../../event.js";

import * as Model from "../../../../model/browser/body/selector/instance.js";

import * as Entity from "../../../entity.js";
import * as Body from "../instance.js";
import * as Slots from "./slots.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            body,
        }: {
            model: () => Model.Instance,
            body: Body.Instance,
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
        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        `Selector_Toggle`,
                        this.Body().Browser().ID(),
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
        if (!this.Has_Slots()) {
            this.Abort_All_Children();

            new Slots.Instance(
                {
                    model: () => this.Model().Slots(),
                    selector: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Selector`];
    }

    async After_Selector_Toggle():
        Promise<void>
    {
        this.Refresh();
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

    Has_Slots():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Slots.Instance
        );
    }

    Slots():
        Slots.Instance
    {
        Utils.Assert(
            this.Has_Slots(),
            `Does not have slots.`,
        );

        return this.Child(0) as Slots.Instance;
    }
}
