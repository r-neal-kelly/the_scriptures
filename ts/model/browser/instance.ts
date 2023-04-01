import { Name } from "../../types.js";

import * as Async from "../../async.js";

import * as Data from "../data.js";

import * as Selection from "./selection.js";
import * as Selector from "./selector.js";
import * as Reader from "./reader.js";

export class Instance extends Async.Instance
{
    private data: Data.Instance;
    private selector: Selector.Instance;
    private reader: Reader.Instance;

    constructor(
        {
            selector_slot_order = Selector.Slot.Order.BOOKS_LANGUAGES_VERSIONS,
            selection = new Selection.Name(
                {
                    book: `Jubilees`,
                    language: `English`,
                    version: `R. H. Charles`,
                    file: `Chapter 01.txt`,
                },
            ),
        }: {
            selector_slot_order?: Selector.Slot.Order,
            selection?: Selection.Name | Selection.Index | null,
        } = {},
    )
    {
        super();

        this.data = new Data.Instance();
        this.selector = new Selector.Instance(
            {
                browser: this,
                is_open: true,
                slot_order: selector_slot_order,
                selection: selection,
            },
        );
        this.reader = new Reader.Instance(
            {
                browser: this,
            },
        );

        this.Is_Ready_After(
            [
                this.data,
                this.selector,
                this.reader,
            ],
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

    Reader():
        Reader.Instance
    {
        return this.reader;
    }
}
