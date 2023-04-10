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
    constructor({ language, branch, }) {
        this.language = language;
        this.name = branch.name;
        this.path = `${language.Path()}/${branch.name}`;
        this.dictionary = new Dictionary.Instance({
            version: this,
        });
        this.files = [];
        for (const file_leaf of branch.files) {
            this.files.push(new File.Instance({
                version: this,
                leaf: file_leaf,
            }));
        }
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
    Dictionary() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dictionary.Ready();
            return this.dictionary;
        });
    }
    File(file_name) {
        for (const file of this.files) {
            if (file.Name() === file_name) {
                return file;
            }
        }
        Utils.Assert(false, `Invalid file_name.`);
        return this.files[0];
    }
    File_Count() {
        return this.files.length;
    }
    File_At(file_index) {
        Utils.Assert(file_index > -1, `file_index must be greater than -1.`);
        Utils.Assert(file_index < this.File_Count(), `file_index must be less than file_count.`);
        return this.files[file_index];
    }
    Files() {
        return Array.from(this.files);
    }
}
