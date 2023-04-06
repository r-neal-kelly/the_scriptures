import * as Entity from "../../entity.js";
import * as Browser from "../instance.js";
import * as Previous from "./previous.js";
import * as Selector from "./selector.js";
import * as Next from "./next.js";

export class Instance extends Entity.Instance
{
    private browser: Browser.Instance;
    private previous: Previous.Instance;
    private selector: Selector.Instance;
    private next: Next.Instance;

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
        this.previous = new Previous.Instance(
            {
                commander: this,
            },
        );
        this.selector = new Selector.Instance(
            {
                commander: this,
                is_activated: is_selector_open,
            },
        );
        this.next = new Next.Instance(
            {
                commander: this,
            },
        );

        this.Is_Ready_After(
            [
                this.previous,
                this.selector,
                this.next,
            ],
        );
    }

    Browser():
        Browser.Instance
    {
        return this.browser;
    }

    Previous():
        Previous.Instance
    {
        return this.previous;
    }

    Selector():
        Selector.Instance
    {
        return this.selector;
    }

    Next():
        Next.Instance
    {
        return this.next;
    }
}
