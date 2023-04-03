import * as Utils from "../../../utils.js";
import * as Event from "../../../event.js";
import * as Entity from "../../../entity.js";

import * as Model from "../../../model/browser/body.js";

import * as Browser from "../instance.js";
import * as Selector from "./selector.js";
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
    }

    override On_Life():
        Array<Event.Listener_Info>
    {
        return [
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
        if (
            !this.Has_Selector() ||
            !this.Has_Reader()
        ) {
            this.Abort_All_Children();

            new Selector.Instance(
                {
                    model: () => this.Model().Selector(),
                    body: this,
                },
            );
            new Reader.Instance(
                {
                    model: () => this.Model().Reader(),
                    body: this,
                },
            );
        }
    }

    override On_Reclass():
        Array<string>
    {
        return [`Body`];
    }

    async After_Selector_Slot_Item_Select():
        Promise<void>
    {
        this.Refresh();
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
