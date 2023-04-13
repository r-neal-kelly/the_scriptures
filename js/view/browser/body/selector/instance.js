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
import * as Entity from "../../../entity.js";
import * as Slots from "./slots.js";
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
                event_name: new Event.Name(Event.Prefix.AFTER, `Selector_Toggle`, this.Body().Browser().ID()),
                event_handler: this.After_Selector_Toggle,
                event_priority: 0,
            }),
        ];
    }
    On_Refresh() {
        if (!this.Has_Slots()) {
            this.Abort_All_Children();
            new Slots.Instance({
                model: () => this.Model().Slots(),
                selector: this,
            });
        }
    }
    On_Reclass() {
        return [`Selector`];
    }
    After_Selector_Toggle() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Refresh();
        });
    }
    Model() {
        return this.model();
    }
    Body() {
        return this.Parent();
    }
    Has_Slots() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Slots.Instance);
    }
    Slots() {
        Utils.Assert(this.Has_Slots(), `Does not have slots.`);
        return this.Child(0);
    }
}
