var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Instance {
    constructor() {
        this.slots = [];
        this.is_executing = false;
    }
    Count() {
        return this.slots.length;
    }
    Is_Executing() {
        return this.is_executing;
    }
    Execute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.Is_Executing() === false) {
                this.is_executing = true;
                while (this.slots.length > 0) {
                    yield this.slots[0]();
                    this.slots = this.slots.slice(1); // inefficient
                }
                this.is_executing = false;
            }
        });
    }
    Enqueue(callback) {
        return new Promise(function (resolve) {
            this.slots.push(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield callback();
                    resolve();
                });
            });
            this.Execute();
        }.bind(this));
    }
}
