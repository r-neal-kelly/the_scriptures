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
import * as Partition from "./partition.js";
export class Instance {
    static Name() {
        return `Occurrences`;
    }
    constructor({ search, }) {
        this.search = search;
        this.path = `${search.Path()}/${Instance.Name()}`;
        this.info = null;
        this.partitions = {};
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
                return ({
                    names: [],
                });
            }
        });
    }
    Has(first_point) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            return this.partitions.hasOwnProperty(first_point);
        });
    }
    Get(first_point) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Download();
            Utils.Assert(yield this.Has(first_point), `Doesn't have first_point.`);
            return this.partitions[first_point];
        });
    }
    Download() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.info == null) {
                const response = yield fetch(Utils.Resolve_Path(`${this.Path()}/Info.json`));
                if (response.ok) {
                    this.info = JSON.parse(yield response.text());
                    for (const name of this.info.names) {
                        const partition = new Partition.Instance({
                            occurrences: this,
                            name: name,
                        });
                        const first_point = String.fromCodePoint(Number.parseInt(partition.Title()));
                        this.partitions[first_point] = partition;
                    }
                }
            }
        });
    }
}
