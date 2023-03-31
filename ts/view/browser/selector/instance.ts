import { Count } from "../../../types.js";
import { Delta } from "../../../types.js";

import * as Entity from "../../../entity.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/browser/selector/instance.js";

import * as Browser from "../instance.js";
import * as Slot from "./slot.js";

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
                    grid-template-columns: repeat(4, auto);
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
            `,
        );

        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.AFTER, "Selector_Slot_Item_Select"),
                    event_handler: this.After_Selector_Slot_Item_Select.bind(this),
                    event_priority: 0,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        const model: Model.Instance = this.Model();
        const target: Count = model.Slot_Count();
        const count: Count = this.Child_Count();
        const delta: Delta = target - count;

        if (delta < 0) {
            for (let idx = count, end = count + delta; idx > end;) {
                idx -= 1;

                this.Abort_Child(this.Child(idx));
            }
        } else if (delta > 0) {
            for (let idx = count, end = count + delta; idx < end; idx += 1) {
                new Slot.Instance(
                    {
                        model: model.Slot(idx),
                        selector: this,
                    },
                );
            }
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Selector`];
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
}
