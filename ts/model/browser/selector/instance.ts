import * as Async from "../../../async.js";

import * as Browser from "../instance.js";
import * as Selection from "../selection.js";
import * as Toggle from "./toggle.js";
import * as Slots from "./slots.js";
import * as Slot from "./slot.js";

export class Instance extends Async.Instance
{
    private browser: Browser.Instance;
    private toggle: Toggle.Instance;
    private slots: Slots.Instance;

    constructor(
        {
            browser,
            is_open,
            slot_order,
            selection = null,
        }: {
            browser: Browser.Instance,
            is_open: boolean,
            slot_order: Slot.Order,
            selection?: Selection.Name | Selection.Index | null,
        },
    )
    {
        super();

        this.browser = browser;
        this.toggle = new Toggle.Instance(
            {
                selector: this,
                is_open: is_open,
            },
        );
        this.slots = new Slots.Instance(
            {
                selector: this,
                order: slot_order,
                selection: selection,
            }
        );

        this.Is_Ready_After(
            [
                this.toggle,
                this.slots,
            ],
        );
    }

    Browser():
        Browser.Instance
    {
        return this.browser;
    }

    Toggle():
        Toggle.Instance
    {
        return this.toggle;
    }

    Slots():
        Slots.Instance
    {
        return this.slots;
    }
}
