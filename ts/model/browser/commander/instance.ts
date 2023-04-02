import * as Async from "../../../async.js";

import * as Browser from "../instance.js";

export class Instance extends Async.Instance
{
    private browser: Browser.Instance;
    private is_selector_open: boolean;

    constructor(
        {
            browser,
            is_selector_open,
        }: {
            browser: Browser.Instance,
            is_selector_open: boolean,
        },
    )
    {
        super();

        this.browser = browser;
        this.is_selector_open = is_selector_open;
    }

    Browser():
        Browser.Instance
    {
        return this.browser;
    }

    Is_Selector_Open():
        boolean
    {
        return this.is_selector_open;
    }

    Is_Selector_Closed():
        boolean
    {
        return !this.Is_Selector_Open();
    }

    Open_Selector():
        void
    {
        this.is_selector_open = true;
    }

    Close_Selector():
        void
    {
        this.is_selector_open = false;
    }

    Toggle_Selector():
        void
    {
        if (this.Is_Selector_Open()) {
            this.Close_Selector();
        } else {
            this.Open_Selector();
        }
    }
}
