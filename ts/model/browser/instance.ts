import * as Data from "./data.js"
import * as Selector from "./selector.js";

export class Instance
{
    private data: Data.Instance;
    private selector: Selector.Instance;

    constructor()
    {
        this.data = new Data.Instance(
            {
                browser: this,
            },
        );
        this.selector = new Selector.Instance(
            {
                browser: this,
                order: Selector.Order.BOOK_LANGUAGE_VERSION,
            },
        );
    }

    Data():
        Data.Instance
    {
        return this.data;
    }

    Selector():
        Selector.Instance
    {
        return this.selector;
    }
}
