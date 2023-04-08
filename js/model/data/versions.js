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
import * as Version from "./version.js";
export class Instance {
    constructor({ language, }) {
        this.language = language;
        this.name = `Versions`;
        this.path = `${language.Path()}/${this.name}`;
        this.info = null;
        this.versions = [];
        this.is_downloading = false;
    }
    Language() {
        return this.language;
    }
    Name() {
        return this.name;
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
                return ({
                    names: [],
                });
            }
        });
    }
    Count() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            return this.versions.length;
        });
    }
    At(version_index) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            Utils.Assert(version_index > -1, `version_index must be greater than -1.`);
            Utils.Assert(version_index < (yield this.Count()), `version_index must be less than version_count.`);
            return this.versions[version_index];
        });
    }
    Get(version_name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            for (const version of this.versions) {
                if (version.Name() === version_name) {
                    return version;
                }
            }
            Utils.Assert(false, `Invalid version_name.`);
            return this.versions[0];
        });
    }
    Array() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            return Array.from(this.versions);
        });
    }
    Download() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.is_downloading) {
                yield Utils.Wait_Milliseconds(1);
            }
            this.is_downloading = true;
            if (this.info == null) {
                const response = yield fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
                if (response.ok) {
                    this.info = JSON.parse(yield response.text());
                    for (const name of this.info.names) {
                        this.versions.push(new Version.Instance({
                            versions: this,
                            name: name,
                        }));
                    }
                }
            }
            this.is_downloading = false;
        });
    }
}
