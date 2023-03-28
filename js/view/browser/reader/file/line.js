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
import * as Entity from "../../../../entity.js";
import * as Parts from "./parts.js";
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
            const display = model.Text().Is_Centered() ?
                `flex` :
                `block`;
            const color = model.Text().Value() === `` ?
                `transparent` :
                `inherit`;
            return `
            display: ${display};
            flex-wrap: wrap;
            justify-content: center;

            color: ${color};
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model();
            if (!this.Has_Parts()) {
                this.Abort_All_Children();
                new Parts.Instance({
                    model: () => this.Model().Parts(),
                    line: this,
                });
            }
        });
    }
    Model() {
        return this.model();
    }
    Lines() {
        return this.Parent();
    }
    Has_Parts() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Parts.Instance);
    }
    Parts() {
        Utils.Assert(this.Has_Parts(), `Doesn't have parts.`);
        return this.Child(0);
    }
}
