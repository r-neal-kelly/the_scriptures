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
import * as Entity from "../entity.js";
import * as Wall from "./wall.js";
import * as Bar from "./bar.js";
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
                .Layout {
                    display: grid;
                    grid-template-rows: 1fr auto;
                    grid-template-columns: auto;

                    width: 100%;
                    height: 100%;

                    overflow-x: hidden;
                    overflow-y: hidden;

                    color: white;
                }
            `);
        this.Add_Children_CSS(`
                .Wall {
                    display: grid;
                    grid-row-gap: 2px;
                    grid-column-gap: 2px;

                    width: 100%;
                    height: 100%;
                    padding: 0 2px;

                    overflow-x: hidden;
                    overflow-y: hidden;
                }

                .Window {
                    display: grid;
                    grid-template-rows: auto 1fr;
                    grid-template-columns: auto;

                    width: 100%;
                    height: 100%;

                    overflow-x: auto;
                    overflow-y: auto;

                    border-color: white;
                    border-style: solid;
                    border-width: 1px;
                }
            `);
        return [
            new Event.Listener_Info({
                event_name: new Event.Name(Event.Prefix.AFTER, `Window_Close`, this.ID()),
                event_handler: this.After_Window_Close,
                event_priority: 0,
            }),
        ];
    }
    On_Refresh() {
        if (!this.Has_Wall() ||
            !this.Has_Bar()) {
            this.Abort_All_Children();
            new Wall.Instance({
                model: () => this.Model().Wall(),
                layout: this,
            });
            new Bar.Instance({
                model: () => this.Model().Bar(),
                layout: this,
            });
        }
    }
    On_Reclass() {
        return [`Layout`];
    }
    After_Window_Close() {
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
    Has_Wall() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Wall.Instance);
    }
    Wall() {
        Utils.Assert(this.Has_Wall(), `Does not have a wall.`);
        return this.Child(0);
    }
    Has_Bar() {
        return (this.Has_Child(1) &&
            this.Child(1) instanceof Bar.Instance);
    }
    Bar() {
        Utils.Assert(this.Has_Bar(), `Does not have a bar.`);
        return this.Child(1);
    }
}
