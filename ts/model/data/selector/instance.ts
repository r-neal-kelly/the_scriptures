import { Count } from "../../../types.js";
import { Index } from "../../../types.js";
import { Name } from "../../../types.js";

import * as Utils from "../../../utils.js";

import * as Data from "../../data.js";

import * as Entity from "../../entity.js";
import * as Selection from "../../data/selection.js";
import * as Slot from "./slot.js";

export class Instance extends Entity.Instance
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

    private slot_order: Slot.Order;
    private first_selection: Selection.Name | Selection.Index | null;
    private slots: Array<Slot.Instance>;
    private selected_data_file: Data.File.Instance | null;

    constructor(
        {
            slot_order = Slot.Order.LANGUAGES_VERSIONS_BOOKS,
            selection = null,
        }: {
            slot_order?: Slot.Order,
            selection?: Selection.Name | Selection.Index | null,
        },
    )
    {
        super();

        this.slot_order = slot_order;
        this.first_selection = selection;
        this.slots = [];
        this.selected_data_file = null;

        this.Add_Dependencies(
            [
                Data.Singleton(),
            ],
        );
    }

    Slot_Order():
        Slot.Order
    {
        return this.slot_order;
    }

    Reorder_Slots(
        slot_order: Slot.Order,
    ):
        void
    {
        // we probably should get the previously selected book, language, version, and file
        // and reset them as the currently selected item of each slot.
        // else we could have a Select_Slots method to pass in the four, after reorder?
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

    Slot_From_Type(
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

    Slot_At_Index(
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
        const slot_order: Slot.Order = this.Slot_Order();

        const slot_types: Array<Slot.Type> = [];
        if (slot_order === Slot.Order.BOOKS_LANGUAGES_VERSIONS) {
            slot_types.push(Slot.Type.BOOKS);
            slot_types.push(Slot.Type.LANGUAGES);
            slot_types.push(Slot.Type.VERSIONS);
        } else if (slot_order === Slot.Order.BOOKS_VERSIONS_LANGUAGES) {
            slot_types.push(Slot.Type.BOOKS);
            slot_types.push(Slot.Type.VERSIONS);
            slot_types.push(Slot.Type.LANGUAGES);
        } else if (slot_order === Slot.Order.LANGUAGES_BOOKS_VERSIONS) {
            slot_types.push(Slot.Type.LANGUAGES);
            slot_types.push(Slot.Type.BOOKS);
            slot_types.push(Slot.Type.VERSIONS);
        } else if (slot_order === Slot.Order.LANGUAGES_VERSIONS_BOOKS) {
            slot_types.push(Slot.Type.LANGUAGES);
            slot_types.push(Slot.Type.VERSIONS);
            slot_types.push(Slot.Type.BOOKS);
        } else if (slot_order === Slot.Order.VERSIONS_BOOKS_LANGUAGES) {
            slot_types.push(Slot.Type.VERSIONS);
            slot_types.push(Slot.Type.BOOKS);
            slot_types.push(Slot.Type.LANGUAGES);
        } else if (slot_order === Slot.Order.VERSIONS_LANGUAGES_BOOKS) {
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

    private Push_Slot():
        void
    {
        const max_slot_count: Count = Instance.Max_Slot_Count();
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

                    query_name = slot.Selected_Item().Name();
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
                        book_name: this.Books().Selected_Item().Name(),
                        language_name: this.Languages().Selected_Item().Name(),
                        version_name: this.Versions().Selected_Item().Name(),
                    },
                ) :
                null;

        this.slots.push(
            new Slot.Instance(
                {
                    selector: this,
                    index: slot_index,
                    type: slot_type,
                    item_names: slot_item_names,
                    item_files: slot_item_files,
                },
            ),
        );
    }

    private Pop_Slot():
        void
    {
        this.slots.pop();
        this.selected_data_file = null;
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

        return this.Slot_From_Type(Slot.Type.BOOKS);
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

        return this.Slot_From_Type(Slot.Type.LANGUAGES);
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

        return this.Slot_From_Type(Slot.Type.VERSIONS);
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

        return this.Slot_From_Type(Slot.Type.FILES);
    }

    Maybe_Selected_Data_File():
        Data.File.Instance | null
    {
        return this.selected_data_file;
    }

    As_String():
        string | null
    {
        const count: Count = this.Slot_Count();

        if (count > 0) {
            let result: string = ``;

            for (let idx = 0, end = count; idx < end;) {
                const slot: Slot.Instance = this.Slot_At_Index(idx);
                if (slot.Has_Selected_Item()) {
                    result += slot.Selected_Item().Title();
                } else {
                    result += slot.Title();
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
        const count: Count = this.Slot_Count();

        if (count > 0) {
            const slot: Slot.Instance = this.Slot_At_Index(0);
            if (slot.Has_Selected_Item()) {
                return slot.Selected_Item().Title();
            } else {
                return slot.Title();
            }
        } else {
            return null;
        }
    }

    __Select_Item__(
        {
            slot,
            slot_item,
        }: {
            slot: Slot.Instance,
            slot_item: Slot.Item.Instance,
        },
    ):
        void
    {
        Utils.Assert(
            this.Has_Slot(slot),
            `The slot does not belong to this selector.`,
        );

        slot.__Select_Item__(
            {
                item: slot_item,
            },
        );

        if (slot.Type() === Slot.Type.FILES) {
            this.selected_data_file = Data.Singleton().File(
                {
                    book_name: this.Books().Selected_Item().Name(),
                    language_name: this.Languages().Selected_Item().Name(),
                    version_name: this.Versions().Selected_Item().Name(),
                    file_name: this.Files().Selected_Item().Name(),
                },
            );
        } else if (this.Slot_At_Index(this.Slot_Count() - 1) === slot) {
            this.Push_Slot();
        } else {
            const book_name: Name | null = this.Has_Books() && this.Books().Has_Selected_Item() ?
                this.Books().Selected_Item().Name() :
                null;
            const language_name: Name | null = this.Has_Languages() && this.Languages().Has_Selected_Item() ?
                this.Languages().Selected_Item().Name() :
                null;
            const version_name: Name | null = this.Has_Versions() && this.Versions().Has_Selected_Item() ?
                this.Versions().Selected_Item().Name() :
                null;
            const file_name: Name | null = this.Has_Files() && this.Files().Has_Selected_Item() ?
                this.Files().Selected_Item().Name() :
                null;

            while (this.Slot_Count() > slot.Index() + 1) {
                this.Pop_Slot();
            }
            this.Push_Slot();

            while (this.Slot_Count() < Instance.Max_Slot_Count()) {
                const last_slot: Slot.Instance = this.Slot_At_Index(this.Slot_Count() - 1);

                let maybe_item: Slot.Item.Instance | null = null;
                if (last_slot.Type() === Slot.Type.BOOKS && book_name != null) {
                    maybe_item = last_slot.Maybe_Item_From_Name(book_name);
                } else if (last_slot.Type() === Slot.Type.LANGUAGES && language_name != null) {
                    maybe_item = last_slot.Maybe_Item_From_Name(language_name);
                } else if (last_slot.Type() === Slot.Type.VERSIONS && version_name != null) {
                    maybe_item = last_slot.Maybe_Item_From_Name(version_name);
                }

                if (maybe_item != null) {
                    maybe_item.Select();
                } else {
                    return;
                }
            }

            const last_slot: Slot.Instance = this.Slot_At_Index(this.Slot_Count() - 1);
            if (last_slot.Type() === Slot.Type.FILES && file_name != null) {
                const maybe_item: Slot.Item.Instance | null =
                    last_slot.Maybe_Item_From_Name(file_name);
                if (maybe_item != null) {
                    maybe_item.Select();
                } else {
                    return;
                }
            }
        }
    }

    Select_Item(
        selection: Selection.Name,
    ):
        void
    {
        const types: Array<Slot.Type> = this.Slot_Types();
        for (let idx = 0, end = Instance.Max_Slot_Count(); idx < end; idx += 1) {
            if (idx === this.Slot_Count()) {
                this.Push_Slot();
            }

            const type: Slot.Type = types[idx];
            if (type === Slot.Type.BOOKS) {
                this.Books().Item_From_Name(selection.Book()).Select();
            } else if (type === Slot.Type.LANGUAGES) {
                this.Languages().Item_From_Name(selection.Language()).Select();
            } else if (type === Slot.Type.VERSIONS) {
                this.Versions().Item_From_Name(selection.Version()).Select();
            } else if (type === Slot.Type.FILES) {
                this.Files().Item_From_Name(selection.File()).Select();
            }
        }
    }

    Select_Item_At(
        selection: Selection.Index,
    ):
        void
    {
        const types: Array<Slot.Type> = this.Slot_Types();
        for (let idx = 0, end = Instance.Max_Slot_Count(); idx < end; idx += 1) {
            if (idx === this.Slot_Count()) {
                this.Push_Slot();
            }

            const type: Slot.Type = types[idx];
            if (type === Slot.Type.BOOKS) {
                this.Books().Item_At_Index(selection.Book()).Select();
            } else if (type === Slot.Type.LANGUAGES) {
                this.Languages().Item_At_Index(selection.Language()).Select();
            } else if (type === Slot.Type.VERSIONS) {
                this.Versions().Item_At_Index(selection.Version()).Select();
            } else if (type === Slot.Type.FILES) {
                this.Files().Item_At_Index(selection.File()).Select();
            }
        }
    }

    override async After_Dependencies_Are_Ready():
        Promise<void>
    {
        if (this.first_selection instanceof Selection.Name) {
            this.Select_Item(this.first_selection);
        } else if (this.first_selection instanceof Selection.Index) {
            this.Select_Item_At(this.first_selection);
        } else {
            this.Push_Slot();
        }
    }
}
