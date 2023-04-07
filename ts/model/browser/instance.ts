import { Name } from "../../types.js";

import * as Entity from "../entity.js";
import * as Data from "../data.js";
import * as Selection from "./selection.js";
import * as Commander from "./commander.js";
import * as Body from "./body.js";

export class Instance extends Entity.Instance
{
    private static data: Data.Instance = Data.Singleton();

    static Data():
        Data.Instance
    {
        return this.data;
    }

    private commander: Commander.Instance;
    private body: Body.Instance;

    constructor(
        {
            selection = null,
            selector_slot_order = Body.Selector.Slot.Order.BOOKS_LANGUAGES_VERSIONS,
            is_selector_open = false,
        }: {
            selection?: Selection.Name | Selection.Index | null,
            selector_slot_order?: Body.Selector.Slot.Order,
            is_selector_open?: boolean,
        } = {},
    )
    {
        super();

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
                Instance.data,
                this.commander,
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
            this.Body().Selector().Slots().As_String();
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
            this.Body().Selector().Slots().As_Short_String();
        if (slots_as_short_string != null) {
            return slots_as_short_string;
        } else {
            return `Browser`;
        }
    }
}
