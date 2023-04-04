var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Entity from "../../../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ items, index, name, file, }) {
        super();
        this.items = items;
        this.index = index;
        this.name = name;
        this.file = file;
        this.Is_Ready_After([]);
    }
    Items() {
        return this.items;
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
        return (this.Items().Has_Selected() &&
            this.Items().Selected() === this);
    }
    Select() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Items().Select(this);
        });
    }
}
