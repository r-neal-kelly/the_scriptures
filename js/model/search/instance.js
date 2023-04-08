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
import * as Entity from "../entity.js";
import * as Data from "../data.js";
import * as Text from "../text.js";
import * as Result from "./result.js";
export class Instance extends Entity.Instance {
    constructor({ book_names = null, language_names = null, version_names = null, ignore_markup = true, align_on_word = true, respect_sequence = true, }) {
        super();
        this.book_names = book_names;
        this.language_names = language_names;
        this.version_names = version_names;
        this.ignore_markup = ignore_markup;
        this.align_on_word = align_on_word;
        this.respect_sequence = respect_sequence;
        this.searches = [];
        this.Is_Ready_After([
            Data.Singleton(),
        ]);
    }
    Set({ book_names = null, language_names = null, version_names = null, }) {
        return __awaiter(this, void 0, void 0, function* () {
            this.book_names = book_names != null ?
                Array.from(book_names) : null;
            this.language_names = language_names != null ?
                Array.from(language_names) : null;
            this.version_names = version_names != null ?
                Array.from(version_names) : null;
            yield this.Refresh_Searches();
        });
    }
    Refresh_Searches() {
        return __awaiter(this, void 0, void 0, function* () {
            this.searches = yield Data.Singleton().Searches({
                book_names: this.book_names,
                language_names: this.language_names,
                version_names: this.version_names,
            });
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
            Utils.Assert(!/\r?\n/.test(query), `query cannot have any newlines.`);
            const results = [];
            for (const search of this.searches) {
                const line = new Text.Instance({
                    dictionary: (yield search.Version().Files().Dictionary()).Text_Dictionary(),
                    value: query,
                }).Line(0);
                if (line.Macro_Part_Count() > 0) {
                    let matches = {};
                    const first_part = line.Macro_Part(0);
                    Utils.Assert(!this.ignore_markup || !first_part.Is_Command(), `A query cannot contain a command while ignoring markup.`);
                    const first_partition_part = yield search.Maybe_Partition_Part(first_part.Value());
                    if (first_partition_part) {
                        for (const file_index of Object.keys(first_partition_part)) {
                            matches[file_index] = {};
                            for (const line_index of Object.keys(first_partition_part[file_index])) {
                                matches[file_index][line_index] = {};
                                for (const part_index of first_partition_part[file_index][line_index]) {
                                    matches[file_index][line_index][part_index.toString()] = part_index + 1;
                                }
                            }
                        }
                        const commands = this.ignore_markup ?
                            yield search.Maybe_Partition_Parts(Text.Part.Command.Brace.OPEN) :
                            null;
                        function Adjusted_End_Part_Index(file_index, line_index, first_part_index) {
                            let end_part_index = matches[file_index][line_index][first_part_index];
                            if (commands != null) {
                                for (const command of Object.keys(commands)) {
                                    if (commands[command].hasOwnProperty(file_index)) {
                                        if (commands[command][file_index].hasOwnProperty(line_index)) {
                                            if (commands[command][file_index][line_index].includes(end_part_index)) {
                                                end_part_index += 1;
                                            }
                                        }
                                    }
                                }
                            }
                            return end_part_index;
                        }
                        for (let idx = 1, end = line.Macro_Part_Count(); idx < end; idx += 1) {
                            const part = line.Macro_Part(idx);
                            Utils.Assert(!this.ignore_markup || !part.Is_Command(), `A query cannot contain a command while ignoring markup.`);
                            const partition_part = yield search.Maybe_Partition_Part(part.Value());
                            if (partition_part) {
                                for (const file_index of Object.keys(matches)) {
                                    if (partition_part.hasOwnProperty(file_index)) {
                                        for (const line_index of Object.keys(matches[file_index])) {
                                            if (partition_part[file_index].hasOwnProperty(line_index)) {
                                                for (const first_part_index of Object.keys(matches[file_index][line_index])) {
                                                    const end_part_index = Adjusted_End_Part_Index(file_index, line_index, first_part_index);
                                                    if (partition_part[file_index][line_index].includes(end_part_index)) {
                                                        matches[file_index][line_index][first_part_index] = end_part_index + 1;
                                                    }
                                                    else {
                                                        delete matches[file_index][line_index][first_part_index];
                                                    }
                                                }
                                            }
                                            else {
                                                delete matches[file_index][line_index];
                                            }
                                        }
                                    }
                                    else {
                                        delete matches[file_index];
                                    }
                                }
                            }
                            else {
                                matches = {};
                                break;
                            }
                        }
                        for (const file_index of Object.keys(matches)) {
                            for (const line_index of Object.keys(matches[file_index])) {
                                for (const first_part_index of Object.keys(matches[file_index][line_index])) {
                                    results.push(new Result.Instance({
                                        search: search,
                                        file_index: Number.parseInt(file_index),
                                        line_index: Number.parseInt(line_index),
                                        first_part_index: Number.parseInt(first_part_index),
                                        end_part_index: matches[file_index][line_index][first_part_index],
                                        first_part_offset: 0,
                                        last_part_offset: 0,
                                    }));
                                }
                            }
                        }
                    }
                }
            }
            return results;
        });
    }
    Ready() {
        const _super = Object.create(null, {
            Ready: { get: () => super.Ready }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.Ready.call(this);
            yield this.Refresh_Searches();
        });
    }
}
