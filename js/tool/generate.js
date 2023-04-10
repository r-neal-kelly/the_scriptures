var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as fs from "fs";
import * as Utils from "../utils.js";
import * as Text from "../model/text.js";
function Read_Directory(directory_path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            fs.readdir(directory_path, {
                withFileTypes: true,
            }, function (error, entities) {
                if (error != null) {
                    reject(error);
                }
                else {
                    resolve(entities);
                }
            });
        });
    });
}
function Read_File(file_path) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            fs.readFile(file_path, `utf8`, function (error, file_text) {
                if (error != null) {
                    reject(error);
                }
                else {
                    resolve(file_text);
                }
            });
        });
    });
}
function Write_File(file_path, data) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise(function (resolve, reject) {
            fs.writeFile(file_path, data, `utf8`, function (error) {
                if (error != null) {
                    reject(error);
                }
                else {
                    resolve();
                }
            });
        });
    });
}
function Folder_Names(folder_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const names = [];
        const entities = yield Read_Directory(folder_path);
        for (let entity of entities) {
            if (entity.isDirectory()) {
                names.push(entity.name);
            }
        }
        return names;
    });
}
function File_Names(folder_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const names = [];
        const entities = yield Read_Directory(folder_path);
        for (let entity of entities) {
            if (entity.isFile()) {
                names.push(entity.name);
            }
        }
        return names;
    });
}
class Unique_Names {
    constructor() {
        this.books = new Set();
        this.languages = new Set();
        this.versions = new Set();
    }
    Add_Book(name) {
        this.books.add(name);
    }
    Add_Language(name) {
        this.languages.add(name);
    }
    Add_Version(name) {
        this.versions.add(name);
    }
    Books() {
        return Array.from(this.books).sort();
    }
    Languages() {
        return Array.from(this.languages).sort();
    }
    Versions() {
        return Array.from(this.versions).sort();
    }
}
class Unique_Parts {
    constructor() {
        this.parts = {};
    }
    Add(part) {
        if (this.parts.hasOwnProperty(part)) {
            Utils.Assert(this.parts[part] < Number.MAX_SAFE_INTEGER, `Cannot add more of this unique part!`);
            this.parts[part] += 1;
        }
        else {
            this.parts[part] = 1;
        }
    }
    Values() {
        return Object.keys(this.parts).sort(function (a, b) {
            return this.parts[b] - this.parts[a];
        }.bind(this));
    }
    Count(part) {
        Utils.Assert(this.parts.hasOwnProperty(part), `Does not have part.`);
        return this.parts[part];
    }
}
class Unique_Part_Indices {
    constructor({ unique_part_values, }) {
        this.parts = {};
        for (let idx = 0, end = unique_part_values.length; idx < end; idx += 1) {
            this.parts[unique_part_values[idx]] = idx;
        }
    }
    Index(part_value) {
        Utils.Assert(this.parts.hasOwnProperty(part_value), `Unknown part_value.`);
        return this.parts[part_value];
    }
}
class Unique_Part_Values {
    constructor({ unique_part_values, }) {
        this.parts = {};
        for (let idx = 0, end = unique_part_values.length; idx < end; idx += 1) {
            this.parts[idx] = unique_part_values[idx];
        }
    }
    Value(part_index) {
        Utils.Assert(this.parts.hasOwnProperty(part_index), `Unknown part_index.`);
        return this.parts[part_index];
    }
}
function Generate() {
    return __awaiter(this, void 0, void 0, function* () {
        const data_info = {
            tree: {
                books: [],
            },
            unique_book_names: [],
            unique_language_names: [],
            unique_version_names: [],
            unique_part_values: [],
        };
        const unique_names = new Unique_Names();
        const unique_parts = new Unique_Parts();
        const data_path = `./Data`;
        const books_path = `${data_path}/Books`;
        for (const book_name of (yield Folder_Names(books_path)).sort()) {
            const languages_path = `${books_path}/${book_name}`;
            const book_branch = {
                name: book_name,
                languages: [],
            };
            data_info.tree.books.push(book_branch);
            unique_names.Add_Book(book_name);
            for (const language_name of (yield Folder_Names(languages_path)).sort()) {
                const versions_path = `${languages_path}/${language_name}`;
                const language_branch = {
                    name: language_name,
                    versions: [],
                };
                book_branch.languages.push(language_branch);
                unique_names.Add_Language(language_name);
                for (const version_name of (yield Folder_Names(versions_path)).sort()) {
                    const files_path = `${versions_path}/${version_name}`;
                    const version_branch = {
                        name: version_name,
                        files: [],
                    };
                    const dictionary = new Text.Dictionary.Instance({
                        json: yield Read_File(`${files_path}/Dictionary.json`),
                    });
                    language_branch.versions.push(version_branch);
                    unique_names.Add_Version(version_name);
                    for (const file_name of (yield File_Names(files_path)).filter(function (file_name) {
                        return (/\.txt$/.test(file_name) &&
                            !/COPY\.txt$/.test(file_name));
                    }).sort()) {
                        const file_path = `${files_path}/${file_name}`;
                        const file_leaf = {
                            name: file_name,
                        };
                        const text = new Text.Instance({
                            dictionary: dictionary,
                            value: yield Read_File(file_path),
                        });
                        version_branch.files.push(file_leaf);
                        for (let line_idx = 0, line_end = text.Line_Count(); line_idx < line_end; line_idx += 1) {
                            const line = text.Line(line_idx);
                            for (let part_idx = 0, part_end = line.Macro_Part_Count(); part_idx < part_end; part_idx += 1) {
                                const part = line.Macro_Part(part_idx);
                                unique_parts.Add(part.Value());
                            }
                        }
                    }
                }
            }
        }
        data_info.unique_book_names = unique_names.Books();
        data_info.unique_language_names = unique_names.Languages();
        data_info.unique_version_names = unique_names.Versions();
        data_info.unique_part_values = unique_parts.Values();
        yield Write_File(`${data_path}/Info.json`, JSON.stringify(data_info));
        const unique_part_indices = new Unique_Part_Indices({
            unique_part_values: data_info.unique_part_values,
        });
        const compressed_parts = [];
        for (const book_name of (yield Folder_Names(books_path)).sort()) {
            const languages_path = `${books_path}/${book_name}`;
            for (const language_name of (yield Folder_Names(languages_path)).sort()) {
                const versions_path = `${languages_path}/${language_name}`;
                for (const version_name of (yield Folder_Names(versions_path)).sort()) {
                    const files_path = `${versions_path}/${version_name}`;
                    const dictionary = new Text.Dictionary.Instance({
                        json: yield Read_File(`${files_path}/Dictionary.json`),
                    });
                    for (const file_name of (yield File_Names(files_path)).filter(function (file_name) {
                        return (/\.txt$/.test(file_name) &&
                            !/COPY\.txt$/.test(file_name));
                    }).sort()) {
                        const file_path = `${files_path}/${file_name}`;
                        const text = new Text.Instance({
                            dictionary: dictionary,
                            value: yield Read_File(file_path),
                        });
                        for (let line_idx = 0, line_end = text.Line_Count(); line_idx < line_end; line_idx += 1) {
                            const line = text.Line(line_idx);
                            for (let part_idx = 0, part_end = line.Macro_Part_Count(); part_idx < part_end; part_idx += 1) {
                                const part = line.Macro_Part(part_idx);
                                const index = unique_part_indices.Index(part.Value());
                                compressed_parts.push(String.fromCodePoint(index));
                            }
                        }
                    }
                }
            }
        }
        /*
        await Write_File(
            `${data_path}/Test_Compressed.txt`,
            compressed_parts.join(``),
        );
        */
        const unique_part_values = new Unique_Part_Values({
            unique_part_values: data_info.unique_part_values,
        });
        const uncompressed_parts = [];
        for (const compressed_part of compressed_parts) {
            uncompressed_parts.push(unique_part_values.Value(compressed_part.codePointAt(0)));
        }
        /*
        await Write_File(
            `${data_path}/Test_Uncompressed.txt`,
            uncompressed_parts.join(``),
        );
        */
    });
}
/*
if (fs.existsSync(`${versions_path}/${version_name}/Search`)) {
    fs.rmSync(
        `${versions_path}/${version_name}/Search`,
        {
            recursive: true,
            force: true,
        },
    );
}
*/
(function Main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Generate();
    });
})();
