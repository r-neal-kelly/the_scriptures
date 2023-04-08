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
export class Instance {
    constructor({ occurrences, name, }) {
        this.occurrences = occurrences;
        this.name = name;
        this.path = `${occurrences.Path()}/${name}`;
        this.title = name.replace(/\.[^.]*$/, ``);
        this.extension = name.replace(/^[^.]*\./, ``);
    }
    Occurrences() {
        return this.occurrences;
    }
    Name() {
        return this.name;
    }
    Path() {
        return this.path;
    }
    Title() {
        return this.title;
    }
    Extension() {
        return this.extension;
    }
    Maybe_JSON() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(Utils.Resolve_Path(this.Path()));
            if (response.ok) {
                return yield response.text();
            }
            else {
                return null;
            }
        });
    }
    Maybe_Info() {
        return __awaiter(this, void 0, void 0, function* () {
            const json = yield this.Maybe_JSON();
            if (json != null) {
                return JSON.parse(json);
            }
            else {
                return null;
            }
        });
    }
    Maybe_Part(uniques_part) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield this.Maybe_Info();
            if (info != null &&
                info.hasOwnProperty(uniques_part)) {
                return info[uniques_part];
            }
            else {
                return null;
            }
        });
    }
}
