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
import * as Version from "./instance.js";
export var Symbol;
(function (Symbol) {
    Symbol["NAME"] = "Text.comp";
    Symbol["TITLE"] = "Text";
    Symbol["EXTENSION"] = "comp";
})(Symbol || (Symbol = {}));
export class Instance extends Async.Instance {
    constructor({ version, }) {
        super();
        this.version = version;
        this.path = `${version.Path()}/${Symbol.NAME}`;
        this.text_files = [];
        this.Add_Dependencies([
            this.Version().Language().Book().Data(),
        ]);
    }
    Version() {
        return this.version;
    }
    Name() {
        return Symbol.NAME;
    }
    Path() {
        return this.path;
    }
    Title() {
        return Symbol.TITLE;
    }
    Extension() {
        return Symbol.EXTENSION;
    }
    Text_File_Count() {
        return this.text_files.length;
    }
    Text_File_At(text_file_index) {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        Utils.Assert(text_file_index > -1, `text_file_index must be greater than -1.`);
        Utils.Assert(text_file_index < this.Text_File_Count(), `text_file_index must be less than text_file_count.`);
        return this.text_files[text_file_index];
    }
    After_Dependencies_Are_Ready() {
        return __awaiter(this, void 0, void 0, function* () {
            let text_version;
            const response = yield fetch(Utils.Resolve_Path(this.Path()));
            if (response.ok) {
                text_version = yield response.text();
            }
            else {
                text_version = null;
            }
            if (text_version != null) {
                const dictionary = (yield this.Version().Dictionary()).Text_Dictionary();
                const compressor = this.Version().Language().Book().Data().Compressor();
                for (const text_file of compressor.Decompress({
                    value: text_version,
                    dictionary: dictionary,
                }).split(Version.Symbol.FILE_BREAK)) {
                    this.text_files.push(new Text.Instance({
                        dictionary: dictionary,
                        value: text_file,
                    }));
                }
            }
        });
    }
}
