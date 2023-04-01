import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { Name } from "../../../types.js";

import * as Utils from "../../../utils.js";
import * as Async from "../../../async.js";

import * as Data from "../../data.js";

import * as Selector from "./instance.js";
import * as Slot from "./slot.js";

export class Instance extends Async.Instance
{
    private static MAX_SLOT_COUNT: Count = 4;

    static Max_Slot_Count():
        Count
    {
        return Instance.MAX_SLOT_COUNT;
    }

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

    private selector: Selector.Instance;
    private order: Slot.Order;
    private slots: Array<Slot.Instance>;

    constructor(
        {
            selector,
            order,
        }: {
            selector: Selector.Instance,
            order: Slot.Order,
        },
    )
    {
        super();

        this.selector = selector;
        this.order = order;
        this.slots = [];
    }

    Selector():
        Selector.Instance
    {
        return this.selector;
    }

    Order():
        Slot.Order
    {
        return this.order;
    }

    async Reorder(
        order: Slot.Order,
    ):
        Promise<void>
    {
        // we probably should get the previously selected book, language, version, and file
        // and reset them as the currently selected item of each slot.
        // else we could have a Select_Slots method to pass in the four, after reorder?
    }

    Count():
        Count
    {
        return this.slots.length;
    }

    Has(
        slot: Slot.Instance,
    ):
        boolean
    {
        return this.slots.includes(slot);
    }

    Has_Type(
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

    From_Type(
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

    At(
        slot_index: Index,
    ):
        Slot.Instance
    {
        Utils.Assert(
            slot_index > -1,
            `slot_index must be greater than -1.`,
        );
        Utils.Assert(
            slot_index < this.Count(),
            `slot_index must be less than slot_count.`,
        );

        return this.slots[slot_index];
    }

    Array():
        Array<Slot.Instance>
    {
        return Array.from(this.slots);
    }

    Types():
        Array<Slot.Type>
    {
        const order: Slot.Order = this.Order();

        const slot_types: Array<Slot.Type> = [];
        if (order === Slot.Order.BOOKS_LANGUAGES_VERSIONS) {
            slot_types.push(Slot.Type.BOOKS);
            slot_types.push(Slot.Type.LANGUAGES);
            slot_types.push(Slot.Type.VERSIONS);
        } else if (order === Slot.Order.BOOKS_VERSIONS_LANGUAGES) {
            slot_types.push(Slot.Type.BOOKS);
            slot_types.push(Slot.Type.VERSIONS);
            slot_types.push(Slot.Type.LANGUAGES);
        } else if (order === Slot.Order.LANGUAGES_BOOKS_VERSIONS) {
            slot_types.push(Slot.Type.LANGUAGES);
            slot_types.push(Slot.Type.BOOKS);
            slot_types.push(Slot.Type.VERSIONS);
        } else if (order === Slot.Order.LANGUAGES_VERSIONS_BOOKS) {
            slot_types.push(Slot.Type.LANGUAGES);
            slot_types.push(Slot.Type.VERSIONS);
            slot_types.push(Slot.Type.BOOKS);
        } else if (order === Slot.Order.VERSIONS_BOOKS_LANGUAGES) {
            slot_types.push(Slot.Type.VERSIONS);
            slot_types.push(Slot.Type.BOOKS);
            slot_types.push(Slot.Type.LANGUAGES);
        } else if (order === Slot.Order.VERSIONS_LANGUAGES_BOOKS) {
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
            slot_types.length === Instance.Max_Slot_Count(),
            `slot_types must have all types.`,
        );

        return slot_types;
    }

    private async Push():
        Promise<void>
    {
        const max_slot_count: Count = Instance.Max_Slot_Count();
        const slot_count: Count = this.Count();

        Utils.Assert(
            slot_count < max_slot_count,
            `All slots have been pushed already.`,
        );

        const slot_index: Index = slot_count;
        const slot_type: Slot.Type = this.Types()[slot_index];
        const slot_query: Array<Data.Query.Type_And_Name> = this.Array().map(
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
                        slot.Items().Has_Selected(),
                        `To push a new slot, each previous slot must have a selected item.`,
                    );

                    query_name = slot.Items().Selected().Name();
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

        const slot_item_names: Array<Name> = await this.Selector().Browser().Data().Names(slot_query);
        const slot_item_files: Array<Data.File.Instance> | null =
            slot_type === Slot.Type.FILES ?
                await (
                    await this.Selector().Browser().Data().Files(
                        {
                            book_name: this.Books().Items().Selected().Name(),
                            language_name: this.Languages().Items().Selected().Name(),
                            version_name: this.Versions().Items().Selected().Name(),
                        },
                    )
                ).Array() :
                null;

        this.slots.push(
            new Slot.Instance(
                {
                    slots: this,
                    index: slot_index,
                    type: slot_type,
                    item_names: slot_item_names,
                    item_files: slot_item_files,
                },
            ),
        );
    }

    Has_Books():
        boolean
    {
        return this.Has_Type(Slot.Type.BOOKS);
    }

    Books():
        Slot.Instance
    {
        Utils.Assert(
            this.Has_Books(),
            `Doesn't have books.`,
        );

        return this.From_Type(Slot.Type.BOOKS);
    }

    Has_Languages():
        boolean
    {
        return this.Has_Type(Slot.Type.LANGUAGES);
    }

    Languages():
        Slot.Instance
    {
        Utils.Assert(
            this.Has_Languages(),
            `Doesn't have languages.`,
        );

        return this.From_Type(Slot.Type.LANGUAGES);
    }

    Has_Versions():
        boolean
    {
        return this.Has_Type(Slot.Type.VERSIONS);
    }

    Versions():
        Slot.Instance
    {
        Utils.Assert(
            this.Has_Versions(),
            `Doesn't have versions.`,
        );

        return this.From_Type(Slot.Type.VERSIONS);
    }

    Has_Files():
        boolean
    {
        return this.Has_Type(Slot.Type.FILES);
    }

    Files():
        Slot.Instance
    {
        Utils.Assert(
            this.Has_Files(),
            `Doesn't have files.`,
        );

        return this.From_Type(Slot.Type.FILES);
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
            this.Has(slot),
            `The slot does not belong to this selector.`,
        );

        // How are we going to handle when selecting item in non-files slot
        // while the files slot is open? Do we try to match it with the new
        // slots that might have to be created, or do we just unselect the
        // discarded slots?
        if (slot.Type() === Slot.Type.FILES) {
            const file: Data.File.Instance = await this.Selector().Browser().Data().File(
                {
                    book_name: this.Books().Items().Selected().Name(),
                    language_name: this.Languages().Items().Selected().Name(),
                    version_name: this.Versions().Items().Selected().Name(),
                    file_name: this.Files().Items().Selected().Name(),
                },
            );
            await this.Selector().Browser().Reader().Open_File(file);
        } else if (this.At(this.Count() - 1) === slot) {
            await this.Push();
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
        if (!this.Is_Ready()) {
            await super.Ready();
            await this.Push();
        }
    }
}
