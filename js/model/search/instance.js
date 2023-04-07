var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Unicode from "../../unicode.js";
import * as Entity from "../entity.js";
import * as Data from "../data.js";
import * as Text from "../text.js";
export class Instance extends Entity.Instance {
    constructor({ versions, }) {
        super();
        this.searches = new Set();
        for (const version of versions) {
            this.Add_Version(version);
        }
        this.Is_Ready_After([
            Data.Singleton(),
        ]);
    }
    Add_Version(selection) {
        return __awaiter(this, void 0, void 0, function* () {
            this.searches.add(yield Data.Singleton().Search(selection));
        });
    }
    // For right now, we're just going to match parts exactly, but
    // we could add a mode that actually looks within parts, which
    // would be really useful for a lot of cases, e.g. ` ¶ ` should
    // be used to match `¶ `. The problem is that the uniques would
    // have to be searched completely, instead of just in the first
    // point array.
    Execute(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            for (const search of this.searches) {
                const text_query = new Text.Instance({
                    dictionary: (yield search.Version().Files().Dictionary()).Text_Dictionary(),
                    value: query,
                }).Line(0);
                for (let idx = 0, end = text_query.Macro_Part_Count(); idx < end; idx += 1) {
                    const part = text_query.Macro_Part(idx).Value();
                    const first_point = Unicode.First_Point(part);
                    const uniques = search.Uniques();
                    if (yield uniques.Has(first_point)) {
                        const parts = yield uniques.Get(first_point);
                        if (parts.includes(part)) {
                            const occurrences = search.Occurrences();
                            if (yield occurrences.Has(first_point)) {
                                const partition = yield occurrences.Get(first_point);
                                const info = yield partition.Info();
                                const part_info = info[part];
                                console.log(part_info);
                            }
                        }
                    }
                }
            }
            return results;
        });
    }
}
