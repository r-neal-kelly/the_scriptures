import * as Entity from "../../entity.js";
import * as Browser from "../instance.js";
import * as Previous from "./previous.js";
import * as Selector from "./selector.js";
import * as Next from "./next.js";
import * as Allow_Errors from "./allow_errors.js";

export class Instance extends Entity.Instance
{
    private browser: Browser.Instance;
    private previous: Previous.Instance;
    private selector: Selector.Instance;
    private next: Next.Instance;
    private allow_errors: Allow_Errors.Instance;

    constructor(
        {
            browser,
            is_selector_open,
            allow_errors,
        }: {
            browser: Browser.Instance,
            is_selector_open: boolean,
            allow_errors: boolean,
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
        this.allow_errors = new Allow_Errors.Instance(
            {
                commander: this,
                is_activated: allow_errors,
            },
        );

        this.Add_Dependencies(
            [
                this.previous,
                this.selector,
                this.next,
                this.allow_errors,
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

    Allow_Errors():
        Allow_Errors.Instance
    {
        return this.allow_errors;
    }
}
