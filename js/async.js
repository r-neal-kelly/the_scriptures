var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "./utils.js";
export class Instance {
    constructor() {
        this.is_ready = false;
        this.dependencies = [];
    }
    Is_Ready_After(dependencies) {
        for (const dependency of dependencies) {
            Utils.Assert(this.dependencies.indexOf(dependency) < 0, `A dependency can only be added once.`);
            this.dependencies.push(dependency);
        }
    }
    Is_Ready() {
        return this.is_ready;
    }
    Ready() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.is_ready === false) {
                yield Promise.all(this.dependencies.map(function (dependency) {
                    return dependency.Ready();
                }));
                this.is_ready = true;
            }
        });
    }
}
