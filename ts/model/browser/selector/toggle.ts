import * as Async from "../../../async.js";

import * as Selector from "./instance.js";

export class Instance extends Async.Instance
{
    private selector: Selector.Instance;
    private is_open: boolean;

    constructor(
        {
            selector,
            is_open,
        }: {
            selector: Selector.Instance,
            is_open: boolean,
        },
    )
    {
        super();

        this.selector = selector;
        this.is_open = is_open;
    }

    Selector():
        Selector.Instance
    {
        return this.selector;
    }

    Is_Open():
        boolean
    {
        return this.is_open;
    }

    Is_Closed():
        boolean
    {
        return !this.Is_Open();
    }

    Open():
        void
    {
        this.is_open = true;
    }

    Close():
        void
    {
        this.is_open = false;
    }
}
