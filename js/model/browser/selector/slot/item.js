var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Instance {
    constructor({ slot, index, name, file, }) {
        this.slot = slot;
        this.index = index;
        this.name = name;
        this.file = file;
    }
    Slot() {
        return this.slot;
    }
    Index() {
        return this.index;
    }
    Name() {
        return this.name;
    }
    Title() {
        if (this.file != null) {
            return this.file.Title();
        }
        else {
            return this.name;
        }
    }
    Is_Selected() {
        return (this.Slot().Has_Selected_Item() &&
            this.Slot().Selected_Item() === this);
    }
    Select() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Slot().Select_Item_Internally(this);
        });
    }
}
