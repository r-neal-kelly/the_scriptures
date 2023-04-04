var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Event from "../../../../event.js";
import * as Entity from "../../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ model, bar, }) {
        super({
            element: `div`,
            parent: bar,
            event_grid: bar.Event_Grid(),
        });
        this.model = model;
    }
    On_Life() {
        return [
            new Event.Listener_Info({
                event_name: new Event.Name(Event.Prefix.AFTER, `Selector_Slot_Item_Select`, this.Bar().Window().View().ID()),
                event_handler: this.After_Selector_Slot_Item_Select,
                event_priority: 0,
            }),
        ];
    }
    On_Refresh() {
        this.Element().textContent = this.Model().Value();
    }
    On_Reclass() {
        return [`Title`];
    }
    After_Selector_Slot_Item_Select() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Refresh();
        });
    }
    Model() {
        return this.model();
    }
    Bar() {
        return this.Parent();
    }
}
