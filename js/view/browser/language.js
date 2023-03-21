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
import * as Entity from "../../entity.js";
import * as Versions from "./versions.js";
export class Instance extends Entity.Instance {
    constructor({ model, languages, }) {
        super(`div`, languages.Event_Grid());
        this.model = model;
        this.languages = languages;
        this.versions = null;
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            this.versions = new Versions.Instance({
                model: this.Model().Versions(),
                language: this,
            });
            this.Add_Child(this.versions);
        });
    }
    Model() {
        return this.model;
    }
    Languages() {
        return this.languages;
    }
    Versions() {
        Utils.Assert(this.versions != null, `Does not have versions.`);
        return this.versions;
    }
}
