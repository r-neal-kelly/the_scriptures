import * as Async from "../../../async.js";

import * as Browser from "../instance.js";
import * as Selection from "../../data/selection.js";
import * as Selector from "../../selector.js";
import * as Font_Selector from "../../font_selector.js";
import * as Reader from "./reader.js";

export class Instance extends Async.Instance
{
    private browser: Browser.Instance;
    private selector: Selector.Instance;
    private font_selector: Font_Selector.Instance;
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
                slot_order: selector_slot_order,
                does_smart_item_selection: true,
                selection: selection,
            },
        );
        this.font_selector = new Font_Selector.Instance();
        this.reader = new Reader.Instance(
            {
                body: this,
            },
        );

        this.Add_Dependencies(
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

    Font_Selector():
        Font_Selector.Instance
    {
        return this.font_selector;
    }

    Reader():
        Reader.Instance
    {
        return this.reader;
    }

    override async After_Dependencies_Are_Ready():
        Promise<void>
    {
        await this.Reader().Refresh_File();
    }
}
