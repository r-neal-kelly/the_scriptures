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
import * as Event from "../../../event.js";
import * as Entity from "../../../entity.js";
import * as Selector from "./selector.js";
import * as Reader from "./reader.js";
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
                event_name: new Event.Name(Event.Prefix.AFTER, `Selector_Slot_Item_Select`, `${this.Browser().ID()}`),
                event_handler: this.After_Selector_Slot_Item_Select,
                event_priority: 0,
            }),
        ];
    }
    On_Refresh() {
        if (!this.Has_Selector() ||
            !this.Has_Reader()) {
            this.Abort_All_Children();
            new Selector.Instance({
                model: () => this.Model().Selector(),
                body: this,
            });
            new Reader.Instance({
                model: () => this.Model().Reader(),
                body: this,
            });
        }
    }
    On_Reclass() {
        return [`Body`];
    }
    After_Selector_Slot_Item_Select() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Refresh();
        });
    }
    Model() {
        return this.model();
    }
    Browser() {
        return this.Parent();
    }
    Has_Selector() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Selector.Instance);
    }
    Selector() {
        Utils.Assert(this.Has_Selector(), `Does not have a selector.`);
        return this.Child(0);
    }
    Has_Reader() {
        return (this.Has_Child(1) &&
            this.Child(1) instanceof Reader.Instance);
    }
    Reader() {
        Utils.Assert(this.Has_Reader(), `Does not have a reader.`);
        return this.Child(1);
    }
}
