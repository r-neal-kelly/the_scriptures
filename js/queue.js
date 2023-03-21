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
        this.slots = [];
        this.is_executing = false;
        this.is_paused = false;
    }
    Count() {
        return this.slots.length;
    }
    Enqueue(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(function (resolve) {
                this.slots.push(function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield callback();
                        resolve();
                    });
                });
                this.Execute();
            }.bind(this));
        });
    }
    Is_Executing() {
        return this.is_executing;
    }
    Execute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.is_executing === false &&
                this.is_paused === false) {
                this.is_executing = true;
                // the way this while loop is ordered allows
                // cleanly cutting off execution when a
                // pause or flush occurs, because the await
                // is at the end of the loop
                while (this.slots.length > 0 &&
                    this.is_paused === false) {
                    const callback = this.slots[0];
                    this.slots = this.slots.slice(1); // inefficient.
                    yield callback();
                }
                this.is_executing = false;
            }
        });
    }
    Is_Paused() {
        return (this.is_executing === false &&
            this.is_paused === true);
    }
    Pause() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.is_paused === false) {
                this.is_paused = true;
                while (this.is_executing === true &&
                    this.is_paused === true) {
                    yield Utils.Wait_Milliseconds(1);
                }
            }
        });
    }
    Unpause() {
        if (this.is_paused === true) {
            this.is_paused = false;
            this.Execute();
        }
    }
    Flush() {
        this.slots = [];
    }
}
