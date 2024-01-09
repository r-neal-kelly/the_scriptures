import * as Desktop from "../desktop.js";
import * as Open_Browser from "./open_browser.js";
import * as Open_Finder from "./open_finder.js";

export class Instance
{
    private desktop: Desktop.Instance;
    private open_browser: Open_Browser.Instance;
    private open_finder: Open_Finder.Instance;
    private is_open: boolean;

    constructor(
        {
            desktop,
        }: {
            desktop: Desktop.Instance,
        },
    )
    {
        this.desktop = desktop;
        this.open_browser = new Open_Browser.Instance(
            {
                menu: this,
            },
        );
        this.open_finder = new Open_Finder.Instance(
            {
                menu: this,
            },
        );
        this.is_open = false;
    }

    Desktop():
        Desktop.Instance
    {
        return this.desktop;
    }

    Open_Browser():
        Open_Browser.Instance
    {
        return this.open_browser;
    }

    Open_Finder():
        Open_Finder.Instance
    {
        return this.open_finder;
    }

    Is_Open():
        boolean
    {
        return this.is_open;
    }

    Is_Closed():
        boolean
    {
        return !this.is_open;
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
