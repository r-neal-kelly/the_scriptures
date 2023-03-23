var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Entity from "../../../entity.js";
import * as Event from "../../../event.js";
import * as Slot from "./slot.js";
export class Instance extends Entity.Instance {
    constructor({ model, browser, }) {
        super(`div`, browser.Event_Grid());
        this.model = model;
        this.browser = browser;
        this.slots = null;
    }
    On_Life() {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                new Event.Listener_Info({
                    event_name: new Event.Name(Event.Prefix.AFTER, "Selector_Slot_Item_Select"),
                    event_handler: this.After_Select.bind(this),
                    event_priority: 0,
                }),
            ];
        });
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
            display: grid;
            grid-template-rows: 1fr;
            grid-template-columns: repeat(4, 1fr);

            width: 100%;
            height: 100%;

            overflow-x: hidden;
            overflow-y: hidden;
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Abort_All_Children();
            this.slots = [];
            for (const slot_model of this.Model().Slots()) {
                const slot_view = new Slot.Instance({
                    model: slot_model,
                    selector: this,
                });
                this.slots.push(slot_view);
                this.Adopt_Child(slot_view);
            }
        });
    }
    After_Select({ item, }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Refresh();
        });
    }
    Model() {
        return this.model;
    }
    Browser() {
        return this.browser;
    }
}
