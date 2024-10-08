import { Name } from "../../types.js";

import * as Async from "../../async.js";

import * as Selection from "../data/selection.js";
import * as Selector from "../selector.js";
import * as Commander from "./commander.js";
import * as Body from "./body.js";

export class Instance extends Async.Instance
{
    private commander: Commander.Instance;
    private body: Body.Instance;

    constructor(
        {
            selection = null,
            selector_slot_order = Selector.Slot.Order.LANGUAGES_VERSIONS_BOOKS,
            is_selector_open = false,
            allow_errors = false,
        }: {
            selection?: Selection.Name | Selection.Index | null,
            selector_slot_order?: Selector.Slot.Order,
            is_selector_open?: boolean,
            allow_errors?: boolean,
        } = {},
    )
    {
        super();

        this.commander = new Commander.Instance(
            {
                browser: this,
                is_selector_open: is_selector_open,
                allow_errors: allow_errors,
            },
        );
        this.body = new Body.Instance(
            {
                browser: this,
                selection: selection,
                selector_slot_order: selector_slot_order,
            },
        );

        this.Add_Dependencies(
            [
                this.body,
            ],
        );
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

    Title():
        Name
    {
        const slots_as_string: string | null =
            this.Body().Selector().As_String();
        if (slots_as_string != null) {
            return slots_as_string;
        } else {
            return `Browser`;
        }
    }

    Short_Title():
        Name
    {
        const slots_as_short_string: string | null =
            this.Body().Selector().As_Short_String();
        if (slots_as_short_string != null) {
            return slots_as_short_string;
        } else {
            return `Browser`;
        }
    }
}
