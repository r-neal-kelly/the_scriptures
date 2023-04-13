var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Entity from "../entity.js";
export class Instance extends Entity.Instance {
    constructor({ model, tabs, }) {
        super({
            element: `div`,
            parent: tabs,
            event_grid: tabs.Event_Grid(),
        });
        this.model = model;
    }
    On_Life() {
        this.Element().addEventListener(`click`, this.On_Click.bind(this));
        return [];
    }
    On_Refresh() {
        this.Element().textContent = this.Model().Title();
    }
    On_Reclass() {
        const model = this.Model();
        const classes = [];
        classes.push(`Tab`);
        if (model.Window().Is_Active()) {
            classes.push(`Active_Tab`);
        }
        return classes;
    }
    On_Click() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Model().Tabs().Bar().Layout().Set_Active_Window(this.Model().Window());
            this.Tabs().Bar().Layout().Refresh();
        });
    }
    Model() {
        return this.model();
    }
    Tabs() {
        return this.Parent();
    }
}
