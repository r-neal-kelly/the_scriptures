import { Count } from "../../types.js";
import { Index } from "../../types.js";
import { Name } from "../../types.js";

import * as Utils from "../../utils.js";

import * as Entity from "../entity.js";
import * as Data from "../data.js";
import * as Settings from "./settings.js";
import * as Slot from "./slot.js";

export class Instance extends Entity.Instance
{
    private static MAX_SLOT_COUNT: Count = 4;

    static Max_Slot_Count():
        Count
    {
        return Instance.MAX_SLOT_COUNT;
    }

    private static Slot_Type_To_Data_Type(
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

    private settings: Settings.Instance;
    private first_selection: Data.Selection.Name | Data.Selection.Index | null;
    private slots: Array<Slot.Instance>;

    constructor(
        {
            slot_order = Slot.Order.LANGUAGES_VERSIONS_BOOKS,
            does_smart_item_selection = true,
            selection = null,
        }: {
            slot_order?: Slot.Order,
            does_smart_item_selection?: boolean,
            selection?: Data.Selection.Name | Data.Selection.Index | null,
        },
    )
    {
        super();

        this.settings = new Settings.Instance(
            {
                selector: this,
                slot_order: slot_order,
                does_smart_item_selection: does_smart_item_selection,
            },
        );
        this.first_selection = selection;
        this.slots = [];

        this.Add_Dependencies(
            [
                Data.Singleton(),
            ],
        );
    }

    Settings():
        Settings.Instance
    {
        return this.settings;
    }

    __Set_Slot_Order__(
        slot_order_index: Index,
    ):
        void
    {
        if (this.Settings().Current_Slot_Order_Index() !== slot_order_index) {
            const current_selection: Data.Selection.Name = this.Selection_Name();

            while (this.Slot_Count() > 0) {
                this.Pop_Slot();
            }

            this.Settings().__Set_Current_Slot_Order_Index__(slot_order_index);
            this.Select_Item(current_selection);
        }
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

    Has_Slot_At_Index(
        slot_index: Index,
    ):
        boolean
    {
        Utils.Assert(
            slot_index > -1,
            `slot_index must be greater than -1.`,
        );

        return slot_index < this.Slot_Count();
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
        const slot_order: Slot.Order = this.Settings().Current_Slot_Order().Value();

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
                        type: Instance.Slot_Type_To_Data_Type(slot.Type()),
                        name: query_name,
                    },
                );
            }.bind(this),
        );
        slot_query.push(
            new Data.Query.Type_And_Name(
                {
                    type: Instance.Slot_Type_To_Data_Type(slot_type),
                    name: null,
                },
            ),
        );

        this.slots.push(
            new Slot.Instance(
                {
                    filter: this,
                    index: slot_index,
                    type: slot_type,
                    item_names: Data.Singleton().Names(slot_query),
                },
            ),
        );
    }

    private Pop_Slot():
        void
    {
        this.slots.pop();
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

    Has_Book():
        boolean
    {
        return (
            this.Has_Books() &&
            this.Books().Has_Selected_Item()
        );
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

    Has_Language():
        boolean
    {
        return (
            this.Has_Languages() &&
            this.Languages().Has_Selected_Item()
        );
    }

    Maybe_Selected_Language_Name():
        Name | null
    {
        if (this.Has_Languages()) {
            const languages: Slot.Instance = this.Languages();
            if (languages.Has_Selected_Item()) {
                return languages.Selected_Item().Name();
            } else {
                return null;
            }
        } else {
            return null;
        }
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

    Has_Version():
        boolean
    {
        return (
            this.Has_Versions() &&
            this.Versions().Has_Selected_Item()
        );
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

    Has_File():
        boolean
    {
        return (
            this.Has_Files() &&
            this.Files().Has_Selected_Item()
        );
    }

    File():
        Data.File.Instance
    {
        Utils.Assert(
            this.Has_File(),
            `Does not have file.`,
        );

        return Data.Singleton().File(
            {
                book_name: this.Books().Selected_Item().Name(),
                language_name: this.Languages().Selected_Item().Name(),
                version_name: this.Versions().Selected_Item().Name(),
                file_name: this.Files().Selected_Item().Name(),
            },
        );
    }

    Maybe_File():
        Data.File.Instance | null
    {
        if (this.Has_File()) {
            return this.File();
        } else {
            return null;
        }
    }

    Selection_Name():
        Data.Selection.Name
    {
        return new Data.Selection.Name(
            {
                book: this.Has_Book() ?
                    this.Books().Selected_Item().Name() :
                    null,
                language: this.Has_Language() ?
                    this.Languages().Selected_Item().Name() :
                    null,
                version: this.Has_Version() ?
                    this.Versions().Selected_Item().Name() :
                    null,
                file: this.Has_File() ?
                    this.Files().Selected_Item().Name() :
                    null,
            },
        );
    }

    Selection_Index():
        Data.Selection.Index
    {
        return new Data.Selection.Index(
            {
                book: this.Has_Book() ?
                    this.Books().Selected_Item().Index() :
                    null,
                language: this.Has_Language() ?
                    this.Languages().Selected_Item().Index() :
                    null,
                version: this.Has_Version() ?
                    this.Versions().Selected_Item().Index() :
                    null,
                file: this.Has_File() ?
                    this.Files().Selected_Item().Index() :
                    null,
            },
        );
    }

    File_Or_Versions():
        Data.File.Instance | Array<Data.Version.Instance>
    {
        if (this.Has_File()) {
            return this.File();
        } else {
            let book_names: Array<Name> | null = null;
            let language_names: Array<Name> | null = null;
            let version_names: Array<Name> | null = null;

            if (this.Has_Books()) {
                const books: Slot.Instance = this.Books();
                if (books.Has_Selected_Item()) {
                    book_names = [books.Selected_Item().Name()];
                }
            }
            if (this.Has_Languages()) {
                const languages: Slot.Instance = this.Languages();
                if (languages.Has_Selected_Item()) {
                    language_names = [languages.Selected_Item().Name()];
                }
            }
            if (this.Has_Versions()) {
                const versions: Slot.Instance = this.Versions();
                if (versions.Has_Selected_Item()) {
                    version_names = [versions.Selected_Item().Name()];
                }
            }

            return Data.Singleton().Versions(
                {
                    book_names: book_names,
                    language_names: language_names,
                    version_names: version_names,
                },
            );
        }
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
                    result += slot.Selected_Item().Name();
                } else {
                    result += slot.Name();
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
                return slot.Selected_Item().Name();
            } else {
                return slot.Name();
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

        if (slot.Type() !== Slot.Type.FILES) {
            if (this.Slot_At_Index(this.Slot_Count() - 1) === slot) {
                this.Push_Slot();
            } else if (this.Settings().Does_Smart_Item_Selection()) {
                const book_name: Name | null =
                    this.Has_Book() ?
                        this.Books().Selected_Item().Name() :
                        null;
                const language_name: Name | null =
                    this.Has_Language() ?
                        this.Languages().Selected_Item().Name() :
                        null;
                const version_name: Name | null =
                    this.Has_Version() ?
                        this.Versions().Selected_Item().Name() :
                        null;
                const file_name: Name | null =
                    this.Has_File() ?
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
            } else {
                while (this.Slot_Count() > slot.Index() + 1) {
                    this.Pop_Slot();
                }
                this.Push_Slot();
            }
        }
    }

    Select_Item(
        selection: Data.Selection.Name,
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
                if (selection.Has_Book()) {
                    this.Books().Item_From_Name(selection.Book()).Select();
                } else {
                    break;
                }
            } else if (type === Slot.Type.LANGUAGES) {
                if (selection.Has_Language()) {
                    this.Languages().Item_From_Name(selection.Language()).Select();
                } else {
                    break;
                }
            } else if (type === Slot.Type.VERSIONS) {
                if (selection.Has_Version()) {
                    this.Versions().Item_From_Name(selection.Version()).Select();
                } else {
                    break;
                }
            } else if (type === Slot.Type.FILES) {
                if (selection.Has_File()) {
                    this.Files().Item_From_Name(selection.File()).Select();
                } else {
                    break;
                }
            }
        }
    }

    Select_Item_At(
        selection: Data.Selection.Index,
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
                if (selection.Has_Book()) {
                    this.Books().Item_At_Index(selection.Book()).Select();
                } else {
                    break;
                }
            } else if (type === Slot.Type.LANGUAGES) {
                if (selection.Has_Language()) {
                    this.Languages().Item_At_Index(selection.Language()).Select();
                } else {
                    break;
                }
            } else if (type === Slot.Type.VERSIONS) {
                if (selection.Has_Version()) {
                    this.Versions().Item_At_Index(selection.Version()).Select();
                } else {
                    break;
                }
            } else if (type === Slot.Type.FILES) {
                if (selection.Has_File()) {
                    this.Files().Item_At_Index(selection.File()).Select();
                } else {
                    break;
                }
            }
        }
    }

    override async After_Dependencies_Are_Ready():
        Promise<void>
    {
        if (this.first_selection instanceof Data.Selection.Name) {
            this.Select_Item(this.first_selection);
        } else if (this.first_selection instanceof Data.Selection.Index) {
            this.Select_Item_At(this.first_selection);
        } else {
            this.Push_Slot();
        }
    }
}
