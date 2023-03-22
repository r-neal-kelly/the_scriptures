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
    constructor({ model, slot, }) {
        super(`div`, slot.Event_Grid());
        this.model = model;
        this.slot = slot;
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
            display: flex;

            width: 100%;
            height: 100%;

            overflow-x: hidden;
            overflow-y: hidden;

            color: white;

            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-elect: none;
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            this.Element().textContent = this.Model().Name();
        });
    }
    Model() {
        return this.model;
    }
}
