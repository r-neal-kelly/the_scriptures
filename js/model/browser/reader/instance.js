var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "../../../utils.js";
import * as Async from "../../../async.js";
import * as Text from "../../text.js";
import * as File from "./file.js";
export class Instance extends Async.Instance {
    constructor({ browser, }) {
        super();
        this.browser = browser;
        this.file = null;
    }
    Browser() {
        return this.browser;
    }
    Has_File() {
        return this.file != null;
    }
    File() {
        Utils.Assert(this.Has_File(), `Has no file.`);
        return this.file;
    }
    Open_File(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.file == null ||
                this.file.Data() != file) {
                this.file = new File.Instance({
                    reader: this,
                    data: file,
                    text: new Text.Instance({
                        dictionary: (yield file.Files().Dictionary()).Text_Dictionary(),
                        value: ((yield file.Maybe_Text()) || ``).replace(/\r?\n\r?\n/g, `\n \n`),
                    }),
                });
            }
        });
    }
}
