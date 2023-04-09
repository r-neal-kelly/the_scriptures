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
import * as Unicode from "../../unicode.js";
import * as Entity from "../entity.js";
import * as Data from "../data.js";
import * as Text from "../text.js";
import * as Result from "./result.js";
export class Instance extends Entity.Instance {
    constructor({ book_names = null, language_names = null, version_names = null, ignore_markup = true, respect_case = true, align_on_part = true, }) {
        super();
        this.book_names = book_names;
        this.language_names = language_names;
        this.version_names = version_names;
        this.ignore_markup = ignore_markup;
        this.align_on_part = align_on_part;
        this.respect_case = respect_case;
        this.searches = [];
        this.Is_Ready_After([
            Data.Singleton(),
        ]);
    }
    Set({ book_names = null, language_names = null, version_names = null, }) {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(this.Is_Ready(), `Is not ready.`);
            this.book_names = book_names != null ?
                Array.from(book_names) : null;
            this.language_names = language_names != null ?
                Array.from(language_names) : null;
            this.version_names = version_names != null ?
                Array.from(version_names) : null;
            this.searches = yield Data.Singleton().Searches({
                book_names: this.book_names,
                language_names: this.language_names,
                version_names: this.version_names,
            });
        });
    }
    Suggestions(query) {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(this.Is_Ready(), `Is not ready.`);
            Utils.Assert(!/\r?\n/.test(query), `query cannot have any newlines.`);
            const suggestions = new Set();
            for (const search of this.searches) {
                const line = new Text.Instance({
                    value: query,
                    dictionary: (yield search.Version().Files().Dictionary()).Text_Dictionary(),
                }).Line(0);
                if (line.Macro_Part_Count() > 0) {
                    const uniques = yield search.Uniques().Info();
                    const part = line.Macro_Part(line.Macro_Part_Count() - 1);
                    if (!this.respect_case) {
                        const value = part.Value().toLowerCase();
                        const value_first_point = Unicode.First_Point(value);
                        const first_points = [
                            value_first_point.toLowerCase(),
                            value_first_point.toUpperCase(),
                        ];
                        for (const first_point of first_points) {
                            for (const unique of uniques[first_point] || []) {
                                const comparable_unique = unique.toLowerCase();
                                if (comparable_unique.length > value.length &&
                                    comparable_unique.slice(0, value.length) === value) {
                                    suggestions.add(unique);
                                }
                            }
                        }
                    }
                    else {
                        const value = part.Value();
                        const value_first_point = Unicode.First_Point(value);
                        for (const unique of uniques[value_first_point] || []) {
                            if (unique.length > value.length &&
                                unique.slice(0, value.length) === value) {
                                suggestions.add(unique);
                            }
                        }
                    }
                }
            }
            return Array.from(suggestions).sort();
        });
    }
    Queries(search, query) {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(this.Is_Ready(), `Is not ready.`);
            Utils.Assert(!/\r?\n/.test(query), `query cannot have any newlines.`);
            let queries = [];
            if (query.length > 0) {
                const uniques = yield search.Uniques().Info();
                const line = new Text.Instance({
                    value: query,
                    dictionary: (yield search.Version().Files().Dictionary()).Text_Dictionary(),
                }).Line(0);
                for (let part_idx = 0, part_end = line.Macro_Part_Count(); part_idx < part_end; part_idx += 1) {
                    const part = line.Macro_Part(part_idx);
                    Utils.Assert(!this.ignore_markup || !part.Is_Command(), `A query cannot contain a command when ignoring markup.`);
                    const part_uniques = new Map();
                    if (!this.align_on_part &&
                        (part_idx === 0 ||
                            part_idx === part_end - 1)) {
                        const value = !this.respect_case ?
                            part.Value().toLowerCase() :
                            part.Value();
                        if (part_idx === 0) {
                            for (const first_point of Object.keys(uniques)) {
                                for (const unique of uniques[first_point]) {
                                    if (!part_uniques.has(unique)) {
                                        const comparable_unique = !this.respect_case ?
                                            unique.toLowerCase() :
                                            unique;
                                        if (comparable_unique.length >= value.length &&
                                            comparable_unique.slice(comparable_unique.length - value.length, comparable_unique.length) === value) {
                                            part_uniques.set(unique, {
                                                value: unique,
                                                first_unit_index: comparable_unique.length - value.length,
                                                end_unit_index: comparable_unique.length,
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        else if (part_idx === part_end - 1) {
                            const value_first_point = Unicode.First_Point(value);
                            const first_points = !this.respect_case ?
                                [
                                    value_first_point.toLowerCase(),
                                    value_first_point.toUpperCase(),
                                ] : [
                                value_first_point,
                            ];
                            for (const first_point of first_points) {
                                for (const unique of uniques[first_point] || []) {
                                    if (!part_uniques.has(unique)) {
                                        const comparable_unique = !this.respect_case ?
                                            unique.toLowerCase() :
                                            unique;
                                        if (comparable_unique.length >= value.length &&
                                            comparable_unique.slice(0, value.length) === value) {
                                            part_uniques.set(unique, {
                                                value: unique,
                                                first_unit_index: 0,
                                                end_unit_index: value.length,
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else if (!this.respect_case) {
                        const value = part.Value().toLowerCase();
                        const value_first_point = Unicode.First_Point(value);
                        const first_points = [
                            value_first_point.toLowerCase(),
                            value_first_point.toUpperCase(),
                        ];
                        for (const first_point of first_points) {
                            for (const unique of uniques[first_point] || []) {
                                if (!part_uniques.has(unique)) {
                                    if (unique.toLowerCase() === value) {
                                        part_uniques.set(unique, {
                                            value: unique,
                                            first_unit_index: 0,
                                            end_unit_index: unique.length,
                                        });
                                    }
                                }
                            }
                        }
                    }
                    else {
                        const value = part.Value();
                        const value_first_point = Unicode.First_Point(value);
                        if (uniques[value_first_point] != null &&
                            uniques[value_first_point].includes(value)) {
                            if (!part_uniques.has(value)) {
                                part_uniques.set(value, {
                                    value: value,
                                    first_unit_index: 0,
                                    end_unit_index: value.length,
                                });
                            }
                        }
                    }
                    if (part_uniques.size > 0) {
                        if (part_idx === 0) {
                            for (const part_unique of part_uniques.values()) {
                                queries.push([part_unique]);
                            }
                        }
                        else {
                            const previous_queries = queries;
                            queries = [];
                            for (const previous_query of previous_queries) {
                                for (const part_unique of part_uniques.values()) {
                                    queries.push(previous_query.concat(part_unique));
                                }
                            }
                        }
                    }
                    else {
                        queries = [];
                        break;
                    }
                }
            }
            return queries;
        });
    }
    Results(query) {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(this.Is_Ready(), `Is not ready.`);
            Utils.Assert(!/\r?\n/.test(query), `query cannot have any newlines.`);
            const results = [];
            if (query.length > 0) {
                for (const search of this.searches) {
                    const queries = yield this.Queries(search, query);
                    const commands = queries.length > 0 && this.ignore_markup ?
                        yield search.Maybe_Partition_Parts(Text.Part.Command.Brace.OPEN) :
                        null;
                    function Adjusted_End_Part_Index(file_index, line_index, current_end_part_index) {
                        if (commands != null) {
                            for (const command of Object.keys(commands)) {
                                if (commands[command].hasOwnProperty(file_index)) {
                                    if (commands[command][file_index].hasOwnProperty(line_index)) {
                                        if (commands[command][file_index][line_index].includes(current_end_part_index)) {
                                            current_end_part_index += 1;
                                        }
                                    }
                                }
                            }
                        }
                        return current_end_part_index;
                    }
                    for (const query of queries) {
                        Utils.Assert(query.length > 0, `query should have a length greater than 0, queries array is messed up.`);
                        const matches = {};
                        const first_partition_part = yield search.Maybe_Partition_Part(query[0].value);
                        Utils.Assert(first_partition_part != null, `first_partition_part should not be null, queries array is messed up.`);
                        for (const file_index of Object.keys(first_partition_part)) {
                            matches[file_index] = {};
                            for (const line_index of Object.keys(first_partition_part[file_index])) {
                                matches[file_index][line_index] = {};
                                for (const part_index of first_partition_part[file_index][line_index]) {
                                    matches[file_index][line_index][part_index.toString()] = part_index + 1;
                                }
                            }
                        }
                        for (let idx = 1, end = query.length; idx < end; idx += 1) {
                            const partition_part = yield search.Maybe_Partition_Part(query[idx].value);
                            Utils.Assert(partition_part != null, `partition_part should not be null, queries array is messed up.`);
                            for (const file_index of Object.keys(matches)) {
                                if (partition_part.hasOwnProperty(file_index)) {
                                    for (const line_index of Object.keys(matches[file_index])) {
                                        if (partition_part[file_index].hasOwnProperty(line_index)) {
                                            for (const first_part_index of Object.keys(matches[file_index][line_index])) {
                                                const end_part_index = Adjusted_End_Part_Index(file_index, line_index, matches[file_index][line_index][first_part_index]);
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
                        for (const file_index of Object.keys(matches)) {
                            for (const line_index of Object.keys(matches[file_index])) {
                                for (const first_part_index of Object.keys(matches[file_index][line_index])) {
                                    results.push(new Result.Instance({
                                        search: search,
                                        file_index: Number.parseInt(file_index),
                                        line_index: Number.parseInt(line_index),
                                        first_part_index: Number.parseInt(first_part_index),
                                        end_part_index: matches[file_index][line_index][first_part_index],
                                        first_part_first_unit_index: query[0].first_unit_index,
                                        last_part_end_unit_index: query[query.length - 1].end_unit_index,
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
            this.searches = yield Data.Singleton().Searches({
                book_names: this.book_names,
                language_names: this.language_names,
                version_names: this.version_names,
            });
        });
    }
}