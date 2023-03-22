import * as Async from "../../async.js";

import * as Data from "./data.js"
import * as Selector from "./selector.js";

export class Instance extends Async.Instance
{
    private data: Data.Instance;
    private selector: Selector.Instance;

    constructor()
    {
        super();

        this.data = new Data.Instance(
            {
                browser: this,
            },
        );
        this.selector = new Selector.Instance(
            {
                browser: this,
                order: Selector.Order.BOOKS_LANGUAGES_VERSIONS,
            },
        );

        this.Add_Dependent(this.selector);
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
