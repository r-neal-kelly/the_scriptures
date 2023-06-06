import * as Entity from "../../entity.js";
import * as Browser from "../instance.js";
import * as Allow_Errors from "./allow_errors.js";
import * as Font_Selector from "./font_selector.js";
import * as Previous from "./previous.js";
import * as Selector from "./selector.js";
import * as Next from "./next.js";

interface Selector_i
{
    Activate(): void;
    Deactivate(): void;
}

export class Instance extends Entity.Instance
{
    private browser: Browser.Instance;
    private allow_errors: Allow_Errors.Instance;
    private font_selector: Font_Selector.Instance;
    private previous: Previous.Instance;
    private selector: Selector.Instance;
    private next: Next.Instance;
    private current_selector: Selector_i | null;

    constructor(
        {
            browser,
            allow_errors,
            is_selector_open,
        }: {
            browser: Browser.Instance,
            allow_errors: boolean,
            is_selector_open: boolean,
        },
    )
    {
        super();

        this.browser = browser;
        this.allow_errors = new Allow_Errors.Instance(
            {
                commander: this,
                is_activated: allow_errors,
            },
        );
        this.font_selector = new Font_Selector.Instance(
            {
                commander: this,
                is_activated: false,
            },
        );
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
        this.current_selector = null;

        this.Add_Dependencies(
            [
                this.allow_errors,
                this.font_selector,
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

    Allow_Errors():
        Allow_Errors.Instance
    {
        return this.allow_errors;
    }

    Font_Selector():
        Font_Selector.Instance
    {
        return this.font_selector;
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

    __Set_Current_Selector__(
        selector: Selector_i | null,
    ):
        void
    {
        if (this.current_selector != null) {
            this.current_selector.Deactivate();
        }
        this.current_selector = selector;
    }

    __Unset_Current_Selector__():
        void
    {
        this.current_selector = null;
    }
}
