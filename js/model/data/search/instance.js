var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Unicode from "../../../unicode.js";
import * as Uniques from "./uniques.js";
import * as Occurrences from "./occurrences.js";
export class Instance {
    constructor({ version, }) {
        this.version = version;
        this.name = `Search`;
        this.path = `${version.Path()}/${this.name}`;
        this.uniques = new Uniques.Instance({
            search: this,
        });
        this.occurrences = new Occurrences.Instance({
            search: this,
        });
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
    Uniques() {
        return this.uniques;
    }
    Occurrences() {
        return this.occurrences;
    }
    Maybe_Partition(first_point) {
        return __awaiter(this, void 0, void 0, function* () {
            const uniques = this.Uniques();
            if (yield uniques.Has(first_point)) {
                const occurrences = this.Occurrences();
                if (yield occurrences.Has(first_point)) {
                    return yield occurrences.Get(first_point);
                }
                else {
                    return null;
                }
            }
            else {
                return null;
            }
        });
    }
    Maybe_Partition_Part(part) {
        return __awaiter(this, void 0, void 0, function* () {
            const partition = yield this.Maybe_Partition(Unicode.First_Point(part));
            if (partition) {
                return yield partition.Maybe_Part(part);
            }
            else {
                return null;
            }
        });
    }
}
