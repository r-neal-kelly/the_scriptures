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
import * as Selector from "./selector.js";
import * as Reader from "./reader.js";
export class Instance extends Entity.Instance {
    constructor({ model, root, }) {
        super({
            element: `div`,
            parent: root,
            event_grid: root.Event_Grid(),
        });
        this.model = model;
        this.selector = null;
        this.reader = null;
    }
    On_Restyle() {
        return __awaiter(this, void 0, void 0, function* () {
            return `
            display: grid;
            grid-template-rows: 1fr;
            grid-template-columns: auto auto;
        
            width: 100%;
            height: 100%;

            overflow-x: hidden;
            overflow-y: hidden;

            color: white;
        `;
        });
    }
    On_Refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            this.Abort_All_Children();
            this.selector = new Selector.Instance({
                model: this.Model().Selector(),
                browser: this,
            });
            this.reader = new Reader.Instance({
                model: this.Model().Reader(),
                browser: this,
            });
        });
    }
    Model() {
        return this.model;
    }
    Root() {
        return this.Parent();
    }
    Selector() {
        Utils.Assert(this.selector != null, `Does not have selector.`);
        return this.selector;
    }
    Reader() {
        Utils.Assert(this.reader != null, `Does not have reader.`);
        return this.reader;
    }
}
