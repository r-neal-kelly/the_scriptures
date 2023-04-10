var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Text from "../../../text.js";
import * as Entity from "../../../entity.js";
import * as File from "./file.js";
export class Instance extends Entity.Instance {
    static Blank_File() {
        return this.blank_file;
    }
    constructor({ body, }) {
        super();
        this.body = body;
        this.current_file = Instance.Blank_File();
        this.Add_Dependencies([
            this.current_file,
        ]);
    }
    Body() {
        return this.body;
    }
    File() {
        return this.current_file;
    }
    Open_File(file) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.current_file.Maybe_Data() != file) {
                if (file != null) {
                    const file_dictionary = (yield file.Version().Dictionary()).Text_Dictionary();
                    const file_value = ((yield file.Maybe_Text()) || ``).replace(/\r?\n\r?\n/g, `\n \n`);
                    this.current_file = new File.Instance({
                        reader: this,
                        data: file,
                        text: new Text.Instance({
                            dictionary: file_dictionary,
                            value: file_value,
                        }),
                    });
                    yield this.current_file.Ready();
                }
                else {
                    this.current_file = Instance.Blank_File();
                    yield this.current_file.Ready();
                }
            }
        });
    }
}
Instance.blank_file = new File.Instance({
    reader: null,
    data: null,
    text: new Text.Instance({
        dictionary: new Text.Dictionary.Instance({
            json: null,
        }),
        value: ``,
    }),
});
