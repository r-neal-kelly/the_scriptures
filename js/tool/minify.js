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
import * as child_process from "child_process";
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
function Recursive_File_Paths(folder_path, names = []) {
    return __awaiter(this, void 0, void 0, function* () {
        const entities = yield Read_Directory(folder_path);
        for (let entity of entities) {
            if (entity.isDirectory()) {
                yield Recursive_File_Paths(`${folder_path}/${entity.name}`, names);
            }
            else {
                names.push(`${folder_path}/${entity.name}`);
            }
        }
        return names;
    });
}
function Minify() {
    return __awaiter(this, void 0, void 0, function* () {
        const file_paths = (yield Recursive_File_Paths(`./js`)).map(s => `"${s}"`);
        const promises = [];
        for (const file_path of file_paths) {
            promises.push(new Promise(function (resolve) {
                child_process.spawn("terser", [
                    file_path,
                    `-c`,
                    `-m`,
                    `-o ${file_path}`,
                ], {
                    shell: true,
                }).on(`close`, function () {
                    resolve();
                });
            }));
        }
        yield Promise.all(promises);
    });
}
(function Main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Minify();
    });
})();
