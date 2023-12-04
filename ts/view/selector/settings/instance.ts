import * as Utils from "../../../utils.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/selector/settings.js";

import * as Events from "../../events.js";
import * as Entity from "../../entity.js";
import * as Selector from "../instance.js";
import * as Toggle from "./toggle.js";
import * as Slot_Orders from "./slot_orders.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            selector,
            model,
        }: {
            selector: Selector.Instance,
            model: () => Model.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: selector,
                event_grid: selector.Event_Grid(),
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
                .Settings {
                    width: 100%;

                    border-style: solid;
                    border-color: white;
                    border-width: 0 0 1px 0;
                }
            `,
        );

        this.Add_Children_CSS(
            `
                .Toggle {
                    width: 100%;

                    background-color: transparent;
                    color: white;

                    text-align: center;

                    cursor: pointer;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }

                .Toggled_Toggle {
                    border-style: solid;
                    border-color: white;
                    border-width: 0 0 1px 0;
                }

                .Slot_Orders {
                    width: 100%;
                }

                .Slot_Order {
                    width: 100%;

                    background-color: transparent;
                    color: white;

                    text-align: center;

                    cursor: pointer;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }

                .Selected_Slot_Order {
                    background-color: white;
                    color: black;
                }
            `,
        );

        this.Add_CSS(
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
                        Event.Prefix.AFTER,
                        Events.SELECTOR_SETTINGS_TOGGLE,
                        this.ID(),
                    ),
                    event_handler: this.After_Selector_Settings_Toggle,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Toggle() ||
            !this.Has_Slot_Orders()
        ) {
            this.Abort_All_Children();

            new Toggle.Instance(
                {
                    settings: this,
                    model: () => this.Model(),
                },
            );
            new Slot_Orders.Instance(
                {
                    settings: this,
                    model: () => this.Model(),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Settings`];
    }

    private async After_Selector_Settings_Toggle():
        Promise<void>
    {
        this.Refresh();
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Selector():
        Selector.Instance
    {
        return this.Parent() as Selector.Instance;
    }

    Is_Visible():
        boolean
    {
        return this.Selector().Is_Visible();
    }

    Has_Toggle():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Toggle.Instance
        );
    }

    Toggle():
        Toggle.Instance
    {
        Utils.Assert(
            this.Has_Toggle(),
            `Does not have toggle.`,
        );

        return this.Child(0) as Toggle.Instance;
    }

    Has_Slot_Orders():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Slot_Orders.Instance
        );
    }

    Slot_Orders():
        Slot_Orders.Instance
    {
        Utils.Assert(
            this.Has_Slot_Orders(),
            `Does not have slot_orders.`,
        );

        return this.Child(1) as Slot_Orders.Instance;
    }
}
