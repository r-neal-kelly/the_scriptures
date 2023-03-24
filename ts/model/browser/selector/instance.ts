import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { Name } from "../../../types.js";

import * as Utils from "../../../utils.js";
import * as Async from "../../../async.js";

import * as Browser from "../instance.js";
import * as Data from "../data.js";
import { Order } from "./order.js";
import * as Slot from "./slot.js";

export class Instance extends Async.Instance
{
    private static MAX_SLOT_COUNT: Count = 4;

    private static Slot_To_Data_Type(
        slot_type: Slot.Type,
    ):
        Data.Type
    {
        if (slot_type === Slot.Type.BOOKS) {
            return Data.Type.BOOKS;
        } else if (slot_type === Slot.Type.LANGUAGES) {
            return Data.Type.LANGUAGES;
        } else if (slot_type === Slot.Type.VERSIONS) {
            return Data.Type.VERSIONS;
        } else if (slot_type === Slot.Type.FILES) {
            return Data.Type.FILES;
        } else {
            Utils.Assert(
                false,
                `Invalid slot_type.`,
            );

            return Data.Type.BOOKS;
        }
    }

    private browser: Browser.Instance;
    private order: Order;
    private slots: Array<Slot.Instance>;

    constructor(
        {
            browser,
            order,
        }: {
            browser: Browser.Instance,
            order: Order,
        },
    )
    {
        super();

        this.browser = browser;
        this.order = order;
        this.slots = [];
    }

    Browser():
        Browser.Instance
    {
        return this.browser;
    }

    Order():
        Order
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
        // else we could have a Select_Slots method to pass in the four, after reorder?
    }

    Max_Slot_Count():
        Count
    {
        return Instance.MAX_SLOT_COUNT;
    }

    Slot_Count():
        Count
    {
        return this.slots.length;
    }

    Has_Slot(
        slot: Slot.Instance,
    ):
        boolean
    {
        return this.slots.includes(slot);
    }

    Has_Slot_Type(
        slot_type: Slot.Type,
    ):
        boolean
    {
        for (const slot of this.slots) {
            if (slot.Type() === slot_type) {
                return true;
            }
        }

        return false;
    }

    Slot(
        slot_type: Slot.Type,
    ):
        Slot.Instance
    {
        for (const slot of this.slots) {
            if (slot.Type() === slot_type) {
                return slot;
            }
        }

        Utils.Assert(
            false,
            `Does not have slot with that type.`,
        );

        return this.slots[0];
    }

    Slot_At(
        slot_index: Index,
    ):
        Slot.Instance
    {
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

    Slots():
        Array<Slot.Instance>
    {
        return Array.from(this.slots);
    }

    Slot_Types():
        Array<Slot.Type>
    {
        const order: Order = this.Order();

        const slot_types: Array<Slot.Type> = [];
        if (order === Order.BOOKS_LANGUAGES_VERSIONS) {
            slot_types.push(Slot.Type.BOOKS);
            slot_types.push(Slot.Type.LANGUAGES);
            slot_types.push(Slot.Type.VERSIONS);
        } else if (order === Order.BOOKS_VERSIONS_LANGUAGES) {
            slot_types.push(Slot.Type.BOOKS);
            slot_types.push(Slot.Type.VERSIONS);
            slot_types.push(Slot.Type.LANGUAGES);
        } else if (order === Order.LANGUAGES_BOOKS_VERSIONS) {
            slot_types.push(Slot.Type.LANGUAGES);
            slot_types.push(Slot.Type.BOOKS);
            slot_types.push(Slot.Type.VERSIONS);
        } else if (order === Order.LANGUAGES_VERSIONS_BOOKS) {
            slot_types.push(Slot.Type.LANGUAGES);
            slot_types.push(Slot.Type.VERSIONS);
            slot_types.push(Slot.Type.BOOKS);
        } else if (order === Order.VERSIONS_BOOKS_LANGUAGES) {
            slot_types.push(Slot.Type.VERSIONS);
            slot_types.push(Slot.Type.BOOKS);
            slot_types.push(Slot.Type.LANGUAGES);
        } else if (order === Order.VERSIONS_LANGUAGES_BOOKS) {
            slot_types.push(Slot.Type.VERSIONS);
            slot_types.push(Slot.Type.LANGUAGES);
            slot_types.push(Slot.Type.BOOKS);
        } else {
            Utils.Assert(
                false,
                `Unknown slot_type.`,
            );
        }

        slot_types.push(Slot.Type.FILES);

        Utils.Assert(
            slot_types.length === this.Max_Slot_Count(),
            `slot_types must have all types.`,
        );

        return slot_types;
    }

    private async Push_Slot():
        Promise<void>
    {
        const max_slot_count: Count = this.Max_Slot_Count();
        const slot_count: Count = this.Slot_Count();

        Utils.Assert(
            slot_count < max_slot_count,
            `All slots have been pushed already.`,
        );

        const slot_index: Index = slot_count;
        const slot_type: Slot.Type = this.Slot_Types()[slot_index];
        const slot_query: Array<Data.Query.Type_And_Name> = this.Slots().map(
            function (
                this: Instance,
                slot: Slot.Instance,
                slot_index: Index,
            ):
                Data.Query.Type_And_Name
            {
                let query_name: Name | null;
                if (
                    slot_index === 0 &&
                    slot_count === 0
                ) {
                    query_name = null;
                } else {
                    Utils.Assert(
                        slot.Has_Selected_Item(),
                        `To push a new slot, each previous slot must have a selected item.`,
                    );

                    query_name = (slot.Selected_Item() as Slot.Item.Instance).Name();
                }

                return new Data.Query.Type_And_Name(
                    {
                        type: Instance.Slot_To_Data_Type(slot.Type()),
                        name: query_name,
                    },
                );
            }.bind(this),
        );

        slot_query.push(
            new Data.Query.Type_And_Name(
                {
                    type: Instance.Slot_To_Data_Type(slot_type),
                    name: null,
                },
            ),
        );

        this.slots.push(
            new Slot.Instance(
                {
                    selector: this,
                    index: slot_index,
                    type: slot_type,
                    item_names: await this.Browser().Data().Names(slot_query),
                },
            ),
        );
    }

    Has_Books():
        boolean
    {
        return this.Has_Slot_Type(Slot.Type.BOOKS);
    }

    Books():
        Slot.Instance
    {
        Utils.Assert(
            this.Has_Books(),
            `Doesn't have books.`,
        );

        return this.Slot(Slot.Type.BOOKS);
    }

    Has_Languages():
        boolean
    {
        return this.Has_Slot_Type(Slot.Type.LANGUAGES);
    }

    Languages():
        Slot.Instance
    {
        Utils.Assert(
            this.Has_Languages(),
            `Doesn't have languages.`,
        );

        return this.Slot(Slot.Type.LANGUAGES);
    }

    Has_Versions():
        boolean
    {
        return this.Has_Slot_Type(Slot.Type.VERSIONS);
    }

    Versions():
        Slot.Instance
    {
        Utils.Assert(
            this.Has_Versions(),
            `Doesn't have versions.`,
        );

        return this.Slot(Slot.Type.VERSIONS);
    }

    Has_Files():
        boolean
    {
        return this.Has_Slot_Type(Slot.Type.FILES);
    }

    Files():
        Slot.Instance
    {
        Utils.Assert(
            this.Has_Files(),
            `Doesn't have files.`,
        );

        return this.Slot(Slot.Type.FILES);
    }

    async Select_Item(
        type: Slot.Type,
        name: Name,
    ):
        Promise<void>
    {
    }

    async Select_Item_Internally(
        {
            slot,
            item,
        }: {
            slot: Slot.Instance,
            item: Slot.Item.Instance,
        },
    ):
        Promise<void>
    {
        Utils.Assert(
            this.Has_Slot(slot),
            `The slot does not belong to this selector.`,
        );

        // How are we going to handle when selecting item in non-files slot
        // while the files slot is open? Do we try to match it with the new
        // slots that might have to be created, or do we just unselect the
        // discarded slots?
        if (slot.Type() === Slot.Type.FILES) {
            const file: Data.File.Instance = await this.Browser().Data().File(
                {
                    book_name: this.Books().Selected_Item()?.Name(),
                    language_name: this.Languages().Selected_Item()?.Name(),
                    version_name: this.Versions().Selected_Item()?.Name(),
                    file_name: this.Files().Selected_Item()?.Name(),
                },
            );
            await this.Browser().Reader().Open_File(file);
        } else if (this.Slot_At(this.Slot_Count() - 1) === slot) {
            await this.Push_Slot();
        }
    }

    async Select_Items(
        {
            book_name,
            language_name,
            version_name,
            file_name,
        }: {
            book_name: Name,
            language_name: Name,
            version_name: Name,
            file_name: Name,
        },
    ):
        Promise<void>
    {
    }

    async Select_Items_At(
        {
            book_index,
            language_index,
            version_index,
            file_index,
        }: {
            book_index: Index,
            language_index: Index,
            version_index: Index,
            file_index: Index,
        },
    ):
        Promise<void>
    {
    }

    override async Ready():
        Promise<void>
    {
        await super.Ready();
        await this.Push_Slot();
    }
}
