var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "../../../../utils.js";
import * as Data from "../../../data.js";
import * as Entity from "../../../entity.js";
import * as Selection from "../../selection.js";
import * as Slot from "./slot.js";
export class Instance extends Entity.Instance {
    static Max_Count() {
        return Instance.MAX_SLOT_COUNT;
    }
    static Slot_To_Data_Type(slot_type) {
        if (slot_type === Slot.Type.BOOKS) {
            return Data.Type.BOOKS;
        }
        else if (slot_type === Slot.Type.LANGUAGES) {
            return Data.Type.LANGUAGES;
        }
        else if (slot_type === Slot.Type.VERSIONS) {
            return Data.Type.VERSIONS;
        }
        else if (slot_type === Slot.Type.FILES) {
            return Data.Type.FILES;
        }
        else {
            Utils.Assert(false, `Invalid slot_type.`);
            return Data.Type.BOOKS;
        }
    }
    constructor({ selector, order, selection = null, }) {
        super();
        this.selector = selector;
        this.order = order;
        this.first_selection = selection;
        this.slots = [];
        this.Add_Dependencies([
            Data.Singleton(),
        ]);
    }
    Selector() {
        return this.selector;
    }
    Order() {
        return this.order;
    }
    Reorder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            // we probably should get the previously selected book, language, version, and file
            // and reset them as the currently selected item of each slot.
            // else we could have a Select_Slots method to pass in the four, after reorder?
        });
    }
    Count() {
        return this.slots.length;
    }
    Has(slot) {
        return this.slots.includes(slot);
    }
    Has_Type(slot_type) {
        for (const slot of this.slots) {
            if (slot.Type() === slot_type) {
                return true;
            }
        }
        return false;
    }
    From_Type(slot_type) {
        for (const slot of this.slots) {
            if (slot.Type() === slot_type) {
                return slot;
            }
        }
        Utils.Assert(false, `Does not have slot with that type.`);
        return this.slots[0];
    }
    At(slot_index) {
        Utils.Assert(slot_index > -1, `slot_index must be greater than -1.`);
        Utils.Assert(slot_index < this.Count(), `slot_index must be less than slot_count.`);
        return this.slots[slot_index];
    }
    Array() {
        return Array.from(this.slots);
    }
    Types() {
        const order = this.Order();
        const slot_types = [];
        if (order === Slot.Order.BOOKS_LANGUAGES_VERSIONS) {
            slot_types.push(Slot.Type.BOOKS);
            slot_types.push(Slot.Type.LANGUAGES);
            slot_types.push(Slot.Type.VERSIONS);
        }
        else if (order === Slot.Order.BOOKS_VERSIONS_LANGUAGES) {
            slot_types.push(Slot.Type.BOOKS);
            slot_types.push(Slot.Type.VERSIONS);
            slot_types.push(Slot.Type.LANGUAGES);
        }
        else if (order === Slot.Order.LANGUAGES_BOOKS_VERSIONS) {
            slot_types.push(Slot.Type.LANGUAGES);
            slot_types.push(Slot.Type.BOOKS);
            slot_types.push(Slot.Type.VERSIONS);
        }
        else if (order === Slot.Order.LANGUAGES_VERSIONS_BOOKS) {
            slot_types.push(Slot.Type.LANGUAGES);
            slot_types.push(Slot.Type.VERSIONS);
            slot_types.push(Slot.Type.BOOKS);
        }
        else if (order === Slot.Order.VERSIONS_BOOKS_LANGUAGES) {
            slot_types.push(Slot.Type.VERSIONS);
            slot_types.push(Slot.Type.BOOKS);
            slot_types.push(Slot.Type.LANGUAGES);
        }
        else if (order === Slot.Order.VERSIONS_LANGUAGES_BOOKS) {
            slot_types.push(Slot.Type.VERSIONS);
            slot_types.push(Slot.Type.LANGUAGES);
            slot_types.push(Slot.Type.BOOKS);
        }
        else {
            Utils.Assert(false, `Unknown slot_type.`);
        }
        slot_types.push(Slot.Type.FILES);
        Utils.Assert(slot_types.length === Instance.Max_Count(), `slot_types must have all types.`);
        return slot_types;
    }
    Push() {
        return __awaiter(this, void 0, void 0, function* () {
            const max_slot_count = Instance.Max_Count();
            const slot_count = this.Count();
            Utils.Assert(slot_count < max_slot_count, `All slots have been pushed already.`);
            const slot_index = slot_count;
            const slot_type = this.Types()[slot_index];
            const slot_query = this.Array().map(function (slot, slot_index) {
                let query_name;
                if (slot_index === 0 &&
                    slot_count === 0) {
                    query_name = null;
                }
                else {
                    Utils.Assert(slot.Items().Has_Selected(), `To push a new slot, each previous slot must have a selected item.`);
                    query_name = slot.Items().Selected().Name();
                }
                return new Data.Query.Type_And_Name({
                    type: Instance.Slot_To_Data_Type(slot.Type()),
                    name: query_name,
                });
            }.bind(this));
            slot_query.push(new Data.Query.Type_And_Name({
                type: Instance.Slot_To_Data_Type(slot_type),
                name: null,
            }));
            const slot_item_names = Data.Singleton().Names(slot_query);
            const slot_item_files = slot_type === Slot.Type.FILES ?
                Data.Singleton().Files({
                    book_name: this.Books().Items().Selected().Name(),
                    language_name: this.Languages().Items().Selected().Name(),
                    version_name: this.Versions().Items().Selected().Name(),
                }) :
                null;
            this.slots.push(new Slot.Instance({
                slots: this,
                index: slot_index,
                type: slot_type,
                item_names: slot_item_names,
                item_files: slot_item_files,
            }));
        });
    }
    Pop() {
        this.slots.pop();
    }
    Has_Books() {
        return this.Has_Type(Slot.Type.BOOKS);
    }
    Books() {
        Utils.Assert(this.Has_Books(), `Doesn't have books.`);
        return this.From_Type(Slot.Type.BOOKS);
    }
    Has_Languages() {
        return this.Has_Type(Slot.Type.LANGUAGES);
    }
    Languages() {
        Utils.Assert(this.Has_Languages(), `Doesn't have languages.`);
        return this.From_Type(Slot.Type.LANGUAGES);
    }
    Has_Versions() {
        return this.Has_Type(Slot.Type.VERSIONS);
    }
    Versions() {
        Utils.Assert(this.Has_Versions(), `Doesn't have versions.`);
        return this.From_Type(Slot.Type.VERSIONS);
    }
    Has_Files() {
        return this.Has_Type(Slot.Type.FILES);
    }
    Files() {
        Utils.Assert(this.Has_Files(), `Doesn't have files.`);
        return this.From_Type(Slot.Type.FILES);
    }
    As_String() {
        const count = this.Count();
        if (count > 0) {
            let result = ``;
            for (let idx = 0, end = count; idx < end;) {
                const slot = this.At(idx);
                if (slot.Items().Has_Selected()) {
                    result += slot.Items().Selected().Title();
                }
                else {
                    result += slot.Title().Value();
                }
                idx += 1;
                if (idx < end) {
                    result += ` — `;
                }
            }
            return result;
        }
        else {
            return null;
        }
    }
    As_Short_String() {
        const count = this.Count();
        if (count > 0) {
            const slot = this.At(0);
            if (slot.Items().Has_Selected()) {
                return slot.Items().Selected().Title();
            }
            else {
                return slot.Title().Value();
            }
        }
        else {
            return null;
        }
    }
    Select_Item_Internally({ slot, }) {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(this.Has(slot), `The slot does not belong to this selector.`);
            if (slot.Type() === Slot.Type.FILES) {
                const file = Data.Singleton().File({
                    book_name: this.Books().Items().Selected().Name(),
                    language_name: this.Languages().Items().Selected().Name(),
                    version_name: this.Versions().Items().Selected().Name(),
                    file_name: this.Files().Items().Selected().Name(),
                });
                yield this.Selector().Body().Browser().Body().Reader().Open_File(file);
            }
            else if (this.At(this.Count() - 1) === slot) {
                yield this.Push();
                yield this.Selector().Body().Browser().Body().Reader().Open_File(null);
            }
            else {
                const book_name = this.Has_Books() && this.Books().Items().Has_Selected() ?
                    this.Books().Items().Selected().Name() :
                    null;
                const language_name = this.Has_Languages() && this.Languages().Items().Has_Selected() ?
                    this.Languages().Items().Selected().Name() :
                    null;
                const version_name = this.Has_Versions() && this.Versions().Items().Has_Selected() ?
                    this.Versions().Items().Selected().Name() :
                    null;
                const file_name = this.Has_Files() && this.Files().Items().Has_Selected() ?
                    this.Files().Items().Selected().Name() :
                    null;
                while (this.Count() > slot.Index() + 1) {
                    this.Pop();
                }
                yield this.Push();
                while (this.Count() < Instance.Max_Count()) {
                    const last_slot = this.At(this.Count() - 1);
                    let maybe_item = null;
                    if (last_slot.Type() === Slot.Type.BOOKS && book_name != null) {
                        maybe_item = last_slot.Items().Maybe_From(book_name);
                    }
                    else if (last_slot.Type() === Slot.Type.LANGUAGES && language_name != null) {
                        maybe_item = last_slot.Items().Maybe_From(language_name);
                    }
                    else if (last_slot.Type() === Slot.Type.VERSIONS && version_name != null) {
                        maybe_item = last_slot.Items().Maybe_From(version_name);
                    }
                    if (maybe_item != null) {
                        yield maybe_item.Select();
                    }
                    else {
                        return;
                    }
                }
                const last_slot = this.At(this.Count() - 1);
                if (last_slot.Type() === Slot.Type.FILES && file_name != null) {
                    const maybe_item = last_slot.Items().Maybe_From(file_name);
                    if (maybe_item != null) {
                        yield maybe_item.Select();
                    }
                    else {
                        return;
                    }
                }
            }
        });
    }
    Select(selection) {
        return __awaiter(this, void 0, void 0, function* () {
            const types = this.Types();
            for (let idx = 0, end = Instance.Max_Count(); idx < end; idx += 1) {
                if (idx === this.Count()) {
                    yield this.Push();
                }
                const type = types[idx];
                if (type === Slot.Type.BOOKS) {
                    yield this.Books().Items().From(selection.Book()).Select();
                }
                else if (type === Slot.Type.LANGUAGES) {
                    yield this.Languages().Items().From(selection.Language()).Select();
                }
                else if (type === Slot.Type.VERSIONS) {
                    yield this.Versions().Items().From(selection.Version()).Select();
                }
                else if (type === Slot.Type.FILES) {
                    yield this.Files().Items().From(selection.File()).Select();
                }
            }
        });
    }
    Select_At(selection) {
        return __awaiter(this, void 0, void 0, function* () {
            const types = this.Types();
            for (let idx = 0, end = Instance.Max_Count(); idx < end; idx += 1) {
                if (idx === this.Count()) {
                    yield this.Push();
                }
                const type = types[idx];
                if (type === Slot.Type.BOOKS) {
                    yield this.Books().Items().At(selection.Book()).Select();
                }
                else if (type === Slot.Type.LANGUAGES) {
                    yield this.Languages().Items().At(selection.Language()).Select();
                }
                else if (type === Slot.Type.VERSIONS) {
                    yield this.Versions().Items().At(selection.Version()).Select();
                }
                else if (type === Slot.Type.FILES) {
                    yield this.Files().Items().At(selection.File()).Select();
                }
            }
        });
    }
    After_Dependencies_Are_Ready() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.first_selection instanceof Selection.Name) {
                yield this.Select(this.first_selection);
            }
            else if (this.first_selection instanceof Selection.Index) {
                yield this.Select_At(this.first_selection);
            }
            else {
                yield this.Push();
            }
        });
    }
}
Instance.MAX_SLOT_COUNT = 4;
