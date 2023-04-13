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
        this.is_readying = false;
        this.dependencies = [];
    }
    Add_Dependencies(dependencies) {
        Utils.Assert(!this.Is_Ready(), `Cannot add dependencies after being ready.`);
        Utils.Assert(!this.is_readying, `Cannot add dependencies while readying.`);
        for (const dependency of dependencies) {
            Utils.Assert(this.dependencies.indexOf(dependency) < 0, `A dependency can only be added once.`);
            this.dependencies.push(dependency);
        }
    }
    Is_Ready() {
        return this.is_ready;
    }
    Before_Dependencies_Are_Ready() {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(false, `This method must be overridden to be used.`);
        });
    }
    After_Dependencies_Are_Ready() {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(false, `This method must be overridden to be used.`);
        });
    }
    Ready() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.is_readying) {
                yield Utils.Wait_Milliseconds(1);
            }
            this.is_readying = true;
            if (this.is_ready === false) {
                if (Object.getPrototypeOf(this).hasOwnProperty(`Before_Dependencies_Are_Ready`)) {
                    yield this.Before_Dependencies_Are_Ready();
                }
                if (this.dependencies.length > 0) {
                    yield Promise.all(this.dependencies.map(function (dependency) {
                        return dependency.Ready();
                    }));
                }
                if (Object.getPrototypeOf(this).hasOwnProperty(`After_Dependencies_Are_Ready`)) {
                    yield this.After_Dependencies_Are_Ready();
                }
                this.is_ready = true;
            }
            this.is_readying = false;
        });
    }
}
