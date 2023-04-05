var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "../../../../utils.js";
import * as Entity from "../../../entity.js";
export class Instance extends Entity.Instance {
    constructor({ commands, }) {
        super();
        this.commands = commands;
        this.Is_Ready_After([]);
    }
    Commands() {
        return this.commands;
    }
    Symbol() {
        Utils.Assert(false, `This method must be overridden.`);
        return ``;
    }
    Click() {
        return __awaiter(this, void 0, void 0, function* () {
            Utils.Assert(false, `This method must be overridden.`);
        });
    }
}