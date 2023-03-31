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
import * as Toggle from "./toggle.js";
import * as Slots from "./slots.js";
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
        this.Add_This_CSS(`
                .Selector {
                    display: grid;
                    grid-template-rows: 1fr;
                    grid-template-columns: repeat(2, auto);
                    justify-content: start;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }
            `);
        this.Add_Children_CSS(`
                .Toggle {

                }
                
                .Slots {
                    display: grid;
                    grid-template-rows: 1fr;
                    grid-template-columns: repeat(4, auto);
                    justify-content: start;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Slot {
                    display: grid;
                    grid-template-rows: auto auto;
                    grid-template-columns: 1fr;
                    align-content: start;

                    width: 100%;
                    height: 100%;
                    padding: 0 3px;

                    border-color: white;
                    border-style: solid;
                    border-width: 0 1px 0 0;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Slot_Title {
                    width: 100%;
                
                    overflow-x: hidden;
                    overflow-y: hidden;

                    background-color: black;
                    color: white;

                    border-color: white;
                    border-style: solid;
                    border-width: 0 0 1px 0;

                    font-variant: small-caps;

                    cursor: default;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }

                .Slot_Items {
                    width: 100%;

                    padding: 2px 2px;

                    overflow-x: auto;
                    overflow-y: auto;
                }

                .Slot_Item {
                    width: 100%;
                    padding: 2px 2px;
                    
                    overflow-x: hidden;
                    overflow-y: hidden;

                    background-color: black;
                    color: white;

                    cursor: pointer;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
                
                .Slot_Item_Selected {
                    background-color: white;
                    color: black;
                }
            `);
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
        if (!this.Has_Toggle() ||
            !this.Has_Slots()) {
            this.Abort_All_Children();
            new Toggle.Instance({
                model: model.Toggle(),
                selector: this,
            });
            new Slots.Instance({
                model: model.Slots(),
                selector: this,
            });
        }
    }
    On_Reclass() {
        return [`Selector`];
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
    Has_Toggle() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Toggle.Instance);
    }
    Toggle() {
        Utils.Assert(this.Has_Toggle(), `Does not have toggle.`);
        return this.Child(0);
    }
    Has_Slots() {
        return (this.Has_Child(1) &&
            this.Child(1) instanceof Slots.Instance);
    }
    Slots() {
        Utils.Assert(this.Has_Slots(), `Does not have slots.`);
        return this.Child(1);
    }
}
