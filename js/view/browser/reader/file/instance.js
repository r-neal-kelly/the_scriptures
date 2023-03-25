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
import * as Lines from "./lines.js";
export class Instance extends Entity.Instance {
    constructor({ model, reader, }) {
        super({
            element: `div`,
            parent: reader,
            event_grid: reader.Event_Grid()
        });
        this.model = model;
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
            width: 100%;
            padding: 0 4px;
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.Has_Lines()) {
                this.Abort_All_Children();
                new Lines.Instance({
                    model: this.Model().Lines(),
                    file: this,
                });
            }
        });
    }
    Model() {
        return this.model;
    }
    Has_Lines() {
        return (this.Has_Child(0) &&
            this.Child(0) instanceof Lines.Instance);
    }
    Lines() {
        Utils.Assert(this.Has_Lines(), `Doesn't have lines.`);
        return this.Child(0);
    }
}
