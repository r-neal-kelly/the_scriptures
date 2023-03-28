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
import * as Entity from "../../../entity.js";
import * as Event from "../../../event.js";
import * as File from "./file.js";
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
        if (this.model.Has_File()) {
            if (!this.Has_File()) {
                new File.Instance({
                    model: () => this.Model().File(),
                    reader: this,
                });
            }
        }
        else {
            if (this.Has_File()) {
                this.Abort_Child(this.File());
            }
        }
        this.Element().scrollTo(0, 0);
    }
    On_Restyle() {
        return `
            width: 100%;
            
            overflow-x: auto;
            overflow-y: auto;
        `;
    }
    After_Selector_Slot_Item_Select() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Refresh();
        });
    }
    Model() {
        return this.model;
    }
    Browser() {
        return this.Parent();
    }
    Has_File() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof File.Instance);
    }
    File() {
        Utils.Assert(this.Has_File(), `Doesn't have file.`);
        return this.Child(0);
    }
}
