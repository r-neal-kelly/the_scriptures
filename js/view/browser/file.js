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
import * as Entity from "../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ model, files, }) {
        super(`div`, files.Event_Grid());
        this.model = model;
        this.files = files;
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            this.Add_Child(new Line({ text: this.Model().Name() }));
            this.Add_Child(new Line({ text: `` }));
            const file_response = yield fetch(Utils.Resolve_Path(this.Model().Path()));
            if (file_response.ok) {
                const file_text = yield file_response.text();
                for (const file_line of file_text.split(/\r?\n/g)) {
                    this.Add_Child(new Line({ text: file_line }));
                }
                this.Add_Child(new Line({ text: `` }));
            }
        });
    }
    Model() {
        return this.model;
    }
    Files() {
        return this.files;
    }
}
// this class is temporary, for testing
class Line extends Entity.Instance {
    constructor({ text, }) {
        super(`div`, new Event.Grid());
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