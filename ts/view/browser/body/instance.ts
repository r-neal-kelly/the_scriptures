import * as Utils from "../../../utils.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/browser/body.js";

import * as Events from "../../events.js";
import * as Entity from "../../entity.js";
import * as Selector from "../../selector.js";
import * as Browser from "../instance.js";
import * as Reader from "./reader.js";

export class Instance extends Entity.Instance
{
    private model: () => Model.Instance;

    constructor(
        {
            model,
            browser,
        }: {
            model: () => Model.Instance,
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
                        Events.BROWSER_COMMANDER_PREVIOUS,
                        this.Browser().ID(),
                    ),
                    event_handler: this.On_Browser_Commander_Previous,
                    event_priority: 10,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.BROWSER_COMMANDER_NEXT,
                        this.Browser().ID(),
                    ),
                    event_handler: this.On_Browser_Commander_Next,
                    event_priority: 10,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.SELECTOR_SLOT_ITEM_SELECT,
                        this.Browser().ID(),
                    ),
                    event_handler: this.On_Selector_Slot_Item_Select,
                    event_priority: 10,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.ON,
                        Events.TOGGLE_ALLOW_ERRORS,
                        this.Browser().ID(),
                    ),
                    event_handler: this.On_Toggle_Allow_Errors,
                    event_priority: 10,
                },
            ),
        ];
    }

    override On_Refresh():
        void
    {
        if (
            !this.Has_Selector() ||
            !this.Has_Reader()
        ) {
            this.Abort_All_Children();

            new Selector.Instance(
                {
                    parent: this,
                    model: () => this.Model().Selector(),
                    event_grid_id: () => this.Browser().ID(),
                    is_visible: () => this.Model().Browser().Commander().Selector().Is_Activated(),
                },
            );
            new Reader.Instance(
                {
                    body: this,
                    model: () => this.Model().Reader(),
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Body`];
    }

    private async On_Browser_Commander_Previous():
        Promise<void>
    {
        await this.Model().Reader().Refresh_File();
    }

    private async On_Browser_Commander_Next():
        Promise<void>
    {
        await this.Model().Reader().Refresh_File();
    }

    private async On_Selector_Slot_Item_Select():
        Promise<void>
    {
        await this.Model().Reader().Refresh_File();
    }

    private async On_Toggle_Allow_Errors():
        Promise<void>
    {
        await this.Model().Reader().Refresh_File();
    }

    Model():
        Model.Instance
    {
        return this.model();
    }

    Browser():
        Browser.Instance
    {
        return this.Parent() as Browser.Instance;
    }

    Has_Selector():
        boolean
    {
        return (
            this.Has_Child(0) &&
            this.Child(0) instanceof Selector.Instance
        );
    }

    Selector():
        Selector.Instance
    {
        Utils.Assert(
            this.Has_Selector(),
            `Does not have a selector.`,
        );

        return this.Child(0) as Selector.Instance;
    }

    Has_Reader():
        boolean
    {
        return (
            this.Has_Child(1) &&
            this.Child(1) instanceof Reader.Instance
        );
    }

    Reader():
        Reader.Instance
    {
        Utils.Assert(
            this.Has_Reader(),
            `Does not have a reader.`,
        );

        return this.Child(1) as Reader.Instance;
    }
}
