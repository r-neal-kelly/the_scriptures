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
import * as Files from "./files.js";
export class Instance extends Entity.Instance {
    constructor({ model, versions, }) {
        super(`div`, versions.Event_Grid());
        this.model = model;
        this.versions = versions;
        this.files = null;
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            this.files = new Files.Instance({
                model: this.Model().Files(),
                version: this,
            });
            this.Add_Child(this.files);
        });
    }
    Model() {
        return this.model;
    }
    Versions() {
        return this.versions;
    }
    Files() {
        Utils.Assert(this.files != null, `Does not have files.`);
        return this.files;
    }
}
