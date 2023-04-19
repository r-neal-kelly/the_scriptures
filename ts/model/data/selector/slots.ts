import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { Name } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Data from "../../data.js";

import * as Entity from "../../entity.js";
import * as Selection from "../../data/selection.js";
import * as Selector from "./instance.js";
import * as Slot from "./slot.js";

export class Instance extends Entity.Instance
{
    private static MAX_SLOT_COUNT: Count = 4;

    static Max_Count():
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
    private first_selection: Selection.Name | Selection.Index | null;
    private slots: Array<Slot.Instance>;
    private selected_data_file: Data.File.Instance | null;

    constructor(
        {
            selector,
            order,
            selection = null,
        }: {
            selector: Selector.Instance,
            order: Slot.Order,
            selection?: Selection.Name | Selection.Index | null,
        },
    )
    {
        super();

        this.selector = selector;
        this.order = order;
        this.first_selection = selection;
        this.slots = [];
        this.selected_data_file = null;

        this.Add_Dependencies(
            [
                Data.Singleton(),
            ],
        );
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

    Reorder(
        order: Slot.Order,
    ):
        void
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
            slot_types.length === Instance.Max_Count(),
            `slot_types must have all types.`,
        );

        return slot_types;
    }

    private Push():
        void
    {
        const max_slot_count: Count = Instance.Max_Count();
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

        const slot_item_names: Array<Name> =
            Data.Singleton().Names(slot_query);
        const slot_item_files: Array<Data.File.Instance> | null =
            slot_type === Slot.Type.FILES ?
                Data.Singleton().Files(
                    {
                        book_name: this.Books().Items().Selected().Name(),
                        language_name: this.Languages().Items().Selected().Name(),
                        version_name: this.Versions().Items().Selected().Name(),
                    },
                ) :
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

    private Pop():
        void
    {
        this.slots.pop();
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

    Maybe_Selected_Data_File():
        Data.File.Instance | null
    {
        return this.selected_data_file;
    }

    As_String():
        string | null
    {
        const count: Count = this.Count();

        if (count > 0) {
            let result: string = ``;

            for (let idx = 0, end = count; idx < end;) {
                const slot: Slot.Instance = this.At(idx);
                if (slot.Items().Has_Selected()) {
                    result += slot.Items().Selected().Title();
                } else {
                    result += slot.Title().Value();
                }

                idx += 1;
                if (idx < end) {
                    result += ` — `;
                }
            }

            return result;
        } else {
            return null;
        }
    }

    As_Short_String():
        string | null
    {
        const count: Count = this.Count();

        if (count > 0) {
            const slot: Slot.Instance = this.At(0);
            if (slot.Items().Has_Selected()) {
                return slot.Items().Selected().Title();
            } else {
                return slot.Title().Value();
            }
        } else {
            return null;
        }
    }

    Select_Item_Internally(
        {
            slot,
        }: {
            slot: Slot.Instance,
        },
    ):
        void
    {
        Utils.Assert(
            this.Has(slot),
            `The slot does not belong to this selector.`,
        );

        if (slot.Type() === Slot.Type.FILES) {
            this.selected_data_file = Data.Singleton().File(
                {
                    book_name: this.Books().Items().Selected().Name(),
                    language_name: this.Languages().Items().Selected().Name(),
                    version_name: this.Versions().Items().Selected().Name(),
                    file_name: this.Files().Items().Selected().Name(),
                },
            );
        } else if (this.At(this.Count() - 1) === slot) {
            this.Push();
        } else {
            const book_name: Name | null = this.Has_Books() && this.Books().Items().Has_Selected() ?
                this.Books().Items().Selected().Name() :
                null;
            const language_name: Name | null = this.Has_Languages() && this.Languages().Items().Has_Selected() ?
                this.Languages().Items().Selected().Name() :
                null;
            const version_name: Name | null = this.Has_Versions() && this.Versions().Items().Has_Selected() ?
                this.Versions().Items().Selected().Name() :
                null;
            const file_name: Name | null = this.Has_Files() && this.Files().Items().Has_Selected() ?
                this.Files().Items().Selected().Name() :
                null;

            while (this.Count() > slot.Index() + 1) {
                this.Pop();
            }
            this.Push();

            while (this.Count() < Instance.Max_Count()) {
                const last_slot: Slot.Instance = this.At(this.Count() - 1);

                let maybe_item: Slot.Item.Instance | null = null;
                if (last_slot.Type() === Slot.Type.BOOKS && book_name != null) {
                    maybe_item = last_slot.Items().Maybe_From(book_name);
                } else if (last_slot.Type() === Slot.Type.LANGUAGES && language_name != null) {
                    maybe_item = last_slot.Items().Maybe_From(language_name);
                } else if (last_slot.Type() === Slot.Type.VERSIONS && version_name != null) {
                    maybe_item = last_slot.Items().Maybe_From(version_name);
                }

                if (maybe_item != null) {
                    maybe_item.Select();
                } else {
                    return;
                }
            }

            const last_slot: Slot.Instance = this.At(this.Count() - 1);
            if (last_slot.Type() === Slot.Type.FILES && file_name != null) {
                const maybe_item: Slot.Item.Instance | null =
                    last_slot.Items().Maybe_From(file_name);
                if (maybe_item != null) {
                    maybe_item.Select();
                } else {
                    return;
                }
            }
        }
    }

    Select(
        selection: Selection.Name,
    ):
        void
    {
        const types: Array<Slot.Type> = this.Types();
        for (let idx = 0, end = Instance.Max_Count(); idx < end; idx += 1) {
            if (idx === this.Count()) {
                this.Push();
            }

            const type: Slot.Type = types[idx];
            if (type === Slot.Type.BOOKS) {
                this.Books().Items().From(selection.Book()).Select();
            } else if (type === Slot.Type.LANGUAGES) {
                this.Languages().Items().From(selection.Language()).Select();
            } else if (type === Slot.Type.VERSIONS) {
                this.Versions().Items().From(selection.Version()).Select();
            } else if (type === Slot.Type.FILES) {
                this.Files().Items().From(selection.File()).Select();
            }
        }
    }

    Select_At(
        selection: Selection.Index,
    ):
        void
    {
        const types: Array<Slot.Type> = this.Types();
        for (let idx = 0, end = Instance.Max_Count(); idx < end; idx += 1) {
            if (idx === this.Count()) {
                this.Push();
            }

            const type: Slot.Type = types[idx];
            if (type === Slot.Type.BOOKS) {
                this.Books().Items().At(selection.Book()).Select();
            } else if (type === Slot.Type.LANGUAGES) {
                this.Languages().Items().At(selection.Language()).Select();
            } else if (type === Slot.Type.VERSIONS) {
                this.Versions().Items().At(selection.Version()).Select();
            } else if (type === Slot.Type.FILES) {
                this.Files().Items().At(selection.File()).Select();
            }
        }
    }

    override async After_Dependencies_Are_Ready():
        Promise<void>
    {
        if (this.first_selection instanceof Selection.Name) {
            this.Select(this.first_selection);
        } else if (this.first_selection instanceof Selection.Index) {
            this.Select_At(this.first_selection);
        } else {
            this.Push();
        }
    }
}
