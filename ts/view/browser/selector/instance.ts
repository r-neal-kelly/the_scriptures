import * as Entity from "../../../entity.js";

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

    override async On_Restyle():
        Promise<Entity.Styles | string>
    {
        return ({
            "display": `grid`,

            "width": `100%`,
            "height": `100%`,

            "overflow-x": `hidden`,
            "overflow-y": `hidden`,

            "color": `white`,
        });
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
