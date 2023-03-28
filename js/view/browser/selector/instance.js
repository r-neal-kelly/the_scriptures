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
        super({
            element: `div`,
            parent: browser,
            event_grid: browser.Event_Grid(),
        });
        this.model = model;
    }
    On_Life() {
        return [
            new Event.Listener_Info({
                event_name: new Event.Name(Event.Prefix.AFTER, "Selector_Slot_Item_Select"),
                event_handler: this.After_Selector_Slot_Item_Select.bind(this),
                event_priority: 0,
            }),
        ];
    }
    On_Refresh() {
        const model = this.Model();
        const slot_count = model.Slot_Count();
        const child_count = this.Child_Count();
        const slot_delta = slot_count - child_count;
        if (slot_delta > 0) {
            for (let idx = child_count, end = slot_count; idx < end;) {
                new Slot.Instance({
                    model: model.Slot(idx),
                    selector: this,
                });
                idx += 1;
            }
        }
        else if (slot_delta < 0) {
            for (let idx = this.Child_Count(), end = 0; idx > end;) {
                idx -= 1;
                this.Abort_Child(this.Child(idx));
            }
        }
    }
    On_Restyle() {
        return `
            display: grid;
            grid-template-rows: 1fr;
            grid-template-columns: repeat(4, auto);
            justify-content: start;

            width: 100%;
            height: 100%;

            overflow-x: hidden;
            overflow-y: hidden;
        `;
    }
    After_Selector_Slot_Item_Select() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Refresh();
        });
    }
    Model() {
        return this.model;
    }
    Browser() {
        return this.Parent();
    }
}
