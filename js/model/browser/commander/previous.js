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
import * as Entity from "../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ commander, }) {
        super();
        this.commander = commander;
        this.Add_Dependencies([]);
    }
    Commander() {
        return this.commander;
    }
    Symbol() {
        return `<<`;
    }
    Can_Activate() {
        const slots = this.Commander().Browser().Body().Selector().Slots();
        return (slots.Has_Files() &&
            slots.Files().Items().Count() > 0);
    }
    Activate() {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(this.Can_Activate(), `Cannot be activated right now.`);
            const files = this.Commander().Browser().Body().Selector().Slots().Files().Items();
            const file_count = files.Count();
            if (files.Has_Selected()) {
                const current_file = files.Selected();
                if (current_file.Index() > 0) {
                    yield files.At(current_file.Index() - 1).Select();
                }
                else {
                    yield files.At(file_count - 1).Select();
                }
            }
            else {
                yield files.At(file_count - 1).Select();
            }
        });
    }
}
