import * as Async from "../../async.js";

import * as Data from "../data.js";

import * as Selection from "./selection.js";
import * as Commander from "./commander.js";
import * as Body from "./body.js";

export class Instance extends Async.Instance
{
    private data: Data.Instance;
    private commander: Commander.Instance;
    private body: Body.Instance;

    constructor(
        {
            selection = new Selection.Name(
                {
                    book: `Jubilees`,
                    language: `English`,
                    version: `R. H. Charles`,
                    file: `Chapter 01.txt`,
                },
            ),
            selector_slot_order = Body.Selector.Slot.Order.BOOKS_LANGUAGES_VERSIONS,
            is_selector_open = true,
        }: {
            selection?: Selection.Name | Selection.Index | null,
            selector_slot_order?: Body.Selector.Slot.Order,
            is_selector_open?: boolean,
        } = {},
    )
    {
        super();

        this.data = new Data.Instance();
        this.commander = new Commander.Instance(
            {
                browser: this,
                is_selector_open: is_selector_open,
            },
        );
        this.body = new Body.Instance(
            {
                browser: this,
                selection: selection,
                selector_slot_order: selector_slot_order,
            },
        );

        this.Is_Ready_After(
            [
                this.data,
                this.commander,
                this.body,
            ],
        );
    }

    Data():
        Data.Instance
    {
        return this.data;
    }

    Commander():
        Commander.Instance
    {
        return this.commander;
    }

    Body():
        Body.Instance
    {
        return this.body;
    }
}
