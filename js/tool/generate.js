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
import * as Unicode from "../unicode.js";
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
function Generate_Data(folder_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = {};
        yield Generate_Books(`${folder_path}/Books`);
        yield Write_File(`${folder_path}/Info.json`, JSON.stringify(info, null, 4));
    });
}
function Generate_Books(folder_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = {
            names: [],
        };
        info.names = (yield Folder_Names(folder_path)).sort();
        yield Promise.all(info.names.map(function (name) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Generate_Book(`${folder_path}/${name}`);
            });
        }));
        yield Write_File(`${folder_path}/Info.json`, JSON.stringify(info, null, 4));
    });
}
function Generate_Book(folder_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = {};
        yield Generate_Languages(`${folder_path}/Languages`);
        yield Write_File(`${folder_path}/Info.json`, JSON.stringify(info, null, 4));
    });
}
function Generate_Languages(folder_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = {
            names: [],
        };
        info.names = (yield Folder_Names(folder_path)).sort();
        yield Promise.all(info.names.map(function (name) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Generate_Language(`${folder_path}/${name}`);
            });
        }));
        yield Write_File(`${folder_path}/Info.json`, JSON.stringify(info, null, 4));
    });
}
function Generate_Language(folder_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = {};
        yield Generate_Versions(`${folder_path}/Versions`);
        yield Write_File(`${folder_path}/Info.json`, JSON.stringify(info, null, 4));
    });
}
function Generate_Versions(folder_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = {
            names: [],
        };
        info.names = (yield Folder_Names(folder_path)).sort();
        yield Promise.all(info.names.map(function (name) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Generate_Version(`${folder_path}/${name}`);
            });
        }));
        yield Write_File(`${folder_path}/Info.json`, JSON.stringify(info, null, 4));
    });
}
function Generate_Version(folder_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = {};
        const files_info = yield Generate_Files(`${folder_path}/Files`);
        yield Generate_Search(folder_path, files_info.names);
        yield Write_File(`${folder_path}/Info.json`, JSON.stringify(info, null, 4));
    });
}
function Generate_Files(folder_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = {
            names: [],
        };
        info.names = (yield File_Names(folder_path)).filter(function (name) {
            return (/\.txt$/.test(name) &&
                !/COPY\.txt$/.test(name));
        }).sort();
        yield Promise.all(info.names.map(function (file_name) {
            return __awaiter(this, void 0, void 0, function* () {
                yield Generate_File(folder_path, file_name);
            });
        }));
        yield Write_File(`${folder_path}/Info.json`, JSON.stringify(info, null, 4));
        return info;
    });
}
function Generate_File(files_folder_path, file_name) {
    return __awaiter(this, void 0, void 0, function* () {
        const file_info = {
            line_count: 0,
            line_names: [],
        };
        const file_folder_path = `${files_folder_path}/${file_name.replace(/\.[^.]*$/, ``)}`;
        if (fs.existsSync(file_folder_path)) {
            fs.rmSync(file_folder_path, {
                recursive: true,
                force: true,
            });
        }
        fs.mkdirSync(file_folder_path);
        const dictionary = new Text.Dictionary.Instance({
            json: yield Read_File(`${files_folder_path}/Dictionary.json`),
        });
        const text = new Text.Instance({
            dictionary: dictionary,
            value: yield Read_File(`${files_folder_path}/${file_name}`),
        });
        for (let line_idx = 0, end = text.Line_Count(); line_idx < end; line_idx += 1) {
            const line = text.Line(line_idx);
            const value = line.Value();
            file_info.line_count += 1;
            if (value != ``) {
                file_info.line_names.push(`${line_idx}.txt`);
                yield Write_File(`${file_folder_path}/${line_idx}.txt`, line.Value());
            }
        }
        yield Write_File(`${file_folder_path}/Info.json`, JSON.stringify(file_info, null, 4));
    });
}
function Generate_Search(version_folder_path, file_names) {
    return __awaiter(this, void 0, void 0, function* () {
        // We cache data it bite-sized chunks to diminish band-width usage for the serverless
        // client, and at the same time make searching overall more efficient than brute-force.
        // Maybe this code should be in its own module so that the code to write and read it
        // are in the same location. However, wed want to supply it the dictionary data and
        // and the data for each file through node .js, and it can remain agnostic to the
        // environment.
        const uniques = {};
        const occurrences = {};
        const occurrences_info = {
            names: [],
        };
        for (let file_idx = 0, end = file_names.length; file_idx < end; file_idx += 1) {
            const dictionary = new Text.Dictionary.Instance({
                json: yield Read_File(`${version_folder_path}/Files/Dictionary.json`),
            });
            const text = new Text.Instance({
                dictionary: dictionary,
                value: yield Read_File(`${version_folder_path}/Files/${file_names[file_idx]}`),
            });
            for (let line_idx = 0, end = text.Line_Count(); line_idx < end; line_idx += 1) {
                const line = text.Line(line_idx);
                for (let part_idx = 0, end = line.Macro_Part_Count(); part_idx < end; part_idx += 1) {
                    const part = line.Macro_Part(part_idx);
                    const value = part.Value();
                    const point = Unicode.First_Point(value);
                    if (!uniques.hasOwnProperty(point)) {
                        uniques[point] = [];
                    }
                    if (!uniques[point].includes(value)) {
                        uniques[point].push(value);
                    }
                    if (!occurrences.hasOwnProperty(point)) {
                        occurrences[point] = {};
                    }
                    if (!occurrences[point].hasOwnProperty(value)) {
                        occurrences[point][value] = {};
                    }
                    if (!occurrences[point][value].hasOwnProperty(file_idx)) {
                        occurrences[point][value][file_idx] = {};
                    }
                    if (!occurrences[point][value][file_idx].hasOwnProperty(line_idx)) {
                        occurrences[point][value][file_idx][line_idx] = [];
                    }
                    occurrences[point][value][file_idx][line_idx].push(part_idx);
                }
            }
        }
        for (const point of Object.keys(uniques)) {
            uniques[point].sort();
        }
        if (fs.existsSync(`${version_folder_path}/Search`)) {
            fs.rmSync(`${version_folder_path}/Search`, {
                recursive: true,
                force: true,
            });
        }
        fs.mkdirSync(`${version_folder_path}/Search`);
        fs.mkdirSync(`${version_folder_path}/Search/Occurrences`);
        yield Write_File(`${version_folder_path}/Search/${Data.Search.Uniques.Instance.Name()}`, JSON.stringify(uniques));
        for (const point of Object.keys(occurrences)) {
            const name = point.codePointAt(0).toString();
            occurrences_info.names.push(`${name}.json`);
            yield Write_File(`${version_folder_path}/Search/Occurrences/${name}.json`, JSON.stringify(occurrences[point]));
        }
        yield Write_File(`${version_folder_path}/Search/Occurrences/Info.json`, JSON.stringify(occurrences_info, null, 4));
    });
}
// This maybe should read and write to the info files instead of
// always generating it, that way we can add info to it manually
// when needed. However, things that we might think need to be added
// manually may not need to be, for example which direction a language
// needs to be displayed in the view, either left-to-right, or right-to-left.
// We can simply define that by its language in a global cache, even in this
// file, or maybe from a module. E.g. English is ltr, and Hebrew rtl.
(function Main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Generate_Data(`./Data`);
    });
})();