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
        this.is_downloading = false;
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
    Has(first_point) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.Info()).hasOwnProperty(first_point);
        });
    }
    Get(first_point) {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(yield this.Has(first_point), `Doesn't have first_point.`);
            return (yield this.Info())[first_point];
        });
    }
    Download() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.is_downloading) {
                yield Utils.Wait_Milliseconds(1);
            }
            this.is_downloading = true;
            if (this.info == null) {
                const response = yield fetch(Utils.Resolve_Path(this.Path()));
                if (response.ok) {
                    this.info = JSON.parse(yield response.text());
                    for (const key of Object.keys(this.info)) {
                        Object.freeze(this.info[key]);
                    }
                    Object.freeze(this.info);
                }
            }
            this.is_downloading = false;
        });
    }
}
