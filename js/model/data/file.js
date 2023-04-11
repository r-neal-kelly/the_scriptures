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
    constructor({ version, leaf, }) {
        this.version = version;
        this.name = leaf.name;
        this.index = leaf.index;
        this.path = `${version.Path()}/${leaf.name}`;
        this.title = leaf.name.replace(/\.[^.]*$/, ``);
        this.extension = leaf.name.replace(/^[^.]*\./, ``);
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
            return (yield this.Version().Text()).Text_File_At(this.Index());
        });
    }
}
