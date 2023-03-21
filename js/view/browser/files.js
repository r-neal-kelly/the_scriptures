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
import * as File from "./file.js";
export class Instance extends Entity.Instance {
    constructor({ model, version, }) {
        super(`div`, version.Event_Grid());
        this.model = model;
        this.version = version;
        this.files = [];
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            for (const file_model of yield this.Model().Files()) {
                const file_view = new File.Instance({
                    model: file_model,
                    files: this,
                });
                this.files.push(file_view);
                this.Add_Child(file_view);
            }
        });
    }
    Model() {
        return this.model;
    }
    Version() {
        return this.version;
    }
}
