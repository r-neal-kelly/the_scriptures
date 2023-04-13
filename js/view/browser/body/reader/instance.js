var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "../../../../utils.js";
import * as Event from "../../../../event.js";
import * as Events from "../../../events.js";
import * as Entity from "../../../entity.js";
import * as File from "./file.js";
export class Instance extends Entity.Instance {
    constructor({ model, body, }) {
        super({
            element: `div`,
            parent: body,
            event_grid: body.Event_Grid(),
        });
        this.model = model;
    }
    On_Life() {
        return [
            new Event.Listener_Info({
                event_name: new Event.Name(Event.Prefix.AFTER, `Selector_Slot_Item_Select`, this.Body().Browser().ID()),
                event_handler: this.After_Selector_Slot_Item_Select,
                event_priority: 10,
            }),
            new Event.Listener_Info({
                event_name: new Event.Name(Event.Prefix.AFTER, Events.BROWSER_COMMANDER_PREVIOUS, this.Body().Browser().ID()),
                event_handler: () => this.Element().scrollTo(0, 0),
                event_priority: 10,
            }),
            new Event.Listener_Info({
                event_name: new Event.Name(Event.Prefix.AFTER, Events.BROWSER_COMMANDER_NEXT, this.Body().Browser().ID()),
                event_handler: () => this.Element().scrollTo(0, 0),
                event_priority: 10,
            }),
        ];
    }
    On_Refresh() {
        if (!this.Has_File()) {
            this.Abort_All_Children();
            new File.Instance({
                model: () => this.Model().File(),
                reader: this,
            });
        }
    }
    On_Reclass() {
        return [`Reader`];
    }
    After_Selector_Slot_Item_Select() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Element().scrollTo(0, 0);
        });
    }
    Model() {
        return this.model();
    }
    Body() {
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
