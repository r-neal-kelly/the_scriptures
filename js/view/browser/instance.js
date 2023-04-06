var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "../../utils.js";
import * as Event from "../../event.js";
import * as Events from "../events.js";
import * as Entity from "../entity.js";
import * as Commander from "./commander.js";
import * as Body from "./body.js";
export class Instance extends Entity.Instance {
    constructor({ model, root, }) {
        super({
            element: `div`,
            parent: root,
            event_grid: root.Event_Grid(),
        });
        this.model = model;
    }
    On_Life() {
        this.Add_This_CSS(`
                .Browser {
                    display: grid;
                    grid-template-rows: 1fr;
                    grid-template-columns: auto 1fr;
                    justify-content: start;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;

                    color: white;
                }
            `);
        this.Add_Children_CSS(`
                .Body {
                    display: grid;
                    grid-template-rows: 1fr;
                    grid-template-columns: auto;
                    justify-content: start;

                    position: relative;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Selector {
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 1;

                    height: 100%;

                    background-color: hsl(0, 0%, 0%, 0.7);

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Slots {
                    display: grid;
                    grid-template-rows: 1fr;
                    grid-template-columns: repeat(4, 1fr);
                    justify-content: start;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Slot {
                    display: grid;
                    grid-template-rows: auto auto;
                    grid-template-columns: auto;
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

                    background-color: transparent;
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

                    background-color: transparent;
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

                .Reader {
                    z-index: 0;

                    width: 100%;

                    overflow-x: auto;
                    overflow-y: auto;
                }

                .Hidden {
                    display: none;
                }
            `);
        return [
            new Event.Listener_Info({
                event_name: new Event.Name(Event.Prefix.AFTER, Events.BROWSER_COMMANDER_PREVIOUS, this.ID()),
                event_handler: this.After_Browser_Commander_Previous,
                event_priority: 0,
            }),
            new Event.Listener_Info({
                event_name: new Event.Name(Event.Prefix.AFTER, Events.BROWSER_COMMANDER_NEXT, this.ID()),
                event_handler: this.After_Browser_Commander_Next,
                event_priority: 0,
            }),
        ];
    }
    On_Refresh() {
        if (!this.Has_Commander() ||
            !this.Has_Body()) {
            this.Abort_All_Children();
            new Commander.Instance({
                model: () => this.Model().Commander(),
                browser: this,
            });
            new Body.Instance({
                model: () => this.Model().Body(),
                browser: this,
            });
        }
    }
    On_Reclass() {
        return [`Browser`];
    }
    After_Browser_Commander_Previous() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Refresh();
        });
    }
    After_Browser_Commander_Next() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Refresh();
        });
    }
    Model() {
        return this.model();
    }
    Root() {
        return this.Parent();
    }
    Has_Commander() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Commander.Instance);
    }
    Commander() {
        Utils.Assert(this.Has_Commander(), `Does not have a commander.`);
        return this.Child(0);
    }
    Has_Body() {
        return (this.Has_Child(1) &&
            this.Child(1) instanceof Body.Instance);
    }
    Body() {
        Utils.Assert(this.Has_Body(), `Does not have a body.`);
        return this.Child(1);
    }
}
