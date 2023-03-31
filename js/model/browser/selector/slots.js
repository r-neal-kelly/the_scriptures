var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "../../../utils.js";
import * as Async from "../../../async.js";
import * as Data from "../../data.js";
import * as Slot from "./slot.js";
export class Instance extends Async.Instance {
    static Max_Slot_Count() {
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
    constructor({ selector, order, }) {
        super();
        this.selector = selector;
        this.order = order;
        this.slots = [];
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
    Slot_Count() {
        return this.slots.length;
    }
    Has_Slot(slot) {
        return this.slots.includes(slot);
    }
    Has_Slot_Type(slot_type) {
        for (const slot of this.slots) {
            if (slot.Type() === slot_type) {
                return true;
            }
        }
        return false;
    }
    Slot(slot_type) {
        for (const slot of this.slots) {
            if (slot.Type() === slot_type) {
                return slot;
            }
        }
        Utils.Assert(false, `Does not have slot with that type.`);
        return this.slots[0];
    }
    Slot_At(slot_index) {
        Utils.Assert(slot_index > -1, `slot_index must be greater than -1.`);
        Utils.Assert(slot_index < this.Slot_Count(), `slot_index must be less than slot_count.`);
        return this.slots[slot_index];
    }
    Slots() {
        return Array.from(this.slots);
    }
    Slot_Types() {
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
        Utils.Assert(slot_types.length === Instance.Max_Slot_Count(), `slot_types must have all types.`);
        return slot_types;
    }
    Push_Slot() {
        return __awaiter(this, void 0, void 0, function* () {
            const max_slot_count = Instance.Max_Slot_Count();
            const slot_count = this.Slot_Count();
            Utils.Assert(slot_count < max_slot_count, `All slots have been pushed already.`);
            const slot_index = slot_count;
            const slot_type = this.Slot_Types()[slot_index];
            const slot_query = this.Slots().map(function (slot, slot_index) {
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
            const slot_item_names = yield this.Selector().Browser().Data().Names(slot_query);
            const slot_item_files = slot_type === Slot.Type.FILES ?
                yield (yield this.Selector().Browser().Data().Files({
                    book_name: this.Books().Items().Selected().Name(),
                    language_name: this.Languages().Items().Selected().Name(),
                    version_name: this.Versions().Items().Selected().Name(),
                })).Array() :
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
    Has_Books() {
        return this.Has_Slot_Type(Slot.Type.BOOKS);
    }
    Books() {
        Utils.Assert(this.Has_Books(), `Doesn't have books.`);
        return this.Slot(Slot.Type.BOOKS);
    }
    Has_Languages() {
        return this.Has_Slot_Type(Slot.Type.LANGUAGES);
    }
    Languages() {
        Utils.Assert(this.Has_Languages(), `Doesn't have languages.`);
        return this.Slot(Slot.Type.LANGUAGES);
    }
    Has_Versions() {
        return this.Has_Slot_Type(Slot.Type.VERSIONS);
    }
    Versions() {
        Utils.Assert(this.Has_Versions(), `Doesn't have versions.`);
        return this.Slot(Slot.Type.VERSIONS);
    }
    Has_Files() {
        return this.Has_Slot_Type(Slot.Type.FILES);
    }
    Files() {
        Utils.Assert(this.Has_Files(), `Doesn't have files.`);
        return this.Slot(Slot.Type.FILES);
    }
    Select_Item(type, name) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    Select_Item_Internally({ slot, item, }) {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(this.Has_Slot(slot), `The slot does not belong to this selector.`);
            // How are we going to handle when selecting item in non-files slot
            // while the files slot is open? Do we try to match it with the new
            // slots that might have to be created, or do we just unselect the
            // discarded slots?
            if (slot.Type() === Slot.Type.FILES) {
                const file = yield this.Selector().Browser().Data().File({
                    book_name: this.Books().Items().Selected().Name(),
                    language_name: this.Languages().Items().Selected().Name(),
                    version_name: this.Versions().Items().Selected().Name(),
                    file_name: this.Files().Items().Selected().Name(),
                });
                yield this.Selector().Browser().Reader().Open_File(file);
            }
            else if (this.Slot_At(this.Slot_Count() - 1) === slot) {
                yield this.Push_Slot();
            }
        });
    }
    Select_Items({ book_name, language_name, version_name, file_name, }) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    Select_Items_At({ book_index, language_index, version_index, file_index, }) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    Ready() {
        const _super = Object.create(null, {
            Ready: { get: () => super.Ready }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.Is_Ready()) {
                yield _super.Ready.call(this);
                yield this.Push_Slot();
            }
        });
    }
}
Instance.MAX_SLOT_COUNT = 4;
