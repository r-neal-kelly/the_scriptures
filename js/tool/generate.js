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
import * as Data from "../model/data.js";
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
function Filter_File_Names(file_name) {
    return (/\.txt$/.test(file_name) &&
        !/COPY\.txt$/.test(file_name) &&
        !new RegExp(`^${Data.Version.Text.Symbol.TITLE}\\.${Data.Version.Text.Symbol.EXTENSION}$`).test(file_name));
}
;
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
                    const file_names = (yield File_Names(files_path)).filter(Filter_File_Names).sort();
                    language_branch.versions.push(version_branch);
                    unique_names.Add_Version(version_name);
                    for (const [file_index, file_name] of file_names.entries()) {
                        const file_path = `${files_path}/${file_name}`;
                        const file_leaf = {
                            name: file_name,
                            index: file_index,
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
        const compressor = new Data.Compressor.Instance({
            unique_parts: data_info.unique_part_values,
        });
        for (const book_name of (yield Folder_Names(books_path)).sort()) {
            const languages_path = `${books_path}/${book_name}`;
            for (const language_name of (yield Folder_Names(languages_path)).sort()) {
                const versions_path = `${languages_path}/${language_name}`;
                for (const version_name of (yield Folder_Names(versions_path)).sort()) {
                    const files_path = `${versions_path}/${version_name}`;
                    const file_names = (yield File_Names(files_path)).filter(Filter_File_Names).sort();
                    const file_texts = [];
                    for (const file_name of file_names) {
                        const file_path = `${files_path}/${file_name}`;
                        file_texts.push(yield Read_File(file_path));
                    }
                    const version_dictionary = new Text.Dictionary.Instance({
                        json: yield Read_File(`${files_path}/Dictionary.json`),
                    });
                    const version_text = file_texts.join(Data.Version.Symbol.FILE_BREAK);
                    const compressed_version_text = compressor.Compress({
                        value: version_text,
                        dictionary: version_dictionary,
                    });
                    const uncompressed_version_text = compressor.Decompress({
                        value: compressed_version_text,
                        dictionary: version_dictionary,
                    });
                    Utils.Assert(version_text === uncompressed_version_text, `Invalid decompression!`);
                    yield Write_File(`${files_path}/${Data.Version.Text.Symbol.NAME}`, compressed_version_text);
                }
            }
        }
    });
}
(function Main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Generate();
    });
})();
