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
import * as Item from "./item.js";
export class Instance extends Entity.Instance {
    constructor({ model, selector, }) {
        super(`div`, selector.Event_Grid());
        this.model = model;
        this.selector = selector;
        this.items = null;
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
            width: 100%;

            overflow-x: auto;
            overflow-y: auto;
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Abort_All_Children();
            this.items = [];
            for (const item_model of this.Model().Items()) {
                const item_view = new Item.Instance({
                    model: item_model,
                    slot: this,
                });
                this.items.push(item_view);
                this.Adopt_Child(item_view);
            }
        });
    }
    Model() {
        return this.model;
    }
    Selector() {
        return this.selector;
    }
}
