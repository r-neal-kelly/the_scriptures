import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { Name } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Browser from "../instance.js";
import { Order } from "./order.js";
import * as Slot from "./slot.js";

export class Instance
{
    private browser: Browser.Instance;
    private order: Order | null;
    private slots: Array<Slot.Instance>;

    constructor(
        {
            browser,
            order = null,
        }: {
            browser: Browser.Instance,
            order?: Order | null,
        },
    )
    {
        this.browser = browser;
        this.order = order;
        this.slots = [];
    }

    Browser():
        Browser.Instance
    {
        return this.browser;
    }

    Has_Order():
        boolean
    {
        return this.order != null;
    }

    Order():
        Order | null
    {
        return this.order;
    }

    async Reorder(
        order: Order,
    ):
        Promise<void>
    {
        // we probably should get the previously selected book, language, version, and file
        // and reset them as the currently selected item of each slot.
        // of course in the circumstance that one of them is not set,
        // we can default to setting the first of each slot, or perhaps we should pass in
        // to constructor, so it can more easily be loaded?
        // else we could have a Select_Slots method to pass in the four, after reorder?
        this.order = order;
        this.slots = [];

        let slot_types: Array<Slot.Type>;
        let slot_item_names: Array<Array<Name>>;
        if (order === Order.BOOK_LANGUAGE_VERSION) {
            slot_types = [
                Slot.Type.BOOK,
                Slot.Type.LANGUAGE,
                Slot.Type.VERSION,
            ];
            slot_item_names = [
                await this.Browser().Data().Book_Names(),
                await this.Browser().Data().Language_Names(),
                await this.Browser().Data().Version_Names(),
            ];
        } else if (order === Order.BOOK_VERSION_LANGUAGE) {
            slot_types = [
                Slot.Type.BOOK,
                Slot.Type.VERSION,
                Slot.Type.LANGUAGE,
            ];
            slot_item_names = [
                await this.Browser().Data().Book_Names(),
                await this.Browser().Data().Version_Names(),
                await this.Browser().Data().Language_Names(),
            ];
        } else if (order === Order.LANGUAGE_BOOK_VERSION) {
            slot_types = [
                Slot.Type.LANGUAGE,
                Slot.Type.BOOK,
                Slot.Type.VERSION,
            ];
            slot_item_names = [
                await this.Browser().Data().Language_Names(),
                await this.Browser().Data().Book_Names(),
                await this.Browser().Data().Version_Names(),
            ];
        } else if (order === Order.LANGUAGE_VERSION_BOOK) {
            slot_types = [
                Slot.Type.LANGUAGE,
                Slot.Type.VERSION,
                Slot.Type.BOOK,
            ];
            slot_item_names = [
                await this.Browser().Data().Language_Names(),
                await this.Browser().Data().Version_Names(),
                await this.Browser().Data().Book_Names(),
            ];
        } else if (order === Order.VERSION_BOOK_LANGUAGE) {
            slot_types = [
                Slot.Type.VERSION,
                Slot.Type.BOOK,
                Slot.Type.LANGUAGE,
            ];
            slot_item_names = [
                await this.Browser().Data().Version_Names(),
                await this.Browser().Data().Book_Names(),
                await this.Browser().Data().Language_Names(),
            ];
        } else if (order === Order.VERSION_LANGUAGE_BOOK) {
            slot_types = [
                Slot.Type.VERSION,
                Slot.Type.LANGUAGE,
                Slot.Type.BOOK,
            ];
            slot_item_names = [
                await this.Browser().Data().Version_Names(),
                await this.Browser().Data().Language_Names(),
                await this.Browser().Data().Book_Names(),
            ];
        } else {
            Utils.Assert(
                false,
                `Unknown order.`,
            );

            slot_types = [];
            slot_item_names = [];
        }

        for (let idx = 0, end = slot_types.length; idx < end; idx += 1) {
            this.slots.push(
                new Slot.Instance(
                    {
                        selector: this,
                        type: slot_types[idx],
                        item_names: slot_item_names[idx],
                    },
                ),
            );
        }
    }

    Slot_Count():
        Count
    {
        Utils.Assert(
            this.Has_Order(),
            `Must have an order to get a slot_count.`,
        );

        return this.slots.length;
    }

    Slot(
        slot_type: Slot.Type,
    ):
        Slot.Instance
    {
        Utils.Assert(
            this.Has_Order(),
            `Must have an order to get a slot.`,
        );

        for (const slot of this.slots) {
            if (slot.Type() === slot_type) {
                return slot;
            }
        }

        Utils.Assert(
            false,
            `Unknown slot_type.`,
        );

        return this.slots[0];
    }

    Slot_At(
        slot_index: Index,
    ):
        Slot.Instance
    {
        Utils.Assert(
            this.Has_Order(),
            `Must have an order to get a slot.`,
        );
        Utils.Assert(
            slot_index > -1,
            `slot_index must be greater than -1.`,
        );
        Utils.Assert(
            slot_index < this.Slot_Count(),
            `slot_index must be less than slot_count.`,
        );

        return this.slots[slot_index];
    }
}
