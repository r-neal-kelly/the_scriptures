import { ID } from "../../types.js";

import * as Utils from "../../utils.js";
import * as Event from "../../event.js";

import * as Model from "../../model/selector/instance.js";

import * as Events from "../events.js";
import * as Entity from "../entity.js";
import * as Slots from "./slots.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;
    private event_grid_id: () => ID;
    private is_visible: () => boolean;

    constructor(
        {
            parent,
            model,
            event_grid_id,
            is_visible,
        }: {
            parent: Entity.Instance,
            model: () => Model.Instance,
            event_grid_id: () => ID,
            is_visible: () => boolean,
        },
    )
    {
        super(
            {
                element: `div`,
                parent: parent,
                event_grid: parent.Event_Grid(),
            },
        );

        this.model = model;
        this.event_grid_id = event_grid_id;
        this.is_visible = is_visible;

        this.Live();
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        this.Add_CSS(
            `
                .Selector {
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 1;

                    height: 100%;

                    background-color: hsl(0, 0%, 0%, 0.7);

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Slots {
                    display: grid;
                    grid-template-rows: 1fr;
                    grid-template-columns: repeat(4, 1fr);
                    justify-content: start;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Slot {
                    display: grid;
                    grid-template-rows: auto auto;
                    grid-template-columns: auto;
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

                    background-color: transparent;
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

                    background-color: transparent;
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

                .Invisible {
                    display: none;
                }
            `,
        );

        return [];
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Slots()
        ) {
            this.Abort_All_Children();

            new Slots.Instance(
                {
                    selector: this,
                    model: () => this.Model(),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Selector`];
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Event_Grid_ID():
        ID
    {
        return this.event_grid_id();
    }

    Is_Visible():
        boolean
    {
        return this.is_visible();
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
