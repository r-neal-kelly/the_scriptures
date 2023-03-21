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
import * as Entity from "../../entity.js";
import * as Books from "./books.js";
export class Instance extends Entity.Instance {
    constructor({ model, root, }) {
        super(`div`, root.Event_Grid());
        this.model = model;
        this.root = root;
        this.books = null;
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return ({
                "display": `grid`,
                "width": `100%`,
                "height": `100%`,
                "overflow-x": `auto`,
                "overflow-y": `auto`,
                "color": `white`,
            });
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.Kill_All_Children();
            this.books = new Books.Instance({
                model: this.Model().Books(),
                browser: this,
            });
            this.Add_Child(this.books);
        });
    }
    Model() {
        return this.model;
    }
    Root() {
        return this.root;
    }
    Books() {
        Utils.Assert(this.books != null, `Does not have books.`);
        return this.books;
    }
}
