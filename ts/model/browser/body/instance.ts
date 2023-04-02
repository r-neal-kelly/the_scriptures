import * as Async from "../../../async.js";

import * as Browser from "../instance.js";
import * as Selection from "../selection.js";
import * as Selector from "./selector.js";
import * as Reader from "./reader.js";

export class Instance extends Async.Instance
{
    private browser: Browser.Instance;
    private selector: Selector.Instance;
    private reader: Reader.Instance;

    constructor(
        {
            browser,
            selection = null,
            selector_slot_order,
        }: {
            browser: Browser.Instance,
            selection?: Selection.Name | Selection.Index | null,
            selector_slot_order: Selector.Slot.Order,
        }
    )
    {
        super();

        this.browser = browser;
        this.selector = new Selector.Instance(
            {
                body: this,
                slot_order: selector_slot_order,
                selection: selection,
            },
        );
        this.reader = new Reader.Instance(
            {
                body: this,
            },
        );

        this.Is_Ready_After(
            [
                this.selector,
                this.reader,
            ],
        );
    }

    Browser():
        Browser.Instance
    {
        return this.browser;
    }

    Selector():
        Selector.Instance
    {
        return this.selector;
    }

    Reader():
        Reader.Instance
    {
        return this.reader;
    }
}
