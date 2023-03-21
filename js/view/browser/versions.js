var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Entity from "../../entity.js";
import * as Version from "./version.js";
export class Instance extends Entity.Instance {
    constructor({ model, language, }) {
        super(`div`, language.Event_Grid());
        this.model = model;
        this.language = language;
        this.versions = [];
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            for (const version_model of yield this.Model().Versions()) {
                const version_view = new Version.Instance({
                    model: version_model,
                    versions: this,
                });
                this.versions.push(version_view);
                this.Add_Child(version_view);
            }
        });
    }
    Model() {
        return this.model;
    }
    Language() {
        return this.language;
    }
}
