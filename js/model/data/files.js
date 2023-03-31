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
import * as Dictionary from "./dictionary.js";
import * as File from "./file.js";
export class Instance {
    constructor({ version, }) {
        this.version = version;
        this.name = `Files`;
        this.path = `${version.Path()}/${this.name}`;
        this.info = null;
        this.dictionary = new Dictionary.Instance({
            files: this,
        });
        this.files = [];
    }
    Version() {
        return this.version;
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
    Dictionary() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            return this.dictionary;
        });
    }
    Count() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            return this.files.length;
        });
    }
    At(file_index) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            Utils.Assert(file_index > -1, `file_index must be greater than -1.`);
            Utils.Assert(file_index < (yield this.Count()), `file_index must be less than file_count.`);
            return this.files[file_index];
        });
    }
    Get(file_name) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            for (const file of this.files) {
                if (file.Name() === file_name) {
                    return file;
                }
            }
            Utils.Assert(false, `Invalid file_name.`);
            return this.files[0];
        });
    }
    Array() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            return Array.from(this.files);
        });
    }
    Download() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.info == null) {
                const response = yield fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
                if (response.ok) {
                    this.info = JSON.parse(yield response.text());
                    yield this.dictionary.Ready();
                    for (const name of this.info.names) {
                        this.files.push(new File.Instance({
                            files: this,
                            name: name,
                        }));
                    }
                }
            }
        });
    }
}
