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
import * as Part from "./part.js";
export class Instance extends Entity.Instance {
    constructor({ model, line, }) {
        super({
            element: `div`,
            parent: line,
            event_grid: line.Event_Grid(),
        });
        this.model = model;
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return ``;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            const model = this.Model();
            const target = model.Count();
            const current = this.Child_Count();
            const delta = target - current;
            if (delta < 0) {
                for (let idx = current, end = current + delta; idx > end;) {
                    idx -= 1;
                    this.Abort_Child(this.Child(idx));
                }
            }
            else if (delta > 0) {
                for (let idx = current, end = current + delta; idx < end; idx += 1) {
                    new Part.Instance({
                        model: () => this.Model().At(idx),
                        parts: this,
                    });
                }
            }
        });
    }
    Model() {
        return this.model();
    }
    Line() {
        return this.Parent();
    }
}
