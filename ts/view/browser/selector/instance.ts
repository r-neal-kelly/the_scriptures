import * as Entity from "../../../entity.js";
import * as Event from "../../../event.js";

import * as Model from "../../../model/browser/selector/instance.js";

import * as Browser from "../instance.js";
import * as Slot from "./slot.js";

export class Instance extends Entity.Instance
{
    private model: Model.Instance;
    private browser: Browser.Instance;
    private slots: Array<Slot.Instance> | null;

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
        super(`div`, browser.Event_Grid());

        this.model = model;
        this.browser = browser;
        this.slots = null;
    }

    override async On_Life():
        Promise<Array<Event.Listener_Info>>
    {
        return [
            new Event.Listener_Info(
                {
                    event_name: new Event.Name(Event.Prefix.AFTER, "Selector_Slot_Item_Select"),
                    event_handler: this.After_Select.bind(this),
                    event_priority: 0,
                },
            ),
        ];
    }

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return `
            display: grid;
            grid-template-rows: 1fr;
            grid-template-columns: repeat(4,1fr);

            width: 100%;
            height: 100%;

            overflow-x: hidden;
            overflow-y: hidden;
        `;
    }

    override async On_Refresh():
        Promise<void>
    {
        await this.Kill_All_Children();

        this.slots = [];
        for (const slot_model of this.Model().Slots()) {
            const slot_view: Slot.Instance = new Slot.Instance(
                {
                    model: slot_model,
                    selector: this,
                },
            );
            this.slots.push(slot_view);
            this.Add_Child(slot_view);
        }
    }

    async After_Select(
        {
            item,
        }: {
            item: Slot.Item.Instance,
        },
    ):
        Promise<void>
    {
        await this.Refresh();
    }

    Model():
        Model.Instance
    {
        return this.model;
    }

    Browser():
        Browser.Instance
    {
        return this.browser;
    }
}
