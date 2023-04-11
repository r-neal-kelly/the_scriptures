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
export var Symbol;
(function (Symbol) {
    Symbol["NAME"] = "Dictionary.comp";
    Symbol["TITLE"] = "Dictionary";
    Symbol["EXTENSION"] = "comp";
})(Symbol || (Symbol = {}));
export class Instance extends Async.Instance {
    constructor({ version, }) {
        super();
        this.version = version;
        this.path = `${version.Path()}/${Symbol.NAME}`;
        this.text_dictionary = null;
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
    Text_Dictionary() {
        Utils.Assert(this.Is_Ready(), `Not ready.`);
        Utils.Assert(this.text_dictionary != null, `text_dictionary should not be null when this is ready!`);
        return this.text_dictionary;
    }
    After_Dependencies_Are_Ready() {
        return __awaiter(this, void 0, void 0, function* () {
            let text_dictionary_json;
            const response = yield fetch(Utils.Resolve_Path(this.Path()));
            if (response.ok) {
                const compressor = this.Version().Language().Book().Data().Compressor();
                text_dictionary_json = compressor.Decompress_Dictionary(yield response.text());
            }
            else {
                text_dictionary_json = null;
            }
            this.text_dictionary = new Text.Dictionary.Instance({
                json: text_dictionary_json,
            });
        });
    }
}
