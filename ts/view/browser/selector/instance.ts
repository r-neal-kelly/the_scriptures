import * as Utils from "../../../utils.js";
import * as Entity from "../../../entity.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/browser/selector/instance.js";

import * as Browser from "../instance.js";
import * as Toggle from "./toggle.js";
import * as Slots from "./slots.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;

    constructor(
        {
            model,
            browser,
        }: {
            model: Model.Instance,
            browser: Browser.Instance,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: browser,
                event_grid: browser.Event_Grid(),
            },
        );

        this.model = model;
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Add_This_CSS(
            `
                .Selector {
                    display: grid;
                    grid-template-rows: 1fr;
                    grid-template-columns: repeat(2, auto);
                    justify-content: start;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }
            `,
        );

        this.Add_Children_CSS(
            `
                .Toggle {
                    display: flex;
                    align-items: center;

                    padding: 4px;

                    border-color: white;
                    border-style: solid;
                    border-width: 0 1px 0 0;

                    cursor: pointer;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
                
                .Slots {
                    display: grid;
                    grid-template-rows: 1fr;
                    grid-template-columns: repeat(4, auto);
                    justify-content: start;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Slot {
                    display: grid;
                    grid-template-rows: auto auto;
                    grid-template-columns: 1fr;
                    align-content: start;

                    width: 100%;
                    height: 100%;
                    padding: 0 3px;

                    border-color: white;
                    border-style: solid;
                    border-width: 0 1px 0 0;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Slot_Title {
                    width: 100%;
                
                    overflow-x: hidden;
                    overflow-y: hidden;

                    background-color: black;
                    color: white;

                    border-color: white;
                    border-style: solid;
                    border-width: 0 0 1px 0;

                    font-variant: small-caps;

                    cursor: default;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }

                .Slot_Items {
                    width: 100%;

                    padding: 2px 2px;

                    overflow-x: auto;
                    overflow-y: auto;
                }

                .Slot_Item {
                    width: 100%;
                    padding: 2px 2px;
                    
                    overflow-x: hidden;
                    overflow-y: hidden;

                    background-color: black;
                    color: white;

                    cursor: pointer;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
                
                .Slot_Item_Selected {
                    background-color: white;
                    color: black;
                }

                .Hidden {
                    display: none;
                }
            `,
        );

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.AFTER, `Selector_Toggle`, `${this.Browser().ID()}`),
                    event_handler: this.After_Selector_Toggle,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.AFTER, `Selector_Slot_Item_Select`, `${this.Browser().ID()}`),
                    event_handler: this.After_Selector_Slot_Item_Select,
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();

        if (
            !this.Has_Toggle() ||
            !this.Has_Slots()
        ) {
            this.Abort_All_Children();

            new Toggle.Instance(
                {
                    model: model.Toggle(),
                    selector: this,
                },
            );
            new Slots.Instance(
                {
                    model: model.Slots(),
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

    async After_Selector_Slot_Item_Select():
        Promise<void>
    {
        this.Refresh();
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Browser():
        Browser.Instance
    {
        return this.Parent() as Browser.Instance;
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

    Has_Slots():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Slots.Instance
        );
    }

    Slots():
        Slots.Instance
    {
        Utils.Assert(
            this.Has_Slots(),
            `Does not have slots.`,
        );

        return this.Child(1) as Slots.Instance;
    }
}
