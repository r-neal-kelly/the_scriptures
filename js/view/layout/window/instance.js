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
import * as Entity from "../../entity.js";
import * as Bar from "./bar.js";
export class Instance extends Entity.Instance {
    constructor({ model, wall, }) {
        super({
            element: `div`,
            parent: wall,
            event_grid: wall.Event_Grid(),
        });
        this.model = model;
    }
    On_Life() {
        this.Element().addEventListener(`click`, this.On_Click.bind(this));
        this.Refresh_After_Has_Model();
        return [];
    }
    On_Refresh() {
        const model = this.Model();
        if (model.Is_Ready()) {
            if (!this.Has_Bar() ||
                !this.Has_View()) {
                this.Abort_All_Children();
                this.Element().textContent = ``;
                new Bar.Instance({
                    model: () => this.Model().Bar(),
                    window: this,
                });
                new (this.Model().Program().View_Class())({
                    model: () => this.Model().Program().Model_Instance(),
                    root: this,
                });
            }
        }
    }
    On_Reclass() {
        return [`Window`];
    }
    On_Click() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Model().Wall().Layout().Set_Active_Window(this.Model());
            this.Wall().Layout().Refresh();
        });
    }
    Refresh_After_Has_Model() {
        return __awaiter(this, void 0, void 0, function* () {
            // Need to wait to make sure derived type's constructor is done.
            yield Utils.Wait_Milliseconds(1);
            while (this.Is_Alive() && !this.Model().Is_Ready()) {
                const element = this.Element();
                if (element.textContent === `Loading.`) {
                    element.textContent = `Loading..`;
                }
                else if (element.textContent === `Loading..`) {
                    element.textContent = `Loading...`;
                }
                else {
                    element.textContent = `Loading.`;
                }
                yield Utils.Wait_Milliseconds(200);
            }
            this.Wall().Layout().Refresh();
        });
    }
    Model() {
        return this.model();
    }
    Wall() {
        return this.Parent();
    }
    Has_Bar() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Bar.Instance);
    }
    Bar() {
        Utils.Assert(this.Has_Bar(), `Does not have a bar.`);
        return this.Child(0);
    }
    Has_View() {
        return (this.Has_Child(1) &&
            this.Child(1) instanceof this.Model().Program().View_Class());
    }
    View() {
        Utils.Assert(this.Has_View(), `Does not have a view.`);
        return this.Child(1);
    }
}
