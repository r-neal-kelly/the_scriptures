var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as Utils from "../../utils.js";
import * as Entity from "../entity.js";
import * as Text from "../text.js";
export class Instance extends Entity.Instance {
    constructor({ version, leaf, }) {
        super();
        this.version = version;
        this.name = leaf.name;
        this.index = leaf.index;
        this.path = `${version.Path()}/${leaf.name}`;
        this.title = leaf.name.replace(/\.[^.]*$/, ``);
        this.extension = leaf.name.replace(/^[^.]*\./, ``);
        this.text = null;
        this.Add_Dependencies([]);
    }
    Version() {
        return this.version;
    }
    Name() {
        return this.name;
    }
    Index() {
        return this.index;
    }
    Path() {
        return this.path;
    }
    Title() {
        return this.title;
    }
    Extension() {
        return this.extension;
    }
    Text() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Ready();
            return this.text;
        });
    }
    After_Dependencies_Are_Ready() {
        return __awaiter(this, void 0, void 0, function* () {
            let text_value;
            const response = yield fetch(Utils.Resolve_Path(this.Path()));
            if (response.ok) {
                text_value = yield response.text();
            }
            else {
                text_value = null;
            }
            const dictionary = (yield this.Version().Dictionary()).Text_Dictionary();
            const compressor = this.Version().Language().Book().Data().Compressor();
            this.text = new Text.Instance({
                dictionary: dictionary,
                value: compressor.Decompress({
                    value: text_value || ``,
                    dictionary: dictionary,
                }),
            });
        });
    }
}
