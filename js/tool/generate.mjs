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
        yield Generate_Files(`${folder_path}/Files`);
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
        yield Generate_Search(folder_path, info.names);
        yield Write_File(`${folder_path}/Info.json`, JSON.stringify(info, null, 4));
    });
}
function Generate_Search(folder_path, file_names) {
    return __awaiter(this, void 0, void 0, function* () {
        return;
        console.log(folder_path);
        console.log(file_names);
        const search = {};
        for (let idx = 0, end = file_names.length; idx < end; idx += 1) {
        }
        //console.log(await Read_File(`${folder_path}/${file_names[0]}`));
    });
}
// This really should read and write to the info file instead of
// always generating it, that way we can add info to it manually
// when needed.
(function Main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Generate_Data(`./Data`);
    });
})();
