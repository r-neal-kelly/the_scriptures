var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Event from "../../../event.js";
import * as Entity from "../../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ model, reader, }) {
        super({
            element: `div`,
            parent: reader,
            event_grid: reader.Event_Grid()
        });
        this.model = model;
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Abort_All_Children();
            this.Adopt_Child(new Line({ text: this.Model().Data().Name() }));
            this.Adopt_Child(new Line({ text: `` }));
            for (const file_line of this.Model().Text().split(/\r?\n/g)) {
                this.Adopt_Child(new Line({ text: file_line }));
            }
            this.Adopt_Child(new Line({ text: `` }));
        });
    }
    Model() {
        return this.model;
    }
}
// this class needs to be moved to its own file
class Line extends Entity.Instance {
    constructor({ text, }) {
        super({
            element: `div`,
            parent: null,
            event_grid: new Event.Grid()
        });
        this.text = text;
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return ({
                "color": this.text === `` ?
                    `transparent` :
                    `inherit`,
            });
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.text === ``) {
                this.Element().textContent = `_`;
            }
            else {
                this.Element().textContent = this.text.replaceAll(/  /g, `  `);
            }
        });
    }
}
