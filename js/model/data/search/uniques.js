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
    static Name() {
        return `Uniques.json`;
    }
    constructor({ search, }) {
        this.search = search;
        this.path = `${search.Path()}/${Instance.Name()}`;
        this.info = null;
    }
    Search() {
        return this.search;
    }
    Name() {
        return Instance.Name();
    }
    Path() {
        return this.path;
    }
    Info() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            if (this.info != null) {
                return this.info;
            }
            else {
                return {};
            }
        });
    }
    Download() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.info == null) {
                const response = yield fetch(Utils.Resolve_Path(this.Path()));
                if (response.ok) {
                    this.info = JSON.parse(yield response.text());
                }
            }
        });
    }
}
