import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { Name } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Selector from "../instance.js";
import * as Slot from "../slot.js";
import * as Slot_Order from "./slot_order.js";

export class Instance
{
    private static slot_order_values: Array<Slot.Order> = [
        Slot.Order.LANGUAGES_VERSIONS_BOOKS,
        Slot.Order.LANGUAGES_BOOKS_VERSIONS,

        Slot.Order.VERSIONS_LANGUAGES_BOOKS,
        Slot.Order.VERSIONS_BOOKS_LANGUAGES,

        Slot.Order.BOOKS_LANGUAGES_VERSIONS,
        Slot.Order.BOOKS_VERSIONS_LANGUAGES,
    ];
    private static slot_order_names: Array<Name> = [
        `Languages | Versions | Books`,
        `Languages | Books | Versions`,

        `Versions | Languages | Books`,
        `Versions | Books | Languages`,

        `Books | Languages | Versions`,
        `Books | Versions | Languages`,
    ];

    private selector: Selector.Instance;
    private is_toggled: boolean;
    private slot_orders: Array<Slot_Order.Instance>;
    private current_slot_order_index: Index;
    private does_smart_item_selection: boolean;

    constructor(
        {
            selector,
            slot_order,
            does_smart_item_selection,
        }: {
            selector: Selector.Instance,
            slot_order: Slot.Order,
            does_smart_item_selection: boolean,
        },
    )
    {
        this.selector = selector;
        this.is_toggled = false;
        this.slot_orders = [];
        this.current_slot_order_index = Instance.slot_order_values.indexOf(slot_order);
        this.does_smart_item_selection = does_smart_item_selection;

        for (let idx = 0, end = Instance.slot_order_values.length; idx < end; idx += 1) {
            this.slot_orders.push(
                new Slot_Order.Instance(
                    {
                        settings: this,
                        index: idx,
                        value: Instance.slot_order_values[idx],
                        name: Instance.slot_order_names[idx],
                    },
                ),
            );
        }
    }

    Selector():
        Selector.Instance
    {
        return this.selector;
    }

    Is_Toggled():
        boolean
    {
        return this.is_toggled;
    }

    Toggle():
        void
    {
        this.is_toggled = !this.is_toggled;
    }

    Toggle_Symbol():
        string
    {
        if (this.Is_Toggled()) {
            return `^`;
        } else {
            return `v`;
        }
    }

    Slot_Orders():
        Array<Slot_Order.Instance>
    {
        return Array.from(this.slot_orders);
    }

    Slot_Order_Count():
        Count
    {
        return this.slot_orders.length;
    }

    Slot_Order(
        slot_order_index: Index,
    ):
        Slot_Order.Instance
    {
        Utils.Assert(
            slot_order_index > -1 &&
            slot_order_index < this.Slot_Order_Count(),
            `invalid slot_order_index: ${slot_order_index}`,
        );

        return this.slot_orders[slot_order_index];
    }

    Current_Slot_Order():
        Slot_Order.Instance
    {
        return this.slot_orders[this.current_slot_order_index];
    }

    Current_Slot_Order_Index():
        Index
    {
        return this.current_slot_order_index;
    }

    __Select_Current_Slot_Order_Index__(
        slot_order_index: Index,
    ):
        void
    {
        this.Selector().__Set_Slot_Order__(
            slot_order_index,
        );
    }

    __Set_Current_Slot_Order_Index__(
        slot_order_index: Index,
    ):
        void
    {
        this.current_slot_order_index = slot_order_index;
    }

    Does_Smart_Item_Selection():
        boolean
    {
        return this.does_smart_item_selection;
    }

    Set_Does_Smart_Item_Selection(
        does_smart_item_selection: boolean,
    ):
        void
    {
        this.does_smart_item_selection = does_smart_item_selection;
    }
}
