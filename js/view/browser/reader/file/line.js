var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Entity from "../../../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ model, lines, }) {
        super({
            element: `div`,
            parent: lines,
            event_grid: lines.Event_Grid(),
        });
        this.model = model;
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model();
            const color = model.Text() === `` ?
                `transparent` :
                `inherit`;
            return `
            color: ${color};
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model();
            const text = model.Text();
            // I would like to avoid altering the text here,
            // probably need to figure out what can be done
            // with styling instead.
            if (text === ``) {
                this.Element().textContent = `_`;
            }
            else {
                this.Element().textContent = text;
            }
        });
    }
    Model() {
        return this.model;
    }
    Lines() {
        return this.Parent();
    }
}
