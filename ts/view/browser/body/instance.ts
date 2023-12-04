import * as Utils from "../../../utils.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/browser/body.js";

import * as Events from "../../events.js";
import * as Entity from "../../entity.js";
import * as Font_Selector from "../../font_selector.js";
import * as Selector from "../../selector.js";
import * as Browser from "../instance.js";
import * as Reader from "./reader.js";

enum Child_Index
{
    FONT_SELECTOR,
    SELECTOR,
    READER,
}

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
                        Event.Prefix.AFTER,
                        Events.SELECTOR_TOGGLE,
                        this.Browser().ID(),
                    ),
                    event_handler: this.After_Selector_Toggle,
                    event_priority: 0,
                },
            ),
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(
                        Event.Prefix.AFTER,
                        Events.FONT_SELECTOR_TOGGLE,
                        this.Browser().ID(),
                    ),
                    event_handler: this.After_Font_Selector_Toggle,
                    event_priority: 0,
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
                        Events.FONT_SELECTOR_SLOT_ITEM_SELECT,
                        this.Browser().ID(),
                    ),
                    event_handler: this.On_Font_Selector_Slot_Item_Select,
                    event_priority: 10,
                },
            ),
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
            !this.Has_Font_Selector() ||
            !this.Has_Selector() ||
            !this.Has_Reader()
        ) {
            this.Abort_All_Children();

            new Font_Selector.Instance(
                {
                    parent: this,
                    model: () => this.Model().Font_Selector(),
                    event_grid_hook: () => this.Browser().ID(),
                    is_visible: () => this.Model().Browser().Commander().Font_Selector().Is_Activated(),
                },
            );
            new Selector.Instance(
                {
                    parent: this,
                    model: () => this.Model().Selector(),
                    event_grid_hook: () => this.Browser().ID(),
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

    private async After_Selector_Toggle():
        Promise<void>
    {
        this.Selector().Refresh();
        this.Font_Selector().Refresh();
    }

    private async After_Font_Selector_Toggle():
        Promise<void>
    {
        this.Selector().Refresh();
        this.Font_Selector().Refresh();
    }

    private async On_Selector_Slot_Item_Select():
        Promise<void>
    {
        await this.Model().Reader().Refresh_File();
    }

    private async On_Font_Selector_Slot_Item_Select(
        {
            should_update_text,
        }: Events.FONT_SELECTOR_SLOT_ITEM_SELECT_DATA,
    ):
        Promise<void>
    {
        if (should_update_text) {
            await this.Model().Reader().Refresh_File(true);
        }
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

    Has_Font_Selector():
        boolean
    {
        return (
            this.Has_Child(Child_Index.FONT_SELECTOR) &&
            this.Child(Child_Index.FONT_SELECTOR) instanceof Font_Selector.Instance
        );
    }

    Font_Selector():
        Font_Selector.Instance
    {
        Utils.Assert(
            this.Has_Font_Selector(),
            `Does not have a font_selector.`,
        );

        return this.Child(Child_Index.FONT_SELECTOR) as Font_Selector.Instance;
    }

    Has_Selector():
        boolean
    {
        return (
            this.Has_Child(Child_Index.SELECTOR) &&
            this.Child(Child_Index.SELECTOR) instanceof Selector.Instance
        );
    }

    Selector():
        Selector.Instance
    {
        Utils.Assert(
            this.Has_Selector(),
            `Does not have a selector.`,
        );

        return this.Child(Child_Index.SELECTOR) as Selector.Instance;
    }

    Has_Reader():
        boolean
    {
        return (
            this.Has_Child(Child_Index.READER) &&
            this.Child(Child_Index.READER) instanceof Reader.Instance
        );
    }

    Reader():
        Reader.Instance
    {
        Utils.Assert(
            this.Has_Reader(),
            `Does not have a reader.`,
        );

        return this.Child(Child_Index.READER) as Reader.Instance;
    }
}
